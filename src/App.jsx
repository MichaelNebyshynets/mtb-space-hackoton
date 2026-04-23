import { useState, useEffect } from 'react'
import './App.css'
import FuelCard from './FuelCard'
import UpgradeShop from './UpgradeShop'
import BankWidget from './BankWidget'
import Character from './Character'
import PhoneAuth from './PhoneAuth'
import MascotSwitcher from './MascotSwitcher'
import BalanceCard from './BalanceCard'
import GameScreen from './GameScreen'
import Leaderboard from './Leaderboard'
import BonusShop from './BonusShop'
import Referral from './Referral'
import { supabase } from './supabase'

function App() {


  const [showGame, setShowGame] = useState(false)

  const [balance, setBalance] = useState(1247.50)  // реальный счёт
  const [loyaltyPoints, setLoyaltyPoints] = useState(420)  // баллы для прокачек
  const [battery, setBattery] = useState(3)
  const [maxBattery, setMaxBattery] = useState(5)

  const [showMascotSwitcher, setShowMascotSwitcher] = useState(false) 

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

  const [userMascots, setUserMascots] = useState([])
  const [activeMascot, setActiveMascot] = useState(null)

  const [showLeaderboard, setShowLeaderboard] = useState(false)

  const [mode, setMode] = useState('bank')

  const [showUpgradeStore, setShowUpgradeStore] = useState(false)

  const [showBonusShop, setShowBonusShop] = useState(false)
  const [showReferral, setShowReferral] = useState(false)


  const handleUseBonus = async (purchasedBonus) => {
    // Помечаем как использованный в Supabase
    if (dbUser && dbUser.id !== 'local') {
      const { error } = await supabase
        .from('user_bonuses')
        .update({ used: true })
        .eq('id', purchasedBonus.id)
      
      if (error) {
        console.error('Ошибка использования бонуса:', error)
        return
      }
    }
    
    const bonus = bonuses.find(b => b.id === purchasedBonus.bonus_id)
    alert(`🎉 Вы использовали: ${bonus?.name || 'бонус'}!\n${bonus?.description}`)
    setShowBonusShop(false)
  }

  // Массив bonuses нужно вынести на уровень App или импортировать
  const bonuses = [
    { id: 'burger', name: 'Бесплатный бургер', icon: '☕', cost: 500, description: 'Промокод в Burger King' },
    { id: 'cashback', name: 'Кэшбек 5%', icon: '💸', cost: 1000, description: 'Повышенный кэшбек на одежду из Bershka' },
    { id: 'cinema', name: 'Билет в кино', icon: '🎬', cost: 1500, description: 'Скидка 50% на билет' },
    { id: 'taxi', name: 'Поездка на такси', icon: '🚖', cost: 2000, description: 'Промокод на 15 BYN' },
    { id: 'card', name: 'Бесплатная карта', icon: '🛍️', cost: 5000, description: 'Бесплатный выпуск новой карты МТБанка' },
  ]
  const handleBuyBonus = async (bonus) => {
    if (loyaltyPoints < bonus.cost) {
      alert('Недостаточно баллов')
      return
    }
    
    const newLoyalty = loyaltyPoints - bonus.cost
    
    // Сохраняем в Supabase
    if (dbUser && dbUser.id !== 'local') {
      const { error } = await supabase
        .from('user_bonuses')
        .insert({
          user_id: dbUser.id,
          bonus_id: bonus.id
        })
      
      if (error) {
        if (error.code === '23505') {
          alert('Вы уже купили этот бонус!')
          return
        }
        console.error('Ошибка покупки бонуса:', error)
      }
      
      await supabase
        .from('users')
        .update({ loyalty_points: newLoyalty })
        .eq('id', dbUser.id)
    }
    
    setLoyaltyPoints(newLoyalty)
    alert(`✅ Вы приобрели: ${bonus.name}!\n${bonus.description}`)
  }



  const startGame = () => {
    if (battery <= 0) {
      alert('Недостаточно батареек! Совершите транзакцию.')
      return
    }
    setShowGame(true)
  }

  // Обработка конца игры
  const handleGameEnd = async (score) => {
    console.log('🔥 handleGameEnd вызван! score:', score)


    const newBattery = battery - 1  // Тратим 1 батарейку
    const earnedLoyalty = Math.floor(score / 10) + 5  // 5 базово + за очки
    const newLoyalty = loyaltyPoints + earnedLoyalty
    
    // Сохраняем в Supabase
    if (dbUser && dbUser.id !== 'local') {
      await supabase
        .from('users')
        .update({ 
          battery: newBattery,
          loyalty_points: newLoyalty 
        })
        .eq('id', dbUser.id)
    }
    
    setBattery(newBattery)
    setLoyaltyPoints(newLoyalty)
    setShowGame(false)
    
    if (score > (activeMascot?.high_score || 0)) {
      await supabase
        .from('user_mascots')
        .update({ high_score: score })
        .eq('user_id', dbUser.id)
        .eq('mascot_id', activeMascot.mascot_id)
      
      setActiveMascot(prev => ({ ...prev, high_score: score }))
      setUserMascots(prev => prev.map(m => 
        m.mascot_id === activeMascot.mascot_id 
          ? { ...m, high_score: score } 
          : m
      ))
    }

    alert(`🎮 Игра окончена! Счёт: ${score}\n-1 🔋\n+${earnedLoyalty} ⭐ баллов лояльности`)
  }


  const calculateBattery = (amount) => {
    return Math.floor(amount / 10)  // 1 батарейка за каждые 10 BYN
  }


  useEffect(() => {
    const interval = setInterval(() => {
      setBattery(prev => prev < maxBattery ? prev + 1 : prev)
    }, 3600000) // каждый час
    
    return () => clearInterval(interval)
  }, [maxBattery])

  const mascotNames = {
    lion: 'Лев',
    eagle: 'Орёл',
    bear: 'Медведь',
    stork: 'Аист',
    cat: 'Кот',
  }

  // Загрузка всех маскотов пользователя
  const loadUserMascots = async (userId) => {
    console.log('🔄 Загружаем маскотов для userId:', userId)
    
    let { data, error } = await supabase
      .from('user_mascots')
      .select('*')
      .eq('user_id', userId)
      .order('mascot_id')
    
    console.log('📦 Ответ от Supabase:', { data, error })
    
    // Если маскотов нет — создаём
    if (!data || data.length === 0) {
      console.log('🆕 Маскотов нет, создаём...')
      
      const mascots = ['lion', 'eagle', 'bear', 'stork', 'cat']
      for (const mascotId of mascots) {
        await supabase.from('user_mascots').insert({
          user_id: userId,
          mascot_id: mascotId,
          level: 1,
          experience: 0,
          is_active: mascotId === 'lion'
        })
      }
      
      // Загружаем снова
      const { data: newData } = await supabase
        .from('user_mascots')
        .select('*')
        .eq('user_id', userId)
        .order('mascot_id')
      
      data = newData
    }
    
    console.log('✅ Итоговые маскоты:', data)
    setUserMascots(data || [])
    const active = data?.find(m => m.is_active) || data?.[0]
    if (active) setActiveMascot(active)
  }

  // Переключение активного маскота
  const switchMascot = async (mascotId) => {

    const userId = session?.user?.id || dbUser?.id
    if (!userId) return
    // Снимаем active со всех
    await supabase
      .from('user_mascots')
      .update({ is_active: false })
      .eq('user_id', dbUser.id)
    
    // Ставим active на выбранный
    await supabase
      .from('user_mascots')
      .update({ is_active: true })
      .eq('user_id', dbUser.id)
      .eq('mascot_id', mascotId)
    
    // Обновляем локально
    setUserMascots(prev => prev.map(m => ({
      ...m,
      is_active: m.mascot_id === mascotId
    })))
    
    setActiveMascot(userMascots.find(m => m.mascot_id === mascotId))
  }

  // При регистрации — создаём всех 5 маскотов
  const createInitialMascots = async (userId) => {
    const mascots = ['lion', 'eagle', 'bison', 'stork', 'cat']
    
    for (const mascotId of mascots) {
      await supabase.from('user_mascots').insert({
        user_id: userId,
        mascot_id: mascotId,
        level: 1,
        experience: 0,
        is_active: mascotId === 'lion', // Лев — стартовый
        unlocked_abilities: []
      })
    }
  }
  
  const [upgrades, setUpgrades] = useState({
    armor: { level: 1, name: 'Броня', baseCost: 100 },
    engine: { level: 1, name: 'Двигатель', baseCost: 200 },
    scanner: { level: 1, name: 'Сканер', baseCost: 150 },
  })
  const [bankTransactions, setBankTransactions] = useState([])
  

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
    const userId = session.id
    
    console.log('🔑 Загружаем данные для userId:', userId)
    
    // 1. Загружаем или создаём пользователя в таблице users
    let { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle()
  
    if (!userData) {
      console.log('🆕 Создаём пользователя в таблице users')
      const { data: newUser } = await supabase
        .from('users')
        .insert({
          id: userId,
          phone: session.phone || 'unknown',
          mascot: 'lion',
          balance: 1247.50,
          battery: 5,
          max_battery: 5,
          loyalty_points: 420,
          last_seen: new Date()
        })
        .select()
        .single()
      
      userData = newUser
    }
    
    setDbUser(userData)
    setBalance(userData.balance || 1247.50)
    setBattery(userData.battery || 5)
    setMaxBattery(userData.max_battery || 5)
    setLoyaltyPoints(userData.loyalty_points || 420)


    const { data: transactions, error: txError } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20)

    if (txError) {
      console.error('❌ Ошибка загрузки транзакций:', txError)
    } else {
      console.log('📦 Транзакции из базы:', transactions)
    }

    setBankTransactions(transactions || [])
        
    // 2. Загружаем маскотов
    let { data: mascots } = await supabase
      .from('user_mascots')
      .select('*')
      .eq('user_id', userId)
      .order('mascot_id')
    
    console.log('📦 Маскоты из базы:', mascots)
    
    // 3. Если маскотов нет — создаём
    if (!mascots || mascots.length === 0) {
      console.log('🆕 СОЗДАЁМ МАСКОТОВ')
      
      const mascotList = ['lion', 'eagle', 'bear', 'stork', 'cat']
      for (const m of mascotList) {
        await supabase.from('user_mascots').insert({
          user_id: userId,
          mascot_id: m,
          level: 1,
          experience: 0,
          is_active: m === 'lion'
        })
      }
      
      // Загружаем снова
      const { data: newMascots } = await supabase
        .from('user_mascots')
        .select('*')
        .eq('user_id', userId)
        .order('mascot_id')
      
      mascots = newMascots
    }
    
    console.log('✅ Итоговые маскоты:', mascots)
    setUserMascots(mascots || [])
    
    const active = mascots?.find(m => m.is_active) || mascots?.[0]
    if (active) {
      console.log('⭐ Активный маскот:', active)
      setActiveMascot(active)
    }
    
    setLoading(false)
  }
  
  loadUserData()
}, [session])


  const saveBalance = async (newBalance) => {
    if (dbUser && dbUser.id !== 'local') {
      await supabase
        .from('users')
        .update({ balance: newBalance })
        .eq('id', dbUser.id)
    }
  }

  const saveBattery = async (newBattery) => {
    if (dbUser && dbUser.id !== 'local') {
      await supabase
        .from('users')
        .update({ battery: newBattery })
        .eq('id', dbUser.id)
    }
  }

  const saveLoyaltyPoints = async (newLoyalty) => {
    if (dbUser && dbUser.id !== 'local') {
      await supabase
        .from('users')
        .update({ loyalty_points: newLoyalty })
        .eq('id', dbUser.id)
    }
  }

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

  const userName = dbUser?.username || dbUser?.phone || 'Гость' 
  const currentLevel = Math.floor(fuel / 500) + 1
  const currentLevelFuel = fuel % 500
  const progressPercent = (currentLevelFuel / 500) * 100


// Удали handlePurchase и модалку покупки, добавь эти три функции:

const handleTransfer = async () => {
  const amount = prompt('Введите сумму перевода (BYN):')
  if (!amount || amount <= 0) return
  
  const numAmount = Number(amount)
  const earnedBattery = calculateBattery(numAmount)
  const earnedLoyalty = Math.floor(numAmount * 2)
  
  const newBattery = battery + earnedBattery
  const newLoyalty = loyaltyPoints + earnedLoyalty
  const newBalance = balance - numAmount
  
  const newTransaction = {
    id: Date.now().toString(),
    title: `Перевод`,
    amount: numAmount,
    created_at: new Date().toISOString()
  }
  
  console.log('🆕 newTransaction:', newTransaction)
  
  setBankTransactions(prev => {
    console.log('📋 prev bankTransactions:', prev)
    const updated = [newTransaction, ...prev].slice(0, 20)
    console.log('✅ updated bankTransactions:', updated)
    return updated
  })

  if (dbUser && dbUser.id !== 'local') {
    console.log('💾 Сохраняем в Supabase, userId:', dbUser.id)
    
    // Обновляем users
    const { error: userError } = await supabase
      .from('users')
      .update({ 
        battery: newBattery,
        loyalty_points: newLoyalty,
        balance: newBalance
      })
      .eq('id', dbUser.id)
    
    if (userError) {
      console.error('❌ Ошибка обновления users:', userError)
    } else {
      console.log('✅ users обновлены')
    }

    // Сохраняем транзакцию
    const { error: txError } = await supabase
      .from('transactions')
      .insert({
        user_id: dbUser.id,
        title: 'Перевод',
        amount: numAmount,
        category: 'transfer',
        earned: earnedLoyalty,
        used: true
      })
    
    if (txError) {
      console.error('❌ Ошибка вставки транзакции:', txError)
      alert('Ошибка сохранения транзакции в базу: ' + txError.message)
    } else {
      console.log('✅ Транзакция сохранена в Supabase')
    }
  } else {
    console.log('⚠️ Локальный режим, в базу не сохраняем')
  }
  
  setBattery(newBattery)
  setLoyaltyPoints(newLoyalty)
  setBalance(newBalance)
  
  alert(`✅ Перевод на ${amount} BYN выполнен!\n+${earnedBattery}🔋 +${earnedLoyalty}⭐`)
}

  const handleErip = async () => {
    const amount = prompt('Введите сумму оплаты ЕРИП (BYN):')
    if (!amount || amount <= 0) return
    
    const numAmount = Number(amount)
    const earnedBattery = calculateBattery(numAmount) + 1  // +1 бонус за ЕРИП
    const earnedLoyalty = Math.floor(numAmount * 3)  // x3 балла за ЕРИП
    
    const newBattery = battery + earnedBattery
    const newLoyalty = loyaltyPoints + earnedLoyalty
    const newBalance= balance - numAmount

    const newTransaction = {
      id: Date.now().toString(),
      title: `ЕРИП`,
      amount: numAmount,
      created_at: new Date().toISOString()
    }
    setBankTransactions(prev => [newTransaction, ...prev].slice(0, 20))
    
    if (dbUser && dbUser.id !== 'local') {
      await supabase
        .from('users')
        .update({ 
          battery: newBattery,
          loyalty_points: newLoyalty,
          balance: newBalance
        })
        .eq('id', dbUser.id)


      await supabase.from('transactions').insert({
        user_id: dbUser.id,
        title: 'ЕРИП',
        amount: numAmount,
        category: 'erip',
        earned: earnedLoyalty,
        used: true
      })
    }
    
    setBattery(newBattery)
    setLoyaltyPoints(newLoyalty)
    setBalance(newBalance)
    
    alert(`✅ Оплата ЕРИП на ${amount} BYN выполнена!\n+${earnedBattery}🔋 +${earnedLoyalty}⭐ (бонус x3)`)
  }

  const handleSave = async () => {
    const amount = prompt('Введите сумму пополнения вклада (BYN):')
    if (!amount || amount <= 0) return
    
    const numAmount = Number(amount)
    const earnedBattery = calculateBattery(numAmount) + 2  // +2 бонус за вклад
    const earnedLoyalty = Math.floor(numAmount * 5)  // x5 баллов за вклад
    
    const newBattery = battery + earnedBattery
    const newLoyalty = loyaltyPoints + earnedLoyalty
    const newBalance = balance - numAmount

    const newTransaction = {
      id: Date.now().toString(),
      title: `Вклад`,
      amount: numAmount,
      created_at: new Date().toISOString()
    }
    setBankTransactions(prev => [newTransaction, ...prev].slice(0, 20))
    
    if (dbUser && dbUser.id !== 'local') {
      await supabase
        .from('users')
        .update({ 
          battery: newBattery,
          loyalty_points: newLoyalty, 
          balance: newBalance
        })
        .eq('id', dbUser.id)



      await supabase.from('transactions').insert({
        user_id: dbUser.id,
        title: 'Вклад',
        amount: numAmount,
        category: 'deposit',
        earned: earnedLoyalty,
        used: true
      })
    }
    
    setBattery(newBattery)
    setLoyaltyPoints(newLoyalty)
    setBalance(newBalance)
    
    alert(`✅ Вклад пополнен на ${amount} BYN!\n+${earnedBattery}🔋 +${earnedLoyalty}⭐ (бонус x5)`)
  }

  const handleBankCode = async (codeData) => {
    if (codeData.used) {
      alert('Этот код уже использован!')
      return
    }
    
    const earnedBattery = calculateBattery(codeData.amount)
    const newBattery = battery + earnedBattery
    const earnedLoyalty = Math.floor(codeData.amount * 2)  // 2 балла за 1 BYN
    
    if (dbUser && dbUser.id !== 'local') {
      await supabase
        .from('users')
        .update({ 
          battery: newBattery,
          loyalty_points: loyaltyPoints + earnedLoyalty 
        })
        .eq('id', dbUser.id)
      
      await supabase
        .from('transactions')
        .update({ used: true })
        .eq('id', codeData.id)
    }
    
    setBattery(newBattery)
    setLoyaltyPoints(prev => prev + earnedLoyalty)
    setBankTransactions(prev => 
      prev.map(t => t.id === codeData.id ? { ...t, used: true } : t)
    )
    
    setShowEarned({ 
      amount: `+${earnedBattery}🔋 +${earnedLoyalty}⭐`, 
      category: codeData.title 
    })
    setTimeout(() => setShowEarned(null), 1200)
    
    setShowBankWidget(false)
  }

  const handleUpgrade = async (mascotId) => {
    const userId = session?.user?.id || dbUser?.id
    const mascot = userMascots.find(m => m.mascot_id === mascotId)
    
    if (!mascot || !userId) return
    
    const cost = mascot.level * 100 + 50  // стоимость в баллах лояльности
    
    if (loyaltyPoints < cost) {
      alert('Недостаточно баллов лояльности')
      return
    }
    
    const newLoyaltyPoints = loyaltyPoints - cost
    const newLevel = mascot.level + 1
    
    // Обновляем в Supabase
    await supabase
      .from('user_mascots')
      .update({ level: newLevel })
      .eq('user_id', userId)
      .eq('mascot_id', mascotId)
    
    // Обновляем локально
    setLoyaltyPoints(newLoyaltyPoints)
    setUserMascots(prev => prev.map(m => 
      m.mascot_id === mascotId ? { ...m, level: newLevel } : m
    ))
    
    if (activeMascot?.mascot_id === mascotId) {
      setActiveMascot(prev => ({ ...prev, level: newLevel }))
    }
    
    // Сохраняем баллы в таблице users
    if (dbUser && dbUser.id !== 'local') {
      await supabase
        .from('users')
        .update({ loyalty_points: newLoyaltyPoints })
        .eq('id', userId)
    }
    
    alert(`🎉 ${mascotNames[mascotId]} достиг уровня ${newLevel}!`)
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
  console.log('userMascots:', userMascots)


  const BankScreen = () => {
    console.log('🏦 BankScreen render, bankTransactions:', bankTransactions)
    
    return (
      <>
        <div className="card-preview">
          <img 
            src="/assets/card.png"
            alt="MTB Card"
            className="card-image"
          />
          <div className="card-balance">{balance.toFixed(2)} BYN</div>
        </div>

        <div className="loyalty-section">
          <span className="loyalty-icon">⭐</span>
          <span className="loyalty-value">{loyaltyPoints}</span>
          <span className="loyalty-label">баллов</span>
        </div>

        <div className="bank-actions">
          <button className="bank-action-btn transfer" onClick={handleTransfer}>
            💸 Перевести
          </button>
          <button className="bank-action-btn erip" onClick={handleErip}>
            📱 Оплатить
          </button>
          <button className="bank-action-btn save" onClick={handleSave}>
            🏦 Вклад
          </button>
        </div>

        <div className="transaction-history">
          <h4>📋 Последние операции</h4>
          {bankTransactions.length === 0 ? (
            <p className="empty-history">Нет операций</p>
          ) : (
            bankTransactions.slice(0, 5).map(tx => (
              <div key={tx.id} className="history-item">
                <span className="history-title">{tx.title}</span>
                <span className="history-amount">-{tx.amount} BYN</span>
                <span className="history-date">{new Date(tx.created_at).toLocaleDateString()}</span>
              </div>
            ))
          )}
        </div>
      </>
    )
  }


  const GameModeScreen = () => (
    <>
      <Character 
        level={currentLevel}
        upgrades={upgrades}
        mascot={activeMascot?.mascot_id || 'lion'}
        mascotLevel={activeMascot?.level || 1}
        onAvatarClick={() => setShowMascotSwitcher(true)}
        battery={battery}
        maxBattery={maxBattery}
      />

      <button className="game-nav-button" onClick={startGame}>
        🎮 Играть (1 🔋)
      </button>

      <button className="shop-nav-button" onClick={() => setCurrentScreen('shop')}>
        🏪 Магазин прокачек
      </button>

      <button className="leaderboard-btn" onClick={() => setShowLeaderboard(true)}>
        🏆 Лидеры
      </button>
    </>
  )

  return (
    <div className="app">
      <header className="app-header">
        <h1>🚀 MTB Space</h1>
        <p className="user-greeting">
          Привет, {userName}!
        </p>
      </header>
      
      <main className="app-main">
        {mode === 'bank' ? (
          <>
            {/* Bank Mode */}
            <div className="card-preview">
              <img 
                src="/assets/card.png"
                alt="MTB Card"
                className="card-image"
              />
              <div className="card-balance">{balance.toFixed(2)} BYN</div>
            </div>

            <div className="loyalty-section">
              <span className="loyalty-icon">⭐</span>
              <span className="loyalty-value">{loyaltyPoints}</span>
              <span className="loyalty-label">баллов</span>
            </div>


            <button className="bonus-nav-button" onClick={() => setShowBonusShop(true)}>
              🎁 Магазин бонусов
            </button>

            <button className="referral-nav-button" onClick={() => setShowReferral(true)}>
              👥 Пригласить друга
            </button>

            <div className="bank-actions">
              <button className="bank-action-btn transfer" onClick={handleTransfer}>
                💸 Перевести
              </button>
              <button className="bank-action-btn erip" onClick={handleErip}>
                📱 Оплатить
              </button>
              <button className="bank-action-btn save" onClick={handleSave}>
                🏦 Вклад
              </button>
            </div>


            <div className="transaction-history">
              <h4>📋 Последние операции</h4>
              {bankTransactions.length === 0 ? (
                <p className="empty-history">Нет операций</p>
              ) : (
                bankTransactions.slice(0, 5).map(tx => (
                  <div key={tx.id} className="history-item">
                    <span className="history-title">{tx.title}</span>
                    <span className="history-amount">-{tx.amount} BYN</span>
                    <span className="history-date">{new Date(tx.created_at).toLocaleDateString()}</span>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          <>
            {/* Game Mode */}
            <Character 
              level={currentLevel}
              upgrades={upgrades}
              mascot={activeMascot?.mascot_id || 'lion'}
              mascotLevel={activeMascot?.level || 1}
              onAvatarClick={() => setShowMascotSwitcher(true)}
              battery={battery}
              maxBattery={maxBattery}
            />

            {/* <BalanceCard balance={balance} /> */}
            
            <div className="loyalty-section">
              <span className="loyalty-icon">⭐</span>
              <span className="loyalty-value">{loyaltyPoints}</span>
              <span className="loyalty-label">баллов</span>
            </div>

            <button className="game-nav-button" onClick={startGame}>
              🎮 Играть (1 🔋)
            </button>

            <button className="shop-nav-button" onClick={() => setShowUpgradeStore(true)}>
              🏪 Магазин прокачек
            </button>

            <button className="leaderboard-btn" onClick={() => setShowLeaderboard(true)}>
              🏆 Лидеры
            </button>
          </>
        )}

      </main>

      {/* Нижний бар навигации */}
      <div className="bottom-nav">
        <div 
          className={`nav-item ${mode === 'bank' ? 'active' : ''}`}
          onClick={() => {
            setMode('bank')
            setCurrentScreen('home')
          }}
        >
          <span>🏠</span>
          <span>Главная</span>
        </div>
        <div 
          className={`nav-item ${mode === 'game' ? 'active' : ''}`}
          onClick={() => {
            setMode('game')
            setCurrentScreen('home')
          }}
        >
          <span>🎮</span>
          <span>Игра</span>
        </div>
        <div className="nav-item" onClick={handleLogout}>
          <span>🚪</span>
          <span>Выйти</span>
        </div>
      </div>

      {/* Анимация прилёта ресурсов */}
      {showEarned && (
        <div className="earned-toast">
          <span className="earned-amount">+{showEarned.amount}</span>
          <span className="earned-icon">🚀</span>
          <span className="earned-category">{showEarned.category}</span>
        </div>
      )}

      {/* Модалки */}
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

      {showMascotSwitcher && (
        <MascotSwitcher
          mascots={userMascots}
          activeMascotId={activeMascot?.mascot_id}
          onSwitch={switchMascot}
          onClose={() => setShowMascotSwitcher(false)}
        />
      )}

      {showGame && (
        <GameScreen 
          battery={battery}
          mascotId={activeMascot?.mascot_id || 'lion'}
          onGameEnd={handleGameEnd}
          onClose={() => setShowGame(false)}
        />
      )}

      {showLeaderboard && (
        <Leaderboard onClose={() => setShowLeaderboard(false)} />
      )}

      {showUpgradeStore && (
        <div className="modal-overlay" onClick={() => setShowUpgradeStore(false)}>
          <div className="modal shop-modal" onClick={(e) => e.stopPropagation()}>
            <UpgradeShop 
              loyaltyPoints={loyaltyPoints}
              userMascots={userMascots}
              activeMascotId={activeMascot?.mascot_id}
              onUpgrade={handleUpgrade}
              onBack={() => setShowUpgradeStore(false)}
            />
          </div>
        </div>
      )}


      {showBonusShop && (
        <div className="modal-overlay" onClick={() => setShowBonusShop(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <BonusShop 
                loyaltyPoints={loyaltyPoints}
                dbUserId={dbUser?.id}
                onBuy={handleBuyBonus}
                onUseBonus={handleUseBonus}
                onClose={() => setShowBonusShop(false)}

            />
          </div>
        </div>
      )}


      {showReferral && (
        <div className="modal-overlay" onClick={() => setShowReferral(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <Referral 
              dbUserId={dbUser?.id}
              onClose={() => setShowReferral(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default App  