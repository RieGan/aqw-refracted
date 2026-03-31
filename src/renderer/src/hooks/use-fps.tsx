import { useEffect, useRef, useState } from 'react'

export function useFps(enabled: boolean = true) {
  const [fps, setFps] = useState(0)
  const frameCountRef = useRef(0)
  const lastTimeRef = useRef(performance.now())
  const requestRef = useRef<number>(0)

  useEffect(() => {
    if (!enabled) {
      setFps(0)
      return
    }

    const loop = (time: number) => {
      frameCountRef.current++
      const elapsed = time - lastTimeRef.current

      if (elapsed >= 1000) {
        setFps(Math.round((frameCountRef.current * 1000) / elapsed))
        frameCountRef.current = 0
        lastTimeRef.current = time
      }

      requestRef.current = requestAnimationFrame(loop)
    }

    requestRef.current = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(requestRef.current)
    }
  }, [enabled])

  return { fps }
}
