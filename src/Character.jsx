import './Character.css'
import BankerBot from './BankerBot'
import MascotDisplay from './MascotDisplay'

function Character({ hunger, activity, level, upgrades, mascot, mascotLevel, onAvatarClick}) {
  const getMood = () => {
    if (hunger < 30) return 'sad'
    if (hunger < 60) return 'neutral'
    return 'happy'
  }
  
  const mood = getMood()
  const moodText = { happy: 'Сытый и довольный', neutral: 'Всё в порядке', sad: 'Хочет есть...' }[mood]
  
  return (
    <div className="character-card">
      <div className="character-avatar-clickable" onClick={onAvatarClick} style={{ cursor: 'pointer' }}>
        <MascotDisplay mascot={mascot} level={mascotLevel || level} size="large" />
        <div className="character-level">Ур. {mascotLevel || level}</div>
      </div>
      
      <div className="character-stats">
        <div className="stat">
          <span className="stat-label">🍖 Сытость</span>
          <div className="stat-bar">
            <div className="stat-fill hunger" style={{ width: `${hunger}%` }} />
          </div>
          <span className="stat-value">{Math.round(hunger)}%</span>
        </div>
        
        <div className="stat">
          <span className="stat-label">⚡ Активность</span>
          <div className="stat-bar">
            <div className="stat-fill activity" style={{ width: `${activity}%` }} />
          </div>
          <span className="stat-value">{Math.round(activity)}%</span>
        </div>
      </div>
      
      <p className="character-mood">{moodText}</p>
    </div>
  )
}

export default Character