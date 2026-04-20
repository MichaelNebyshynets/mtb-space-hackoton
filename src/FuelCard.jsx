import { useState, useEffect } from 'react'
import './FuelCard.css'

function FuelCard({ fuel }) {
  const [animateKey, setAnimateKey] = useState(0)

  useEffect(() => {
    setAnimateKey(prev => prev + 1)
  }, [fuel])

  const formattedFuel = typeof fuel === 'number' 
    ? (fuel % 1 === 0 ? fuel : fuel.toFixed(1))
    : fuel

  return (
    <div className="fuel-card">
      <div className="fuel-icon">🚀</div>
      <div 
        key={animateKey}
        className="fuel-value animate-pop"
      >
        {formattedFuel}
      </div>
    </div>
  )
}

export default FuelCard