import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { FLASH_PLAYER_ELEMENT_ID, RANDOM_DELAY_MAX_MS } from '@/lib/constants'
import type { KeyReplayEntry } from '@/lib/key-recordings'

const delay = async (ms: number) => {
  await new Promise((resolve) => setTimeout(resolve, ms))
}

function useKeyReplay() {
  const [isLooping, setIsLooping] = useState(false)
  const [keyReferenceId, setKeyReferenceId] = useState<string | null>(null)
  const [keyPresses, setKeyPresses] = useState<KeyReplayEntry[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isReplaying, setIsReplaying] = useState(false)
  const isReplayingRef = useRef(false)
  const isDebuggerAttached = useRef(false)

  const start = useCallback(async (keyReplay: KeyReplayEntry[], loop: boolean = false) => {
    if (!isDebuggerAttached.current) {
      isDebuggerAttached.current = await window.api.attachDebugger()

      if (!isDebuggerAttached.current) return
    }

    setKeyPresses(keyReplay)
    setIsLooping(loop)
    setIsReplaying(true)
    isReplayingRef.current = true
    let index = 0
    let loopCount = 0

    while (index < keyReplay.length) {
      if (!isReplayingRef.current) break

      // Click on the body to ensure focus every 3 keys
      if (loopCount % 3 === 0) {
        await window.api.sendClick(FLASH_PLAYER_ELEMENT_ID, null, 'bottom')
      }
      loopCount++

      const { key, nextDelay } = keyReplay[index]

      await window.api.sendKeyPress(key)

      // add random delay between 0 and 100ms to avoid detection
      await delay(nextDelay + Math.random() * RANDOM_DELAY_MAX_MS)

      index++
      setCurrentIndex(index)

      if (index === keyReplay.length - 1 && loop) {
        index = 0
      }
    }
    setIsReplaying(false)
    isReplayingRef.current = false
  }, [])

  const stop = useCallback(() => {
    isReplayingRef.current = false
    setIsReplaying(false)
    setCurrentIndex(0)
  }, [])

  return {
    start,
    stop,
    isLooping,
    isReplaying,
    keyPresses,
    currentIndex,
    keyReferenceId,
    setKeyReferenceId,
  }
}

const keyReplayContext = createContext<ReturnType<typeof useKeyReplay> | null>(null)

export function KeyReplayProvider({ children }: { children: React.ReactNode }) {
  const keyReplay = useKeyReplay()
  return <keyReplayContext.Provider value={keyReplay}>{children}</keyReplayContext.Provider>
}

export function useKeyReplayContext() {
  const context = useContext(keyReplayContext)
  if (!context) {
    throw new Error('useKeyReplayContext must be used within a KeyReplayProvider')
  }
  return context
}
