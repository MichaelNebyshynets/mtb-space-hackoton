import './MascotSwitcher.css'

const mascotImages = {
  lion: '/mascots/lion-level-1.png',
  eagle: '/mascots/eagle-level-1.png',
  bear: '/mascots/bear-level-1.png',
  bison: '/mascots/bear-level-1.png',  // fallback
  stork: '/mascots/stork-level-1.png',
  cat: '/mascots/cat-level-1.png',
}

const mascotInfo = {
  lion: { name: 'Лев', color: '#ffa502' },
  eagle: { name: 'Орёл', color: '#4ecdc4' },
  bear: { name: 'Медведь', color: '#8B4513' },
  bison: { name: 'Зубр', color: '#8B4513' },
  stork: { name: 'Аист', color: '#ff6b6b' },
  cat: { name: 'Кот', color: '#9b59b6' },
}

function MascotSwitcher({ mascots, activeMascotId, onSwitch, onClose }) {
  return (
    <div className="mascot-switcher-overlay">
      <div className="mascot-switcher">
        <button className="close-btn" onClick={onClose}>✕</button>
        <h3>Выбери маскота</h3>
        
        <div className="mascot-list">
          {mascots.map(m => {
            // Защита — если маскот не найден, используем дефолт
            const info = mascotInfo[m.mascot_id] || { name: m.mascot_id, color: '#888' }
            const image = mascotImages[m.mascot_id] || '/mascots/lion-level-1.png'
            
            return (
              <div
                key={m.mascot_id}
                className={`mascot-item ${m.is_active ? 'active' : ''}`}
                style={{ borderColor: m.is_active ? info.color : 'transparent' }}
                onClick={() => onSwitch(m.mascot_id)}
              >
                <div className="mascot-item-icon" style={{ backgroundColor: info.color + '20' }}>
                  <img src={image} alt={info.name} className="mascot-switcher-image" />
                </div>
                <div className="mascot-item-info">
                  <div className="mascot-item-name">{info.name}</div>
                  <div className="mascot-item-level">Ур. {m.level}</div>
                  <div className="mascot-item-xp">XP: {m.experience}</div>
                </div>
                {m.is_active && <div className="active-badge">✓</div>}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default MascotSwitcher