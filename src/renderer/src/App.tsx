import { FlashPlayer } from '@/components/flash-player'
import { PlayerContainer } from '@/components/player-container'
import { KeyReplayProvider } from './hooks/use-key-replay'

export function App() {
  return (
    <KeyReplayProvider>
      <PlayerContainer>
        <FlashPlayer />
      </PlayerContainer>
    </KeyReplayProvider>
  )
}
