import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-[-0.03em] font-heading">Journey Finder</h1>
        <p className="text-muted-foreground mt-2 font-serif italic">Find your travel companion</p>
      </div>
      <LoginForm />
    </div>
  )
}
