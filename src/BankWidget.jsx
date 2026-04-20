import { useState } from 'react'
import './BankWidget.css'

function BankWidget({ transactions, onUseCode, onClose }) {
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  
  const showCode = (transaction) => {
    setSelectedTransaction(transaction)
  }
  
  const useInGame = (transaction) => {
    onUseCode(transaction)
    setSelectedTransaction(null)
  }
  
  return (
    <div className="bank-widget-overlay">
      <div className="bank-widget">
        <div className="bank-header">
          <button className="bank-close" onClick={onClose}>✕</button>
          <div className="bank-logo">🏦 МТБанк</div>
          <div className="bank-subtitle">Тестовая среда Hackathon API</div>
        </div>
        
        <div className="transactions-list">
          <h3>📋 Последние операции по карте</h3>
          {transactions.map(tr => (
            <div key={tr.id} className={`transaction-item ${tr.used ? 'used' : ''}`}>
              <div className="transaction-icon">{tr.icon}</div>
              <div className="transaction-info">
                <div className="transaction-title">{tr.title}</div>
                <div className="transaction-meta">{tr.date} • MCC: {tr.mcc}</div>
                {tr.used && <div className="used-badge">✓ Использован</div>}
              </div>
              <div className="transaction-amount">-{tr.amount} BYN</div>
              {!tr.used ? (
                <button 
                  className="generate-code-btn"
                  onClick={() => showCode(tr)}
                >
                  🔑 Код
                </button>
              ) : (
                <div className="used-placeholder">—</div>
              )}
            </div>
          ))}
        </div>
        
        {selectedTransaction && (
          <div className="code-result">
            <div className="code-label">Код операции:</div>
            <div className="code-value">{selectedTransaction.code}</div>
            <div className="code-desc">{selectedTransaction.title} • {selectedTransaction.amount} BYN</div>
            <button 
              className="use-code-btn"
              onClick={() => useInGame(selectedTransaction)}
            >
              🎮 Использовать в игре
            </button>
            <button 
              className="cancel-code-btn"
              onClick={() => setSelectedTransaction(null)}
            >
              Отмена
            </button>
          </div>
        )}
        
        <div className="bank-footer">
          <p>💡 В production — реальные транзакции через API МТБанк</p>
        </div>
      </div>
    </div>
  )
}

export default BankWidget