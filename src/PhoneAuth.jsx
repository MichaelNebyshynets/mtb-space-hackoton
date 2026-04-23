import { useState } from 'react'
import { supabase } from './supabase'
import './PhoneAuth.css'

function PhoneAuth({ onLogin }) {
  const [step, setStep] = useState('phone')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [username, setUsername] = useState('')
  const [referralInput, setReferralInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [tempUser, setTempUser] = useState(null)

  const formatPhone = (value) => {
    let cleaned = value.replace(/[^\d+]/g, '')
    if (!cleaned.startsWith('+')) cleaned = '+' + cleaned
    return cleaned
  }

  const handleSendCode = async (e) => {
    e.preventDefault()
    const formattedPhone = formatPhone(phone)
    if (formattedPhone.length < 10) {
      setError('Введите корректный номер телефона')
      return
    }
    setError('')
    setStep('code')
  }

  const handleVerifyCode = async (e) => {
    e.preventDefault()
    if (code !== '123456') {
      setError('Неверный код. Используйте 123456')
      return
    }
    
    setError('')
    const formattedPhone = formatPhone(phone)
    
    const generateUUID = (phone) => {
      const hash = phone.split('').reduce((acc, char) => {
        return ((acc << 5) - acc) + char.charCodeAt(0) | 0
      }, 0)
      const hex = Math.abs(hash).toString(16).padStart(32, '0').slice(0, 32)
      return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20,32)}`
    }

    const fakeUser = {
      id: generateUUID(formattedPhone),
      phone: formattedPhone
    }

    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('phone', formattedPhone)
      .maybeSingle()

    if (existingUser) {
      onLogin(fakeUser)
    } else {
      setTempUser(fakeUser)
      setStep('name')
    }
  }

  const handleComplete = async () => {
    if (!username.trim()) {
      setError('Введи имя')
      return
    }
    
    setLoading(true)
    setError('')

    try {
      const formattedPhone = formatPhone(phone)
      
      // Генерируем реферальный код
      const generateReferralCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        let code = 'MTB-'
        for (let i = 0; i < 6; i++) {
          code += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        return code
      }

      const referralCode = generateReferralCode()
      let referredBy = null
      let bonusPoints = 420
      
      // Проверяем реферальный код
      if (referralInput.trim()) {
        const { data: referrer } = await supabase
          .from('users')
          .select('id, loyalty_points')
          .eq('referral_code', referralInput.trim().toUpperCase())
          .maybeSingle()
        
        if (referrer) {
          referredBy = referrer.id
          bonusPoints = 920 // +500 бонусных баллов
          
          // Начисляем бонус рефереру
          await supabase
            .from('users')
            .update({ 
              loyalty_points: referrer.loyalty_points + 500
            })
            .eq('id', referrer.id)
        }
      }
      
      // Создаём пользователя
      await supabase.from('users').insert({
        id: tempUser.id,
        phone: formattedPhone,
        username: username,
        mascot: 'lion',
        referral_code: referralCode,
        referred_by: referredBy,
        balance: 1247.50,
        battery: 5,
        max_battery: 5,
        loyalty_points: bonusPoints,
        last_seen: new Date()
      })

      // Создаём всех 5 маскотов
      const mascots = ['lion', 'eagle', 'bear', 'stork', 'cat']
      for (const mascotId of mascots) {
        await supabase.from('user_mascots').insert({
          user_id: tempUser.id,
          mascot_id: mascotId,
          level: 1,
          experience: 0,
          high_score: 0,
          is_active: mascotId === 'lion'
        })
      }

      onLogin(tempUser)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    if (step === 'code') {
      setStep('phone')
      setCode('')
    } else if (step === 'name') {
      setStep('code')
    } else if (step === 'referral') {
      setStep('name')
    }
    setError('')
  }

  // Экран ввода имени
  if (step === 'name') {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2>🚀 MTB Space Station</h2>
          <h3>Как тебя зовут?</h3>
          <input
            type="text"
            placeholder="Твоё имя"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
          />
          {error && <p className="auth-error">{error}</p>}
          <button className="auth-btn" onClick={() => setStep('referral')}>
            Далее
          </button>
          <button className="auth-back" onClick={handleBack}>← Назад</button>
        </div>
      </div>
    )
  }

  // Экран ввода реферального кода
  if (step === 'referral') {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2>🚀 MTB Space Station</h2>
          <h3>Есть реферальный код?</h3>
          <input
            type="text"
            placeholder="MTB-XXXXXX (необязательно)"
            value={referralInput}
            onChange={(e) => setReferralInput(e.target.value.toUpperCase())}
            autoFocus
          />
          <p className="auth-hint">Если друг дал код — введи его и получи +500 ⭐</p>
          {error && <p className="auth-error">{error}</p>}
          <button className="auth-btn" onClick={handleComplete} disabled={loading}>
            {loading ? 'Создание...' : 'Завершить'}
          </button>
          <button className="auth-back" onClick={handleBack}>← Назад</button>
        </div>
      </div>
    )
  }

  // Экран ввода телефона / кода
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>🚀 MTB Space Station</h2>
        {step === 'phone' ? (
          <>
            <h3>Вход по номеру телефона</h3>
            <form onSubmit={handleSendCode}>
              <input
                type="tel"
                placeholder="+375 (29) 123-45-67"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              {error && <p className="auth-error">{error}</p>}
              <button type="submit" className="auth-btn">
                Получить код
              </button>
            </form>
          </>
        ) : (
          <>
            <h3>Введите код из SMS</h3>
            <p className="auth-phone">На номер {formatPhone(phone)}</p>
            <form onSubmit={handleVerifyCode}>
              <input
                type="text"
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
                required
              />
              {error && <p className="auth-error">{error}</p>}
              <button type="submit" className="auth-btn">
                Подтвердить
              </button>
              <button type="button" className="auth-back" onClick={handleBack}>
                ← Назад
              </button>
            </form>
          </>
        )}
        <p className="auth-hint">🔧 Демо-режим: код 123456</p>
      </div>
    </div>
  )
}

export default PhoneAuth