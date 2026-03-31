import { FlashPlayer } from '@/components/flash-player'
import { PlayerContainer } from '@/components/player-container'
import { ElementRefProvider } from './contexts/element-ref-context'
import { KeyReplayProvider } from './hooks/use-key-replay'

export function App() {
  return (
    <ElementRefProvider>
      <KeyReplayProvider>
        <PlayerContainer>
          <FlashPlayer />
        </PlayerContainer>
      </KeyReplayProvider>
    </ElementRefProvider>
  )
}
