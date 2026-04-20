import { motion, useMotionValue, useTransform } from 'framer-motion'
import { useState } from 'react'
import './SwipeScreen.css'

function SwipeScreen({ cards, remaining, onSwipeRight, onSwipeLeft, onClose, cooldown }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [exitX, setExitX] = useState(0)
  
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 0, 200], [-20, 0, 20])
  const opacityLeft = useTransform(x, [-200, -50, 0], [0, 1, 1])
  const opacityRight = useTransform(x, [0, 50, 200], [1, 1, 0])
  const opacity = useTransform([opacityLeft, opacityRight], (values) => {
    return Math.min(values[0], values[1])
  })
  
  const currentCard = cards[currentIndex]
  
  const handleDragEnd = (_, info) => {
    const threshold = 100
    
    if (info.offset.x > threshold) {
      setExitX(300)
      onSwipeRight(currentCard)
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1)
        setExitX(0)
        x.set(0)
      }, 200)
    } else if (info.offset.x < -threshold) {
      setExitX(-300)
      onSwipeLeft()
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1)
        setExitX(0)
        x.set(0)
      }, 200)
    } else {
      x.set(0)
    }
  }
  
  const handleButtonSwipe = (direction) => {
    if (direction === 'right') {
      setExitX(300)
      onSwipeRight(currentCard)
    } else {
      setExitX(-300)
      onSwipeLeft()
    }
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1)
      setExitX(0)
      x.set(0)
    }, 200)
  }
  
  if (!currentCard || currentIndex >= remaining) {
    return (
      <div className="swipe-screen-overlay">
        <div className="swipe-screen">
          <button className="swipe-close" onClick={onClose}>✕</button>
          <h2>🔥 Свайп-чеки</h2>
          <div className="no-cards">
            <p>😴 Карточки закончились!</p>
            {cooldown > 0 ? (
              <p className="cooldown-timer">⏳ Новые через {cooldown} сек</p>
            ) : (
              <p>✨ Сейчас появятся новые!</p>
            )}
            <button className="close-btn" onClick={onClose}>Закрыть</button>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="swipe-screen-overlay">
      <div className="swipe-screen">
        <button className="swipe-close" onClick={onClose}>✕</button>
        <h2>🔥 Свайп-чеки</h2>
        <p className="swipe-counter">Осталось: {remaining - currentIndex} карточек</p>
        
        <div className="card-container">
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.8}
            onDragEnd={handleDragEnd}
            style={{
              x,
              rotate,
              opacity,
              position: 'absolute'
            }}
            animate={{ x: exitX }}
            transition={{ duration: 0.2 }}
            whileTap={{ cursor: 'grabbing' }}
            className="swipe-card"
          >
            <div className="card-icon">{currentCard.icon}</div>
            <div className="card-title">{currentCard.title}</div>
            <div className="card-amount">{currentCard.amount.toFixed(2)} BYN</div>
            <div className="card-reward">
              +{Math.round(currentCard.amount * {cafe:2, transport:1.5, erip:3}[currentCard.category])} 🚀
            </div>
            <div className="swipe-hints">
              <span className="hint-left">← Не моё</span>
              <span className="hint-right">Беру →</span>
            </div>
          </motion.div>
        </div>
        
        <div className="swipe-footer">
          <button className="swipe-left-btn" onClick={() => handleButtonSwipe('left')}>
            ← Не моё
          </button>
          <button className="swipe-right-btn" onClick={() => handleButtonSwipe('right')}>
            Беру →
          </button>
        </div>
      </div>
    </div>
  )
}

export default SwipeScreen