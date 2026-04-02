import { createContext, type ReactNode, type RefObject, useContext, useRef } from 'react'
const embedContext = createContext<RefObject<HTMLEmbedElement | null> | null>(null)

export function ElementRefProvider({ children }: { children: ReactNode }) {
  const embedRef = useRef<HTMLEmbedElement>(null)
  return <embedContext.Provider value={embedRef}>{children}</embedContext.Provider>
}

export function useElementRef() {
  const embedRef = useContext(embedContext)

  if (!embedRef) {
    throw new Error('useElementRef must be used within an ElementRefProvider')
  }

  return embedRef
}
