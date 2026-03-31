import { AlertTriangle } from 'lucide-react'
import type { ReactNode } from 'react'
import { Component } from 'react'
import { Button } from '@/components/ui/button'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error) {
    console.error('ErrorBoundary caught:', error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-background/50 p-4 backdrop-blur-sm">
          <div className="flex max-w-sm flex-col items-center text-center bg-card/60 backdrop-blur-xl rounded-2xl p-6 shadow-2xl">
            <div className="mb-4 rounded-full bg-status-error/10 p-3">
              <AlertTriangle className="size-6 text-status-error" />
            </div>
            <h1 className="text-sm font-semibold text-foreground mb-1.5 tracking-wide uppercase">
              Application Error
            </h1>
            <p className="text-muted-foreground text-[11px] mb-5 line-clamp-3">
              {this.state.error?.message || 'An unexpected error occurred in the renderer process.'}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full h-8 text-[11px] bg-background/50 hover:bg-background"
              onClick={() => window.location.reload()}
            >
              Reload Application
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
