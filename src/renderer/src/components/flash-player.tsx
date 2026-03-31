import { useRef } from 'react'

export function FlashPlayer() {
  const containerRef = useRef<HTMLDivElement>(null)
  const embedRef = useRef<HTMLEmbedElement>(null)

  return (
    <div
      ref={containerRef}
      className="flex w-full h-full items-center justify-center relative bg-black"
    >
      <embed
        ref={embedRef}
        src="https://game.aq.com/game/gamefiles/Loader3.swf"
        type="application/x-shockwave-flash"
        width="100%"
        height="100%"
        className="w-full h-full"
      />
    </div>
  )
}
