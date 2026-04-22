import './Character.css'
import MascotDisplay from './MascotDisplay'

function Character({ battery, maxBattery, level, mascot, mascotLevel, onAvatarClick }) {
  const batteryPercent = Math.min(100, (battery / maxBattery) * 100)
  
  const getBatteryColor = () => {
    if (battery === 0) return '#ff6b6b'
    if (battery < maxBattery) return '#ffa502'
    return '#2ecc71'
  }

  return (
    <div className="character-card">
      <div 
        className="character-avatar clickable" 
        onClick={onAvatarClick}
      >
        <MascotDisplay mascot={mascot} level={mascotLevel || level} size="large" />
        <div className="character-level">Ур. {mascotLevel || level}</div>
      </div>
      
      <div className="battery-section">
        <div className="battery-header">
          <span className="battery-label">🔋 Батарейки</span>
          <span className="battery-value">
            {battery} {battery > maxBattery && <span className="battery-bonus">(+{battery - maxBattery})</span>}
          </span>
        </div>
        <div className="battery-bar">
          <div 
            className="battery-fill" 
            style={{ 
              width: `${batteryPercent}%`,
              backgroundColor: getBatteryColor()
            }} 
          />
        </div>
        <p className="battery-hint">
          ⚡ 1 игра = 1 🔋 • +1 за 10 BYN • +1/час
        </p>
      </div>
    </div>
  )
}

export default Character