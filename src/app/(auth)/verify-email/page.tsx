import Mail from '@/components/svg/Mail'

export default function VerifyEmail() {
  return (
    <div className="min-h-screen text-center text-foreground flex flex-col justify-center items-center space-y-6 px-4">
      <Mail />
      <h1 className="text-lg font-semibold text-emerald-500">
        Check your email to verify your account.
      </h1>
      <p className="text-sm text-gray-600 dark:text-white  max-w-md">
        We've sent a verification link to your email. Please click the link in
        that email to activate your account. If you didn't receive the email,
        check your spam folder.
      </p>
    </div>
  )
}
