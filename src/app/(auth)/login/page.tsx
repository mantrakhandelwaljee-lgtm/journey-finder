import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-[-0.03em] font-heading">Journey Finder</h1>
        <p className="text-muted-foreground mt-2 font-serif italic">Find your travel companion</p>
      </div>
      <LoginForm />

      {/* Tester credentials box */}
      <div className="mt-5 rounded-xl border border-dashed border-primary/30 bg-primary/5 px-5 py-4 text-center space-y-1.5">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary/70 font-sans">Demo Credentials</p>
        <div className="flex items-center justify-center gap-2 text-sm text-foreground/80">
          <span className="text-muted-foreground font-sans">Email:</span>
          <code className="font-mono text-[13px] bg-background/80 border border-border/50 rounded-md px-2 py-0.5 select-all">tester@journeyfinder.com</code>
        </div>
        <div className="flex items-center justify-center gap-2 text-sm text-foreground/80">
          <span className="text-muted-foreground font-sans">OTP:</span>
          <code className="font-mono text-[13px] bg-background/80 border border-border/50 rounded-md px-2 py-0.5 tracking-[0.25em] select-all">000000</code>
        </div>
      </div>
    </div>
  )
}
