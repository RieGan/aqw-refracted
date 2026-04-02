import { useElementRef } from '@/contexts/element-ref-context'
import { AQW_SWF_URL, FLASH_PLAYER_ELEMENT_ID } from '@/lib/constants'

export function FlashPlayer() {
  const embedRef = useElementRef()
  return (
    <div className="flex w-full h-full items-center justify-center relative bg-black">
      <div className="min-w-[320px] max-h-[1024px] max-w-[1820px] aspect-video h-full w-full">
        <embed
          ref={embedRef}
          id={FLASH_PLAYER_ELEMENT_ID}
          src={AQW_SWF_URL}
          type="application/x-shockwave-flash"
          height="100%"
          width="100%"
        />
      </div>
    </div>
  )
}
