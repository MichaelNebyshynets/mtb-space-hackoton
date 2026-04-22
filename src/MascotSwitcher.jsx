import './MascotSwitcher.css'

// Картинки первого уровня для отображения в списке
const mascotImages = {
  lion: '/assets/mascots/lion-level-1.png',
  eagle: '/assets/mascots/eagle-level-1.png',
  bison: '/assets/mascots/bear-level-1.png',
  stork: '/assets/mascots/stork-level-1.png',
  cat: '/assets/mascots/cat-level-1.png',
}

const mascotInfo = {
  lion: { name: 'Лев', color: '#ffa502' },
  eagle: { name: 'Орёл', color: '#4ecdc4' },
  bison: { name: 'Медведь', color: '#8B4513' },
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
            const info = mascotInfo[m.mascot_id]
            return (
              <div
                key={m.mascot_id}
                className={`mascot-item ${m.is_active ? 'active' : ''}`}
                style={{ borderColor: m.is_active ? info.color : 'transparent' }}
                onClick={() => onSwitch(m.mascot_id)}
              >
                <div 
                  className="mascot-item-icon" 
                  style={{ backgroundColor: info.color + '20' }}
                >
                  <img 
                    src={mascotImages[m.mascot_id]} 
                    alt={info.name}
                    className="mascot-switcher-image"
                  />
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