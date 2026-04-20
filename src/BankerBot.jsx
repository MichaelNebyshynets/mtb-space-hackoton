function BankerBot({ mood, upgrades }) {
  const colors = {
    happy: { main: '#2ecc71', shadow: '#1a7a6e', eye: '#ffffff', cheek: '#27ae60' },
    neutral: { main: '#4ecdc4', shadow: '#2a8a7a', eye: '#ffffff', cheek: '#3aa89f' },
    sad: { main: '#ff6b6b', shadow: '#c0392b', eye: '#fce4e4', cheek: '#e74c3c' }
  }
  
  const c = colors[mood] || colors.neutral
  
  // Уровни прокачек
  const armorLevel = upgrades?.armor?.level || 1
  const engineLevel = upgrades?.engine?.level || 1
  const scannerLevel = upgrades?.scanner?.level || 1
  
  // Броня: галстук
  let tieColor = '#e94560'
  let tieSecondary = '#c0392b'
  let medal = false
  if (armorLevel >= 5) {
    tieColor = '#ffd700'
    tieSecondary = '#daa520'
    medal = true
  } else if (armorLevel >= 3) {
    tieColor = '#c0c0c0'
    tieSecondary = '#a0a0a0'
  }
  
  // Двигатель: антенна и пламя
  let antennaColor = '#e94560'
  let antennaGlow = '#ffe66d'
  let flame = false
  if (engineLevel >= 5) {
    antennaColor = '#ff4500'
    antennaGlow = '#ff6347'
    flame = true
  } else if (engineLevel >= 3) {
    antennaColor = '#4169e1'
    antennaGlow = '#6495ed'
  }
  
  // Сканер: глаза и луч (макс 3 уровень)
  let eyeGlow = null
  let scanBeam = false
  if (scannerLevel >= 3) {
    eyeGlow = '#00ff00'
    scanBeam = true
  } else if (scannerLevel >= 2) {
    eyeGlow = '#00cc00'
  }
  
  return (
    <svg width="90" height="110" viewBox="0 0 100 115" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }}>
      {/* Реактивное пламя (двигатель 5 ур) */}
      {flame && (
        <>
          <ellipse cx="50" cy="12" rx="8" ry="12" fill="#ff4500" opacity="0.8" />
          <ellipse cx="50" cy="10" rx="5" ry="8" fill="#ffa500" opacity="0.9" />
          <ellipse cx="50" cy="8" rx="3" ry="5" fill="#ffff00" />
        </>
      )}
      
      {/* Антенна */}
      <line x1="50" y1="18" x2="50" y2="2" stroke={antennaColor} strokeWidth="3" strokeLinecap="round" />
      <circle cx="50" cy="1" r="6" fill={antennaGlow} />
      <circle cx="50" cy="1" r="3" fill="#fff" opacity="0.6" />
      
      {/* Сканирующий луч (сканер 3 ур) */}
      {scanBeam && (
        <>
          <line x1="10" y1="43" x2="0" y2="43" stroke="#00ff00" strokeWidth="2" opacity="0.6" />
          <line x1="90" y1="43" x2="100" y2="43" stroke="#00ff00" strokeWidth="2" opacity="0.6" />
        </>
      )}
      
      {/* Основное тело */}
      <rect x="18" y="18" width="64" height="58" rx="16" fill={c.main} />
      <rect x="18" y="66" width="64" height="10" rx="0" fill={c.shadow} />
      
      {/* Глаза */}
      <rect x="30" y="36" width="14" height={mood === 'sad' ? 10 : 14} rx="4" fill={c.eye} />
      <rect x="56" y="36" width="14" height={mood === 'sad' ? 10 : 14} rx="4" fill={c.eye} />
      
      {/* Свечение глаз (сканер 2+ ур) */}
      {eyeGlow && (
        <>
          <rect x="30" y="36" width="14" height={mood === 'sad' ? 10 : 14} rx="4" fill={eyeGlow} opacity="0.3" />
          <rect x="56" y="36" width="14" height={mood === 'sad' ? 10 : 14} rx="4" fill={eyeGlow} opacity="0.3" />
        </>
      )}
      
      {/* Зрачки */}
      <circle cx="37" cy={mood === 'sad' ? 42 : 43} r="5" fill="#1a1a2e" />
      <circle cx="63" cy={mood === 'sad' ? 42 : 43} r="5" fill="#1a1a2e" />
      
      {/* Блики */}
      <circle cx="34" cy="40" r="2" fill="#fff" opacity="0.8" />
      <circle cx="60" cy="40" r="2" fill="#fff" opacity="0.8" />
      
      {/* Румянец */}
      {mood === 'happy' && (
        <>
          <circle cx="26" cy="48" r="5" fill={c.cheek} opacity="0.4" />
          <circle cx="74" cy="48" r="5" fill={c.cheek} opacity="0.4" />
        </>
      )}
      
      {/* Рот */}
      {mood === 'happy' && (
        <path d="M35 54 Q50 70 65 54" stroke="#1a1a2e" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      )}
      {mood === 'neutral' && (
        <line x1="38" y1="57" x2="62" y2="57" stroke="#1a1a2e" strokeWidth="3" strokeLinecap="round" />
      )}
      {mood === 'sad' && (
        <path d="M35 62 Q50 50 65 62" stroke="#1a1a2e" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      )}
      
      {/* Медаль (броня 5 ур) */}
      {medal && (
        <>
          <circle cx="50" cy="88" r="6" fill="#ffd700" />
          <polygon points="50,83 52,86 55,86 53,89 54,92 50,90 46,92 47,89 45,86 48,86" fill="#ffd700" />
        </>
      )}
      
      {/* Галстук */}
      <polygon points="50,60 42,70 50,82 58,70" fill={tieColor} />
      <polygon points="50,60 45,70 50,70 55,70" fill={tieSecondary} />
      
      {/* Воротничок */}
      <polygon points="35,55 40,63 50,58" fill="#fff" opacity="0.4" />
      <polygon points="65,55 60,63 50,58" fill="#fff" opacity="0.4" />
      
      {/* Брови */}
      {mood === 'happy' && (
        <>
          <line x1="28" y1="30" x2="38" y2="28" stroke="#1a1a2e" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="72" y1="30" x2="62" y2="28" stroke="#1a1a2e" strokeWidth="2.5" strokeLinecap="round" />
        </>
      )}
      {mood === 'neutral' && (
        <>
          <line x1="28" y1="30" x2="40" y2="30" stroke="#1a1a2e" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="72" y1="30" x2="60" y2="30" stroke="#1a1a2e" strokeWidth="2.5" strokeLinecap="round" />
        </>
      )}
      {mood === 'sad' && (
        <>
          <line x1="28" y1="30" x2="38" y2="32" stroke="#1a1a2e" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="72" y1="30" x2="62" y2="32" stroke="#1a1a2e" strokeWidth="2.5" strokeLinecap="round" />
        </>
      )}
    </svg>
  )
}

export default BankerBot