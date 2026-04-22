import './UpgradeShop.css'

// Картинки для отображения в магазине
const mascotIcons = {
  lion: '/mascots/lion-level-1.png',
  eagle: '/mascots/eagle-level-1.png',
  bear: '/mascots/bear-level-1.png',
  stork: '/mascots/stork-level-1.png',
  cat: '/mascots/cat-level-1.png',
}

const mascotInfo = {
  lion: { name: 'Лев', color: '#ffa502', description: 'Сильный и быстрый, наносит большой урон' },
  eagle: { name: 'Орёл', color: '#4ecdc4', description: 'Зоркий глаз, видит скрытые бонусы' },
  bear: { name: 'Медведь', color: '#8B4513', description: 'Мощный и выносливый, сокрушает защиту' },
  stork: { name: 'Аист', color: '#ff6b6b', description: 'Приносит удачу и дополнительные ходы' },
  cat: { name: 'Кот', color: '#9b59b6', description: 'Ловкий и скрытный, уклоняется от атак' },
}

function UpgradeShop({ fuel, activeMascot, onUpgrade, onBack }) {
  const mascot = activeMascot || { mascot_id: 'lion', level: 1, experience: 0 }
  const info = mascotInfo[mascot.mascot_id]
  
  // Стоимость прокачки зависит от текущего уровня
  const upgradeCost = mascot.level * 100 + 50
  const canAfford = fuel >= upgradeCost
  const maxLevel = 10
  
  return (
    <div className="upgrade-shop">
      <div className="shop-header">
        <button className="back-button" onClick={onBack}>← Назад</button>
        <h2>🏪 Прокачка</h2>
        <div className="shop-fuel">🚀 {fuel}</div>
      </div>
      
      {/* Инфо о текущем маскоте */}
      <div className="active-mascot-info" style={{ borderColor: info.color }}>
        <img 
          src={mascotIcons[mascot.mascot_id]} 
          alt={info.name} 
          className="mascot-shop-icon" 
        />
        <div className="mascot-shop-details">
          <h3>{info.name}</h3>
          <div className="mascot-shop-stats">
            <span>Ур. {mascot.level}</span>
            <span>XP: {mascot.experience}</span>
          </div>
        </div>
      </div>
      
      {/* Описание персонажа */}
      <div className="mascot-description">
        <p>{info.description}</p>
      </div>
      
      {/* Карточка прокачки */}
      {mascot.level < maxLevel ? (
        <div className="upgrade-main-card" style={{ borderColor: info.color }}>
          <div className="upgrade-main-icon">⬆️</div>
          <div className="upgrade-main-info">
            <div className="upgrade-main-title">Повысить уровень</div>
            <div className="upgrade-main-desc">
              Уровень {mascot.level} → {mascot.level + 1}
            </div>
            <div className="upgrade-main-bonus">
              +10% к характеристикам в игре
            </div>
            <div className="upgrade-main-cost">
              Стоимость: {upgradeCost} 🚀
            </div>
          </div>
          <button
            className={`upgrade-main-button ${canAfford ? 'afford' : 'cannot-afford'}`}
            onClick={() => onUpgrade(mascot.mascot_id)}
            disabled={!canAfford}
          >
            Прокачать
          </button>
        </div>
      ) : (
        <div className="max-level-card">
          <div className="max-level-icon">🏆</div>
          <h3>Максимальный уровень!</h3>
          <p>{info.name} достиг пика своей силы</p>
        </div>
      )}
      
      <div className="shop-footer">
        <p>💡 Повышайте уровень персонажа, чтобы усилить его в игре «Три в ряд»</p>
      </div>
    </div>
  )
}

export default UpgradeShop