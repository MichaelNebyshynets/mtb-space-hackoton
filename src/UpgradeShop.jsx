import './UpgradeShop.css'

// Картинки для каждого уровня маскотов
const mascotImages = {
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

// Получить картинку в зависимости от уровня
const getMascotImage = (mascotId, level) => {
  const levels = mascotImages[mascotId]
  if (!levels) return '/mascots/lion-level-1.png'
  if (level >= 5) return levels[3]
  if (level >= 3) return levels[2]
  return levels[1]
}

const mascotInfo = {
  lion: { 
    name: 'Лев', 
    color: '#ffa502', 
    ability: '🦁 Рык', 
    abilityDesc: 'Заменяет все камни одного цвета на другой',
    usesText: (lvl) => `${lvl} раз(а) за игру`
  },
  eagle: { 
    name: 'Орёл', 
    color: '#4ecdc4', 
    ability: '🦅 Зрение', 
    abilityDesc: 'Превращает все камни одного цвета в бомбы',
    usesText: (lvl) => `${lvl} раз(а) за игру`
  },
  bear: { 
    name: 'Медведь', 
    color: '#8B4513', 
    ability: '🐻 Мощь', 
    abilityDesc: 'Уничтожает ВСЕ камни на доске',
    usesText: (lvl) => `${lvl} раз(а) за игру`
  },
  stork: { 
    name: 'Аист', 
    color: '#ff6b6b', 
    ability: '🐦 Доставка', 
    abilityDesc: 'Перемешивает все камни на доске',
    usesText: (lvl) => `${lvl} раз(а) за игру`
  },
  cat: { 
    name: 'Кот', 
    color: '#9b59b6', 
    ability: '😺 Ловкость', 
    abilityDesc: 'Добавляет 10 ходов и ничтожает выбранный камень',
    usesText: (lvl) => `${lvl} раз(а) за игру`
  },
}

function UpgradeShop({ loyaltyPoints, userMascots, activeMascotId, onUpgrade, onBack }) {
  return (
    <div className="upgrade-shop">
      <div className="shop-header">
        <button className="back-button" onClick={onBack}>← Назад</button>
        <h2>🏪 Прокачка</h2>
        <div className="shop-fuel">⭐ {loyaltyPoints}</div>
      </div>
      
      <div className="upgrades-list">
        {userMascots.map(mascot => {
          console.log('mascot:', mascot.mascot_id, 'info:', mascotInfo[mascot.mascot_id])
          const info = mascotInfo[mascot.mascot_id]
          const cost = mascot.level * 100 + 50
          const canAfford = loyaltyPoints >= cost
          const maxLevel = 10
          const isActive = mascot.mascot_id === activeMascotId
          const imageSrc = getMascotImage(mascot.mascot_id, mascot.level)
          
          return (
            <div 
              key={mascot.mascot_id} 
              className={`upgrade-card ${isActive ? 'active' : ''}`} 
              style={{ borderColor: info.color }}
            >
              <div className="upgrade-mascot-image">
                <img 
                  src={imageSrc} 
                  alt={info.name} 
                  className="mascot-shop-icon" 
                />
              </div>
              
              <div className="upgrade-info">
                <div className="upgrade-name">
                  {info.name}
                  {isActive && <span className="active-badge">✓ Активен</span>}
                  <span className="upgrade-level">Ур. {mascot.level}</span>
                </div>
                
                <div className="upgrade-ability">
                  <span className="ability-icon">{info.ability}</span>
                  <span className="ability-desc">{info.abilityDesc}</span>
                </div>
                
                <div className="upgrade-uses">
                  Использований: <strong>{info.usesText(mascot.level)}</strong>
                </div>
                
                {mascot.level < maxLevel && (
                  <div className="upgrade-cost">
                    Стоимость: {cost} ⭐
                  </div>
                )}
              </div>
              
              {mascot.level < maxLevel ? (
                <button
                  className={`upgrade-button ${canAfford ? 'afford' : 'cannot-afford'}`}
                  onClick={() => onUpgrade(mascot.mascot_id)}
                  disabled={!canAfford}
                >
                  Прокачать
                </button>
              ) : (
                <div className="max-level">MAX</div>
              )}
            </div>
          )
        })}
      </div>
      
      <div className="shop-footer">
        <p>💡 Способности доступны в игре «Три в ряд». Уровень = количество использований за игру.</p>
      </div>
    </div>
  )
}

export default UpgradeShop