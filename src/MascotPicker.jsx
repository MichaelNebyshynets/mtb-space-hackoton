import './MascotPicker.css'

const mascots = [
  { id: 'robot', name: 'Робот', emoji: '🤖', color: '#4ecdc4' },
  { id: 'cat', name: 'Кот-банкир', emoji: '😺', color: '#ff6b6b' },
  { id: 'dog', name: 'Пёс-инвестор', emoji: '🐶', color: '#ffe66d' },
  { id: 'fox', name: 'Лис-трейдер', emoji: '🦊', color: '#ffa502' },
  { id: 'panda', name: 'Панда-аналитик', emoji: '🐼', color: '#2ecc71' },
]

function MascotPicker({ selected, onSelect }) {
  return (
    <div className="mascot-picker">
      <h3>Выбери своего маскота</h3>
      <div className="mascot-grid">
        {mascots.map(m => (
          <div
            key={m.id}
            className={`mascot-card ${selected === m.id ? 'selected' : ''}`}
            style={{ borderColor: selected === m.id ? m.color : 'transparent' }}
            onClick={() => onSelect(m.id)}
          >
            <div className="mascot-emoji" style={{ backgroundColor: m.color + '20' }}>
              {m.emoji}
            </div>
            <div className="mascot-name">{m.name}</div>
            {selected === m.id && (
              <div className="mascot-check" style={{ backgroundColor: m.color }}>✓</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default MascotPicker