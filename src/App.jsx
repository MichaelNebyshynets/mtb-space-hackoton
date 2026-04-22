import { useState, useEffect } from 'react'
import './App.css'
import FuelCard from './FuelCard'
import UpgradeShop from './UpgradeShop'
import BankWidget from './BankWidget'
import Character from './Character'
import PhoneAuth from './PhoneAuth'
import { supabase } from './supabase'

function App() {
  const [session, setSession] = useState(null)

  const [fuel, setFuel] = useState(0)
  const [telegramUser, setTelegramUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [dbUser, setDbUser] = useState(null)
  
  const [currentScreen, setCurrentScreen] = useState('home')
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const [showBankWidget, setShowBankWidget] = useState(false)
  const [showEarned, setShowEarned] = useState(null)
  
  const [purchaseAmount, setPurchaseAmount] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('cafe')
  
  const [upgrades, setUpgrades] = useState({
    armor: { level: 1, name: 'Броня', baseCost: 100 },
    engine: { level: 1, name: 'Двигатель', baseCost: 200 },
    scanner: { level: 1, name: 'Сканер', baseCost: 150 },
  })
  const [bankTransactions, setBankTransactions] = useState([])
  
  const [character, setCharacter] = useState({
    hunger: 100,
    activity: 100
  })

  const categories = {
    cafe: { name: 'Кафе', multiplier: 2, icon: '🍕' },
    transport: { name: 'Транспорт', multiplier: 1.5, icon: '🚌' },
    erip: { name: 'ЕРИП', multiplier: 3, icon: '📱' },
  }




    useEffect(() => {
      const savedUser = localStorage.getItem('mtb_user')
      if (savedUser) {
        setSession(JSON.parse(savedUser))
      }
      //setLoading(false)
    }, [])

    const handleLogin = (user) => {
      localStorage.setItem('mtb_user', JSON.stringify(user))
      setSession(user)
      //setLoading(true)
    }

    const handleLogout = () => {
      localStorage.removeItem('mtb_user')
      setSession(null)
    }

    
    // Загрузка данных пользователя из Supabase
    useEffect(() => {
      if (!session) {
        setLoading(false)
        return
      }
      
      const loadUserData = async () => {
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.id)
          .maybeSingle()
        
        if (userData) {
          setDbUser(userData)
          setFuel(userData.fuel || 100)
          setCharacter({
            hunger: userData.hunger || 100,
            activity: userData.activity || 100
          })
          // ... загрузи остальные данные
        }
        
        setLoading(false)
      }
      
      loadUserData()
    }, [session])

    // Если не залогинен — показываем PhoneAuth
    if (!session) {
      return <PhoneAuth onLogin={handleLogin} />
    }


  // Инициализация Telegram и загрузка из Supabase
  // useEffect(() => {
  //   const tg = window.Telegram?.WebApp
    
  //   const initApp = async () => {
  //     let user = null
      
  //     if (tg) {
  //       tg.expand()
        
  //       if (tg.initData) {
  //         const params = new URLSearchParams(tg.initData)
  //         const userParam = params.get('user')
  //         if (userParam) {
  //           try { user = JSON.parse(userParam) } catch (e) {}
  //         }
  //       }
  //       if (!user) user = tg.initDataUnsafe?.user
        
  //       if (user) {
  //         setTelegramUser(user)
  //       } else {
  //         setTelegramUser({ id: '999', first_name: 'Гость' })
  //         user = { id: '999', first_name: 'Гость' }
  //       }
        
  //       tg.ready()
  //     } else {
  //       setTelegramUser({ id: '999', first_name: 'Гость (браузер)' })
  //       user = { id: '999', first_name: 'Гость' }
  //     }
      
  //     // Работа с Supabase
  //     if (user) {
  //       const telegramId = String(user.id)
        
  //       let { data: existingUser, error } = await supabase
  //         .from('users')
  //         .select('*')
  //         .eq('telegram_id', telegramId)
  //         .maybeSingle()
        
  //       if (error) {
  //         console.error('Ошибка при поиске пользователя:', error)
  //       }
        
  //       const now = new Date()
        
  //       if (!existingUser) {
  //         const { data: newUser, error: createError } = await supabase
  //           .from('users')
  //           .insert({
  //             telegram_id: telegramId,
  //             first_name: user.first_name || 'Гость',
  //             last_name: user.last_name || null,
  //             username: user.username || null,
  //             fuel: 100,
  //             hunger: 100,
  //             activity: 100,
  //             last_seen: now
  //           })
  //           .select()
  //           .single()
          
  //         if (createError) {
  //           console.error('Ошибка при создании пользователя:', createError)
  //           setDbUser({ id: 'local', telegram_id: telegramId })
  //           setFuel(100)
  //           setCharacter({ hunger: 100, activity: 100 })
  //           setLoading(false)
  //           return
  //         }
          
  //         existingUser = newUser
  //       } else {
  //         const lastSeen = new Date(existingUser.last_seen || existingUser.created_at)
  //         const minutesPassed = Math.floor((now - lastSeen) / (1000 * 60))
          
  //         const hungerLoss = Math.min(minutesPassed, 100)
  //         const activityLoss = Math.min(minutesPassed * 0.5, 100)
          
  //         const newHunger = Math.max(0, (existingUser.hunger || 100) - hungerLoss)
  //         const newActivity = Math.max(0, (existingUser.activity || 100) - activityLoss)
          
  //         if (newHunger !== existingUser.hunger || newActivity !== existingUser.activity) {
  //           const { error: updateError } = await supabase
  //             .from('users')
  //             .update({ 
  //               hunger: newHunger, 
  //               activity: newActivity,
  //               last_seen: now
  //             })
  //             .eq('id', existingUser.id)
            
  //           if (updateError) {
  //             console.error('Ошибка обновления:', updateError)
  //           }
            
  //           existingUser.hunger = newHunger
  //           existingUser.activity = newActivity
  //         } else {
  //           await supabase
  //             .from('users')
  //             .update({ last_seen: now })
  //             .eq('id', existingUser.id)
  //         }
  //       }
        
  //       setDbUser(existingUser)
  //       setFuel(existingUser.fuel || 100)
  //       setCharacter({
  //         hunger: existingUser.hunger || 100,
  //         activity: existingUser.activity || 100
  //       })
        
  //       // Загружаем транзакции
  //       const { data: transactions } = await supabase
  //         .from('transactions')
  //         .select('*')
  //         .eq('user_id', existingUser.id)
  //         .order('created_at', { ascending: false })
  //         .limit(20)
        
  //       setBankTransactions(transactions || [])
        
  //       // Загружаем прокачки
  //       const { data: dbUpgrades } = await supabase
  //         .from('upgrades')
  //         .select('*')
  //         .eq('user_id', existingUser.id)
        
  //       if (dbUpgrades && dbUpgrades.length > 0) {
  //         const newUpgrades = { 
  //           armor: { level: 1, name: 'Броня', baseCost: 100 }, 
  //           engine: { level: 1, name: 'Двигатель', baseCost: 200 }, 
  //           scanner: { level: 1, name: 'Сканер', baseCost: 150 } 
  //         }
  //         dbUpgrades.forEach(u => {
  //           if (newUpgrades[u.upgrade_id]) {
  //             newUpgrades[u.upgrade_id].level = u.level
  //           }
  //         })
  //         setUpgrades(newUpgrades)
  //       }
  //     }
      
  //     setLoading(false)
  //   }
    
  //   initApp()
  // }, [])

  const userName = telegramUser?.first_name || 'Гость'
  const currentLevel = Math.floor(fuel / 500) + 1
  const currentLevelFuel = fuel % 500
  const progressPercent = (currentLevelFuel / 500) * 100

  const updateLastSeen = async () => {
    if (dbUser && dbUser.id !== 'local') {
      await supabase
        .from('users')
        .update({ last_seen: new Date() })
        .eq('id', dbUser.id)
    }
  }

  const handlePurchase = async () => {
    const amount = Number(purchaseAmount)
    if (amount <= 0) {
      alert('Введите сумму покупки')
      return
    }
    
    const category = categories[selectedCategory]
    
    const shopNames = {
      cafe: ['Кафе "Уют"', 'Starbucks', 'Wolt', 'Якитория'],
      transport: ['Метрополитен', 'Яндекс.Такси', 'АЗС Белнефтехим'],
      erip: ['МТС', 'A1', 'Интернет ByFly', 'ЖКХ']
    }
    const randomShop = shopNames[selectedCategory][Math.floor(Math.random() * shopNames[selectedCategory].length)]
    
    const mccMap = {
      cafe: ['5812', '5814'],
      transport: ['4111', '5541'],
      erip: ['4814', '4900']
    }
    const randomMcc = mccMap[selectedCategory][Math.floor(Math.random() * mccMap[selectedCategory].length)]
    
    const earned = Math.round(amount * category.multiplier)
    await updateLastSeen()
    const uniqueCode = `MTB-${randomMcc}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    
    if (!dbUser || dbUser.id === 'local') {
      const newTransaction = {
        id: 'local-' + Date.now(),
        title: randomShop,
        amount,
        category: selectedCategory,
        mcc: randomMcc,
        icon: category.icon,
        earned,
        code: uniqueCode,
        used: false,
        created_at: new Date().toISOString()
      }
      setBankTransactions(prev => [newTransaction, ...prev].slice(0, 20))
      alert(`✅ Покупка добавлена (демо)!\nКод: ${uniqueCode}`)
    } else {
      const { data: newTransaction } = await supabase
        .from('transactions')
        .insert({
          user_id: dbUser.id,
          title: randomShop,
          amount,
          category: selectedCategory,
          mcc: randomMcc,
          icon: category.icon,
          earned,
          code: uniqueCode,
          used: false
        })
        .select()
        .single()
      
      setBankTransactions(prev => [newTransaction, ...prev].slice(0, 20))
      alert(`✅ Покупка добавлена!\nКод: ${uniqueCode}`)
    }
    
    setShowPurchaseModal(false)
    setPurchaseAmount('')
  }

  const handleBankCode = async (codeData) => {
    if (codeData.used) {
      alert('Этот код уже использован!')
      return
    }
    
    const earned = codeData.earned
    const newFuel = fuel + earned
    await updateLastSeen()
    
    if (dbUser && dbUser.id !== 'local') {
      await supabase
        .from('users')
        .update({ fuel: newFuel })
        .eq('id', dbUser.id)
      
      await supabase
        .from('transactions')
        .update({ used: true })
        .eq('id', codeData.id)
    }
    
    setFuel(newFuel)
    setBankTransactions(prev => 
      prev.map(t => t.id === codeData.id ? { ...t, used: true } : t)
    )
    
    const newHunger = Math.min(100, character.hunger + 10)
    setCharacter(prev => ({ ...prev, hunger: newHunger }))
    
    if (dbUser && dbUser.id !== 'local') {
      await supabase
        .from('users')
        .update({ hunger: newHunger })
        .eq('id', dbUser.id)
    }
    
    setShowEarned({ amount: earned, category: codeData.title })
    setTimeout(() => setShowEarned(null), 1200)
    
    setShowBankWidget(false)
  }

  const handleUpgrade = async (upgradeId) => {
    const upgrade = upgrades[upgradeId]
    const cost = upgrade.baseCost * upgrade.level
    
    if (fuel < cost) {
      alert('Недостаточно топлива')
      return
    }
    
    const newFuel = fuel - cost
    const newLevel = upgrade.level + 1
    await updateLastSeen()
    
    if (dbUser && dbUser.id !== 'local') {
      await supabase
        .from('users')
        .update({ fuel: newFuel })
        .eq('id', dbUser.id)
      
      const { data: existing } = await supabase
        .from('upgrades')
        .select('*')
        .eq('user_id', dbUser.id)
        .eq('upgrade_id', upgradeId)
        .maybeSingle()
      
      if (existing) {
        await supabase
          .from('upgrades')
          .update({ level: newLevel })
          .eq('id', existing.id)
      } else {
        await supabase
          .from('upgrades')
          .insert({
            user_id: dbUser.id,
            upgrade_id: upgradeId,
            level: newLevel
          })
      }
    }
    
    setFuel(newFuel)
    setUpgrades(prev => ({
      ...prev,
      [upgradeId]: { ...prev[upgradeId], level: newLevel }
    }))
    
    const newActivity = Math.min(100, character.activity + 15)
    setCharacter(prev => ({ ...prev, activity: newActivity }))
    
    if (dbUser && dbUser.id !== 'local') {
      await supabase
        .from('users')
        .update({ activity: newActivity })
        .eq('id', dbUser.id)
    }
  }

  if (loading) {
    return (
      <div className="app">
        <main className="app-main">
          <div style={{ color: 'white', textAlign: 'center', padding: 50 }}>
            <h2>🚀 Загрузка...</h2>
          </div>
        </main>
      </div>
    )
  }

  console.log('App render:', { session, loading })

  return (
    <div className="app">
      <header className="app-header">
        <h1>🚀 MTB Space Station</h1>
        <p className="user-greeting">
          Привет, {userName}!
        </p>
      </header>
      
      <main className="app-main">
        {currentScreen === 'home' ? (
          <>
            <Character 
              hunger={character.hunger}
              activity={character.activity}
              level={currentLevel}
              upgrades={upgrades}
            />
            
            <FuelCard fuel={fuel} />
            
            <div className="level-section">
              <div className="level-header">
                <span className="level-badge">⭐ Уровень станции {currentLevel}</span>
                <span className="level-progress-text">{currentLevelFuel} / 500 🚀</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
            
            <button className="purchase-main-button" onClick={() => setShowPurchaseModal(true)}>
              🛒 Совершить покупку
            </button>
            
            <button className="bank-nav-button" onClick={() => setShowBankWidget(true)}>
              🏦 Мои операции (МТБанк)
            </button>
            
            <button className="shop-nav-button" onClick={() => setCurrentScreen('shop')}>
              🏪 Магазин прокачек
            </button>
          </>
        ) : (
          <UpgradeShop 
            fuel={fuel}
            upgrades={upgrades}
            onUpgrade={handleUpgrade}
            onBack={() => setCurrentScreen('home')}
          />
        )}
      </main>
      
      {showEarned && (
        <div className="earned-toast">
          <span className="earned-amount">+{showEarned.amount}</span>
          <span className="earned-icon">🚀</span>
          <span className="earned-category">{showEarned.category}</span>
        </div>
      )}
      
      {showPurchaseModal && (
        <div className="modal-overlay" onClick={() => setShowPurchaseModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Новая покупка</h3>
            
            <div className="modal-categories">
              {Object.entries(categories).map(([id, cat]) => (
                <div
                  key={id}
                  className={`modal-category ${selectedCategory === id ? 'selected' : ''}`}
                  onClick={() => setSelectedCategory(id)}
                >
                  <span className="modal-cat-icon">{cat.icon}</span>
                  <span className="modal-cat-name">{cat.name}</span>
                  <span className="modal-cat-multiplier">{cat.multiplier}x</span>
                </div>
              ))}
            </div>
            
            <div className="modal-input-group">
              <label>Сумма покупки (BYN)</label>
              <input
                type="number"
                value={purchaseAmount}
                onChange={(e) => setPurchaseAmount(e.target.value)}
                placeholder="Например: 25.50"
                min="1"
                step="0.01"
                autoFocus
              />
            </div>
            
            <div className="modal-preview">
              <span>Вы получите (после активации кода):</span>
              <strong>
                {purchaseAmount ? Math.round(Number(purchaseAmount) * categories[selectedCategory].multiplier) : 0} 🚀
              </strong>
            </div>
            
            <div className="modal-buttons">
              <button className="modal-btn cancel" onClick={() => {
                setShowPurchaseModal(false)
                setPurchaseAmount('')
              }}>
                Отмена
              </button>
              <button className="modal-btn confirm" onClick={handlePurchase}>
                Создать код
              </button>
            </div>
          </div>
        </div>
      )}
      
      {showBankWidget && (
        <BankWidget 
          transactions={bankTransactions}
          onUseCode={handleBankCode}
          onClose={() => setShowBankWidget(false)}
        />
      )}
    </div>
  )
}

export default App  