import NextAuth, { DefaultSession } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { createAdminClient } from "@/lib/supabase/admin"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      authProvider: string
      isOnboarded: boolean
    } & DefaultSession["user"]
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      id: "email-otp",
      name: "Email OTP",
      credentials: {
        email: { label: "Email", type: "email" },
        otp: { label: "OTP", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.otp) {
          return null
        }

        const email = credentials.email as string
        const otp = credentials.otp as string

        const supabase = createAdminClient()

        // Find the latest valid OTP for this email
        const { data: otpRecords } = await (supabase.from('otps') as any)
          .select('*')
          .eq('email', email)
          .eq('otp', otp)
          .gte('expires_at', new Date().toISOString())
          .order('created_at', { ascending: false })
          .limit(1)

        if (!otpRecords || otpRecords.length === 0) {
          return null // Invalid or expired OTP
        }

        // Delete the used OTP (and any older ones for this email to clean up)
        await (supabase.from('otps') as any).delete().eq('email', email)

        // Check if user exists
        let { data: user } = await (supabase.from('users') as any)
          .select('*')
          .eq('email', email)
          .single()

        if (!user) {
          // Create new user
          const newUserId = crypto.randomUUID()
          const { data: newUser, error } = await (supabase.from('users') as any)
            .insert({
              id: newUserId,
              email: email,
              name: email.split('@')[0], // Default name
              auth_provider: 'email',
              is_onboarded: false,
            })
            .select()
            .single()

          if (error) {
            console.error("Error creating user:", error)
            return null
          }
          user = newUser
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.id) return false;
      return true;
    },
    async jwt({ token, user, account, trigger, session }) {
      if (user) {
        token.id = user.id
        token.authProvider = "email"
        
        // Fetch onboarded status from DB only on initial sign in
        try {
          const supabase = createAdminClient();
          const { data } = await supabase
            .from('users')
            .select('is_onboarded')
            .eq('id', user.id as string)
            .single();
            
          token.isOnboarded = (data as any)?.is_onboarded ?? false;
        } catch (error) {
          token.isOnboarded = false;
        }
      }
      
      // Handle explicit session updates from the client
      if (trigger === "update" && session?.isOnboarded !== undefined) {
        token.isOnboarded = session.isOnboarded;
      }
      
      return token
    },
    async session({ session, token }) {
      if (token.id && session.user) {
        session.user.id = token.id as string
        session.user.authProvider = token.authProvider as string
        session.user.isOnboarded = token.isOnboarded as boolean
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
})
