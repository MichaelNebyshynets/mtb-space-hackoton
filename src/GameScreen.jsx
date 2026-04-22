import { useEffect, useRef, useState } from 'react'
import './GameScreen.css'

function GameScreen({ battery, onGameEnd, onClose }) {
  const iframeRef = useRef(null)
  const [gameLoaded, setGameLoaded] = useState(false)

  useEffect(() => {
    if (battery <= 0) {
      alert('Недостаточно батареек!')
      onClose()
      return
    }

    // Сообщаем игре о старте
    const handleMessage = (e) => {
      if (e.data.type === 'GAME_READY') {
        setGameLoaded(true)
      }
      if (e.data.type === 'GAME_OVER') {
        // Игра закончена, передаём результат
        onGameEnd(e.data.score)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [battery, onGameEnd, onClose])

  if (battery <= 0) {
    return null
  }

  return (
    <div className="game-screen-overlay">
      <div className="game-screen">
        <button className="game-close" onClick={onClose}>✕</button>
        <h3>🎮 Три в ряд</h3>
        <iframe
          ref={iframeRef}
          src="/game/index.html"
          className="game-iframe"
          title="Match-3 Game"
        />
      </div>
    </div>
  )
}

export default GameScreen