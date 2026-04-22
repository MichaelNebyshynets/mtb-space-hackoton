import { useState, useEffect } from 'react'
import './BalanceCard.css'

function BalanceCard({ balance }) {
  const [animateKey, setAnimateKey] = useState(0)

  useEffect(() => {
    setAnimateKey(prev => prev + 1)
  }, [balance])

  const formattedBalance = typeof balance === 'number' 
    ? balance.toFixed(2) 
    : balance

  return (
    <div className="balance-card">
      <div className="balance-icon">💳</div>
      <div 
        key={animateKey}
        className="balance-value animate-pop"
      >
        {formattedBalance} BYN
      </div>
      <div className="balance-label">Мой счёт</div>
    </div>
  )
}

export default BalanceCard