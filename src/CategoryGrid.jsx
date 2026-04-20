import './CategoryGrid.css'

const categories = [
  { id: 'cafe', name: 'Кафе', icon: '🍕', multiplier: '2x', color: '#ff6b6b' },
  { id: 'transport', name: 'Транспорт', icon: '🚌', multiplier: '1.5x', color: '#4ecdc4' },
  { id: 'erip', name: 'ЕРИП', icon: '📱', multiplier: '3x', color: '#ffe66d' },
]

function CategoryGrid({ onSelect }) {
  return (
    <div className="category-grid">
      <h3>Выбери категорию покупки</h3>
      <div className="grid">
        {categories.map(cat => (
          <div
            key={cat.id}
            className="category-card"
            data-category={cat.id}
            onClick={() => onSelect(cat)}
          >
            <span className="cat-icon">{cat.icon}</span>
            <span className="cat-name">{cat.name}</span>
            <span className="cat-multiplier">{cat.multiplier}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CategoryGrid