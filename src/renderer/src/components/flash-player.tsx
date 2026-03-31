import { useElementRef } from '@/contexts/element-ref-context'
import { FLASH_PLAYER_ELEMENT_ID } from '@/lib/constants'

export function FlashPlayer() {
  const { containerRef, embedRef } = useElementRef()
  return (
    <div className="flex w-full h-full items-center justify-center relative bg-black">
      <div
        ref={containerRef}
        className="min-w-[320px] max-h-[1024px] max-w-[1820px] aspect-video h-full w-full"
      >
        <embed
          ref={embedRef}
          id={FLASH_PLAYER_ELEMENT_ID}
          src="https://game.aq.com/game/gamefiles/Loader3.swf"
          type="application/x-shockwave-flash"
          height="100%"
          width="100%"
        />
      </div>
    </div>
  )
}
