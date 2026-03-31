/** biome-ignore-all lint/correctness/useExhaustiveDependencies: the dependencies are expected */

import { useCallback, useEffect, useRef, useState } from 'react'
import type { KeyPressEntry, KeyReplayEntry, RecorderStatus } from '@/lib/key-recordings'
import { useElementRef } from '@/contexts/element-ref-context'

function isValidKey(key: string) {
  return /^[1-6]$/.test(key)
}

export function useKeyRecorder() {
  const { embedRef } = useElementRef()
  const [state, setState] = useState<RecorderStatus>('idle')
  const [keyPresses, setKeyPresses] = useState<KeyPressEntry[]>([])
  const keyPressesRef = useRef<KeyPressEntry[]>([])
  const isInitialKeyPressedRef = useRef<boolean>(false)

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (!isValidKey(e.key)) return
    if (!isInitialKeyPressedRef.current) {
      isInitialKeyPressedRef.current = true
      setState('recording')
    }
    const timestamp = Date.now()
    setKeyPresses((prev) => {
      const keyPresses = [...prev, { key: e.key, timestamp }]

      keyPressesRef.current = keyPresses
      return keyPresses
    })
  }, [])

  const start = useCallback(() => {
    console.log('Starting key recording...')
    setState('waiting')
    isInitialKeyPressedRef.current = false
    setKeyPresses([])
    embedRef.current?.addEventListener('keydown', handleKeyPress)
  }, [])

  const stop = useCallback((onStop: (entries: KeyReplayEntry[]) => void) => {
    console.log('[STOP] Recorded key presses:', JSON.stringify(keyPressesRef.current))
    setState('idle')
    embedRef.current?.removeEventListener('keydown', handleKeyPress)

    const timestamp = Date.now()

    const keyPressesCount = keyPressesRef.current.length
    const lastDelay = timestamp - keyPressesRef.current[keyPressesCount - 1]?.timestamp
    const withDelay = keyPressesRef.current.map(({ key, timestamp }, i) => {
      const nextDelay =
        i === keyPressesCount - 1 ? lastDelay : keyPressesRef.current[i + 1].timestamp - timestamp
      return { key, nextDelay }
    })

    onStop(withDelay)
  }, [])

  const clear = useCallback(() => {
    setState('waiting')
    isInitialKeyPressedRef.current = false
    keyPressesRef.current = []
    setKeyPresses(keyPressesRef.current)
  }, [])

  useEffect(() => {
    return () => {
      embedRef.current?.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

  return { state, keyPresses, start, stop, clear }
}
