'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../../hooks/useAuth'

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login, signup } = useAuth()
  const router = useRouter()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError('') // Clear error when user types
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      let result
      if (isSignUp) {
        result = await signup({
          displayName: formData.fullName,
          username: formData.username,
          email: formData.email,
          password: formData.password,
        })
      } else {
        result = await login(formData.email, formData.password)
      }

      if (result.success) {
        router.push('/')
      } else {
        setError(result.error || 'Something went wrong')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleMode = () => {
    setIsSignUp(!isSignUp)
    setFormData({ fullName: '', username: '', email: '', password: '' })
    setError('')
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground rounded-full"
            >
              <ArrowLeft className="size-5" />
            </Button>
          </Link>
          <div className="text-3xl font-black bg-gradient-to-r from-emerald-400 to-yellow-400 bg-clip-text text-transparent mb-4">
            Gistly
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {isSignUp ? 'Join the community!' : 'Welcome back!'}
          </h1>
          <p className="text-muted-foreground">
            {isSignUp
              ? 'Connect with Nigerians worldwide 🇳🇬'
              : 'Sign in to continue your naija gist'}
          </p>
        </div>

        {/* Auth Form */}
        <div className="card-elevated rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
                {error}
              </div>
            )}

            {/* Full Name - Only for Sign Up */}
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Your full name"
                    value={formData.fullName}
                    onChange={(e) =>
                      handleInputChange('fullName', e.target.value)
                    }
                    className="pl-10 bg-zinc-800/50 border-zinc-700 focus:border-emerald-400 h-12"
                    required
                  />
                </div>
              </div>
            )}

            {/* Username - Only for Sign Up */}
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Username
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                    @
                  </span>
                  <Input
                    placeholder="username"
                    value={formData.username}
                    onChange={(e) =>
                      handleInputChange('username', e.target.value)
                    }
                    className="pl-8 bg-zinc-800/50 border-zinc-700 focus:border-emerald-400 h-12"
                    required
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="pl-10 bg-zinc-800/50 border-zinc-700 focus:border-emerald-400 h-12"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={isSignUp ? 'Create a password' : 'Your password'}
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange('password', e.target.value)
                  }
                  className="pl-10 pr-10 bg-zinc-800/50 border-zinc-700 focus:border-emerald-400 h-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-3 font-bold text-lg glow-effect h-12"
            >
              {isLoading
                ? isSignUp
                  ? 'Creating Account...'
                  : 'Signing in...'
                : isSignUp
                  ? 'Join gistly'
                  : 'Sign In 🇳🇬'}
            </Button>

            {/* Toggle Mode */}
            <div className="text-center">
              <button
                type="button"
                onClick={toggleMode}
                className="text-emerald-400 hover:text-emerald-300 font-semibold hover:underline"
              >
                {isSignUp
                  ? 'Already have an account? Sign In'
                  : "Don't have an account? Join Now"}
              </button>
            </div>
          </form>
        </div>

        {/* Terms */}
        <p className="text-xs text-muted-foreground text-center mt-6">
          By {isSignUp ? 'joining' : 'signing in'}, you agree to our{' '}
          <Link href="/terms" className="text-emerald-400 hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-emerald-400 hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  )
}
