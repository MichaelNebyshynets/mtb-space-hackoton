import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import './Leaderboard.css'

function Leaderboard({ onClose }) {
  const [leaders, setLeaders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadLeaders = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('username, phone, loyalty_points')
        .order('loyalty_points', { ascending: false })
        .limit(10)

      if (error) {
        console.error('Ошибка загрузки лидерборда:', error)
      } else {
        setLeaders(data || [])
      }
      setLoading(false)
    }
    loadLeaders()
  }, [])

  if (loading) {
    return (
      <div className="leaderboard-overlay">
        <div className="leaderboard">
          <div className="leaderboard-loading">Загрузка...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="leaderboard-overlay">
      <div className="leaderboard">
        <button className="close-btn" onClick={onClose}>✕</button>
        <h2>🏆 Лидеры</h2>
        <p className="leaderboard-subtitle">По баллам лояльности</p>
        
        <div className="leaderboard-list">
          {leaders.length === 0 ? (
            <p className="empty-leaders">Пока никого нет. Стань первым!</p>
          ) : (
            leaders.map((user, i) => (
              <div key={i} className={`leaderboard-item ${i < 3 ? `top-${i + 1}` : ''}`}>
                <span className="rank">
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                </span>
                <div className="user-info">
                  <span className="user-name">{user.username || 'Аноним'}</span>
                  <span className="user-phone">{user.phone ? user.phone.slice(-4) : ''}</span>
                </div>
                <span className="user-points">{user.loyalty_points?.toLocaleString() || 0} ⭐</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Leaderboard