import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import './Leaderboard.css'

function Leaderboard({ onClose }) {
  const [leaders, setLeaders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadLeaders = async () => {
      const { data } = await supabase
        .from('user_mascots')
        .select(`
          high_score,
          mascot_id,
          users!inner(username)
        `)
        .order('high_score', { ascending: false })
        .limit(10)
      
      setLeaders(data || [])
      setLoading(false)
    }
    loadLeaders()
  }, [])

  if (loading) return <div className="leaderboard-loading">Загрузка...</div>

  return (
    <div className="leaderboard-overlay">
      <div className="leaderboard">
        <button className="close-btn" onClick={onClose}>✕</button>
        <h2>🏆 Лидеры</h2>
        <div className="leaderboard-list">
          {leaders.map((l, i) => (
            <div key={i} className="leaderboard-item">
              <span className="rank">#{i + 1}</span>
              <span className="name">{l.users?.username || 'Аноним'}</span>
              <span className="mascot">{l.mascot_id}</span>
              <span className="score">{l.high_score}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Leaderboard