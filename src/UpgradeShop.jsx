import './UpgradeShop.css'

const upgradeDetails = {
  armor: { 
    name: 'Броня', 
    icon: '🛡️', 
    description: '+0.5% кэшбек на АЗС за уровень',
    maxLevel: 5,
    color: '#4ecdc4'
  },
  engine: { 
    name: 'Двигатель', 
    icon: '🚀', 
    description: '+1% кэшбек на транспорт за уровень',
    maxLevel: 5,
    color: '#e94560'
  },
  scanner: { 
    name: 'Сканер', 
    icon: '📡', 
    description: 'x2 кэшбек в кафе партнёров',
    maxLevel: 3,
    color: '#ffe66d'
  },
}


function UpgradeShop({ fuel, upgrades, onUpgrade, onBack }){
    return (
        <div className="upgrade-shop">
        <div className="shop-header">
            <button className="back-button" onClick={onBack}>← Назад</button>
            <h2>🏪 Магазин</h2>
            <div className="shop-fuel">🚀 {fuel}</div>
        </div>
        
        <div className="upgrades-list">
            {Object.entries(upgrades).map(([id, upgrade]) => {
            const details = upgradeDetails[id]
            const cost = upgrade.baseCost * upgrade.level
            const canAfford = fuel >= cost
            const isMaxLevel = upgrade.level >= details.maxLevel
            
            return (
                <div key={id} className="upgrade-card" style={{ borderColor: details.color }}>
                <div className="upgrade-icon">{details.icon}</div>
                <div className="upgrade-info">
                    <div className="upgrade-name">
                    {details.name} 
                    <span className="upgrade-level">Ур. {upgrade.level}</span>
                    </div>
                    <div className="upgrade-description">{details.description}</div>
                    {!isMaxLevel && (
                    <div className="upgrade-cost">
                        Стоимость: {cost} 🚀
                    </div>
                    )}
                </div>
                {!isMaxLevel ? (
                    <button 
                    className={`upgrade-button ${canAfford ? 'afford' : 'cannot-afford'}`}
                    onClick={() => onUpgrade(id)}
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
            <p>💡 Прокачки дают реальные банковские бонусы!</p>
        </div>
        </div>
    )
}

export default UpgradeShop