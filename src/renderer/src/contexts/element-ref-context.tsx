import { createContext, type ReactNode, type RefObject, useContext, useRef } from 'react'

const containerContext = createContext<RefObject<HTMLDivElement | null> | null>(null)
const embedContext = createContext<RefObject<HTMLEmbedElement | null> | null>(null)

export function ElementRefProvider({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const embedRef = useRef<HTMLEmbedElement>(null)
  return (
    <containerContext.Provider value={containerRef}>
      <embedContext.Provider value={embedRef}>{children}</embedContext.Provider>
    </containerContext.Provider>
  )
}

export function useElementRef() {
  const containerRef = useContext(containerContext)
  const embedRef = useContext(embedContext)

  if (!containerRef || !embedRef) {
    throw new Error('useElementRef must be used within an ElementRefProvider')
  }

  return { containerRef, embedRef }
}
