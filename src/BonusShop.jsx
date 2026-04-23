import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import './BonusShop.css'

const bonuses = [
  { id: 'coffee', name: 'Бесплатный кофе', icon: '☕', cost: 500, description: 'Промокод в партнёрскую кофейню' },
  { id: 'cashback', name: 'Кэшбек 5%', icon: '💸', cost: 1000, description: 'Повышенный кэшбек на неделю' },
  { id: 'cinema', name: 'Билет в кино', icon: '🎬', cost: 1500, description: 'Скидка 50% на билет' },
  { id: 'taxi', name: 'Поездка на такси', icon: '🚖', cost: 2000, description: 'Промокод на 15 BYN' },
  { id: 'oz', name: 'Сертификат OZ', icon: '🛍️', cost: 5000, description: '50 BYN на покупки' },
]

function BonusShop({ loyaltyPoints, dbUserId, onBuy, onClose, onUseBonus }) {
  const [purchasedBonuses, setPurchasedBonuses] = useState([])
  const [activeTab, setActiveTab] = useState('shop') // 'shop' или 'my'

  // Загружаем купленные бонусы
  useEffect(() => {
    if (!dbUserId || dbUserId === 'local') return
    
    const loadPurchased = async () => {
      const { data } = await supabase
        .from('user_bonuses')
        .select('id, bonus_id, used, purchased_at')
        .eq('user_id', dbUserId)
      
      setPurchasedBonuses(data || [])
    }
    loadPurchased()
  }, [dbUserId])

  const isPurchased = (bonusId) => {
    return purchasedBonuses.some(b => b.bonus_id === bonusId)
  }

  const getPurchasedBonus = (bonusId) => {
    return purchasedBonuses.find(b => b.bonus_id === bonusId)
  }

  return (
    <div className="bonus-shop">
      <div className="bonus-tabs">
        <button 
          className={`bonus-tab ${activeTab === 'shop' ? 'active' : ''}`}
          onClick={() => setActiveTab('shop')}
        >
          🎁 Магазин
        </button>
        <button 
          className={`bonus-tab ${activeTab === 'my' ? 'active' : ''}`}
          onClick={() => setActiveTab('my')}
        >
          📦 Мои бонусы
        </button>
      </div>

      {activeTab === 'shop' ? (
        <div className="bonus-list">
          {bonuses.map(bonus => {
            const purchased = isPurchased(bonus.id)
            return (
              <div key={bonus.id} className={`bonus-card ${purchased ? 'purchased' : ''}`}>
                <div className="bonus-icon">{bonus.icon}</div>
                <div className="bonus-info">
                  <div className="bonus-name">{bonus.name}</div>
                  <div className="bonus-desc">{bonus.description}</div>
                  <div className="bonus-cost">{bonus.cost} ⭐</div>
                </div>
                {purchased ? (
                  <div className="purchased-badge">✓ Куплен</div>
                ) : (
                  <button
                    className={`bonus-btn ${loyaltyPoints >= bonus.cost ? 'afford' : 'cannot-afford'}`}
                    onClick={() => onBuy(bonus)}
                    disabled={loyaltyPoints < bonus.cost}
                  >
                    Купить
                  </button>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="my-bonuses">
            {purchasedBonuses.length === 0 ? (
            <p className="empty-bonuses">У вас пока нет купленных бонусов</p>
            ) : (
            purchasedBonuses.map(pb => {
                const bonus = bonuses.find(b => b.id === pb.bonus_id)
                if (!bonus) return null
                return (
                <div key={pb.bonus_id} className={`my-bonus-card ${pb.used ? 'used' : ''}`}>
                    <div className="bonus-icon">{bonus.icon}</div>
                    <div className="bonus-info">
                    <div className="bonus-name">{bonus.name}</div>
                    <div className="bonus-desc">{bonus.description}</div>
                    <div className="bonus-date">Куплен: {new Date(pb.purchased_at).toLocaleDateString()}</div>
                    </div>
                    {pb.used ? (
                    <div className="bonus-status used">Использован</div>
                    ) : (
                    <button 
                        className="bonus-use-btn"
                        onClick={() => onUseBonus(pb)}
                    >
                        Использовать
                    </button>
                    )}
                </div>
                )
            })
            )}
        </div>
        )}
    </div>
  )
}

export default BonusShop