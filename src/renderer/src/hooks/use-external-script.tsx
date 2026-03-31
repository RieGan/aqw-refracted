import { useEffect } from 'react'

// Define the possible states for the script loading process
type ScriptStatus = 'idle' | 'loading' | 'ready' | 'error'

export const useExternalScript = (
  url: string | null,
  {
    onError,
    onReady,
    enabled = true,
  }: { onError?: () => void; onReady?: () => void; enabled?: boolean } = {},
) => {
  // biome-ignore lint/correctness/useExhaustiveDependencies: onError and onReady are stable callbacks
  useEffect(() => {
    if (!url || !enabled) {
      return
    }

    // Attempt to find existing script
    let script: HTMLScriptElement | null = document.querySelector(`script[src="${url}"]`)

    const handleScriptEvent = (event: Event) => {
      const newStatus: ScriptStatus = event.type === 'load' ? 'ready' : 'error'
      if (script) {
        script.setAttribute('data-status', newStatus)
      }
      if (newStatus === 'ready' && onReady) onReady()
      if (newStatus === 'error' && onError) onError()
    }

    if (!script) {
      // Create script
      script = document.createElement('script')
      script.src = url
      script.async = true
      script.setAttribute('data-status', 'loading')
      document.body.appendChild(script)

      script.addEventListener('load', handleScriptEvent)
      script.addEventListener('error', handleScriptEvent)
    } else {
      // Grab existing status from the DOM attribute
      const existingStatus = script.getAttribute('data-status') as ScriptStatus

      // If it's still loading, we should still listen for its completion
      if (existingStatus === 'loading') {
        script.addEventListener('load', handleScriptEvent)
        script.addEventListener('error', handleScriptEvent)
      }
    }

    return () => {
      if (script) {
        script.removeEventListener('load', handleScriptEvent)
        script.removeEventListener('error', handleScriptEvent)

        script.remove()
      }
    }
  }, [url, enabled])
}
