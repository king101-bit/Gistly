import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface AuthButtonsProps {
  action?: string
  size?: 'sm' | 'md' | 'lg'
  layout?: 'horizontal' | 'vertical'
}

export function AuthButtons({
  action,
  size = 'md',
  layout = 'horizontal',
}: AuthButtonsProps) {
  const buttonSizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  const containerClass =
    layout === 'vertical' ? 'flex flex-col gap-3' : 'flex gap-3'

  return (
    <div className="card-elevated rounded-2xl p-6 text-center">
      {action && (
        <div className="mb-4">
          <p className="text-muted-foreground mb-2">Join Gistly to {action}</p>
          <div className="text-2xl">🇳🇬</div>
        </div>
      )}

      <h3 className="text-xl font-bold text-foreground mb-2">
        Connect with Nigerians worldwide
      </h3>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        Share your gist, discover trending topics, and be part of the largest
        Nigerian social community online.
      </p>

      <div className={containerClass}>
        <Link href="/signin" className="flex-1">
          <Button
            className={`w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold glow-effect ${buttonSizes[size]}`}
          >
            Join Gistly
          </Button>
        </Link>

        <Link href="/signin" className="flex-1">
          <Button
            variant="outline"
            className={`w-full border-emerald-400 text-emerald-400 hover:bg-emerald-400/10 bg-transparent font-bold ${buttonSizes[size]}`}
          >
            Sign In
          </Button>
        </Link>
      </div>

      <p className="text-xs text-muted-foreground mt-4">
        Join thousands of Nigerians sharing their stories and connecting across
        the globe
      </p>
    </div>
  )
}
