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
    1: '/mascots/lion-level-1.png',
    2: '/mascots/lion-level-2.png',
    3: '/mascots/lion-level-3.png',
  },
  eagle: {
    1: '/mascots/eagle-level-1.png',
    2: '/mascots/eagle-level-2.png',
    3: '/mascots/eagle-level-3.png',
  },
  bear: {
    1: '/mascots/bear-level-1.png',
    2: '/mascots/bear-level-2.png',
    3: '/mascots/bear-level-3.png',
  },
  stork: {
    1: '/mascots/stork-level-1.png',
    2: '/mascots/stork-level-2.png',
    3: '/mascots/stork-level-3.png',
  },
  cat: {
    1: '/mascots/cat-level-1.png',
    2: '/mascots/cat-level-2.png',
    3: '/mascots/cat-level-3.png',
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
      {/* <p className="mascot-name">
        {mascotNames[mascot]} • Ур. {level}
      </p> */}
    </div>
  )
}

export default MascotDisplay