import './MascotDisplay.css'

const mascotNames = {
  lion: 'Лев',
  eagle: 'Орёл',
  bear: 'Медведь',
  stork: 'Аист',
  cat: 'Кот',
}

// Стадии эволюции в зависимости от уровня
const getEvolutionStage = (level) => {
  if (level >= 5) return 3
  if (level >= 3) return 2
  return 1
}

// Картинки для всех уровней
const mascotAssets = {
  lion: {
    1: '/assets/mascots/lion-level-1.png',
    2: '/assets/mascots/lion-level-2.png',
    3: '/assets/mascots/lion-level-3.png',
  },
  eagle: {
    1: '/assets/mascots/eagle-level-1.png',
    2: '/assets/mascots/eagle-level-2.png',
    3: '/assets/mascots/eagle-level-3.png',
  },
  bison: {
    1: '/assets/mascots/bear-level-1.png',
    2: '/assets/mascots/bear-level-2.png',
    3: '/assets/mascots/bear-level-3.png',
  },
  stork: {
    1: '/assets/mascots/stork-level-1.png',
    2: '/assets/mascots/stork-level-2.png',
    3: '/assets/mascots/stork-level-3.png',
  },
  cat: {
    1: '/assets/mascots/cat-level-1.png',
    2: '/assets/mascots/cat-level-2.png',
    3: '/assets/mascots/cat-level-3.png',
  },
}

function MascotDisplay({ mascot, level, size = 'large' }) {
  const stage = getEvolutionStage(level)
  const imagePath = mascotAssets[mascot]?.[stage] || mascotAssets.lion[1]
  
  return (
    <div className={`mascot-display mascot-${size}`}>
      <img 
        src={imagePath} 
        alt={mascotNames[mascot]} 
        className="mascot-image"
      />
      <p className="mascot-name">
        {mascotNames[mascot]} • Ур. {level}
      </p>
    </div>
  )
}

export default MascotDisplay