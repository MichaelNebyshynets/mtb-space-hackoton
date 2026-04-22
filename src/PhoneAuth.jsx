import { useState } from 'react'
import { supabase } from './supabase'
import MascotPicker from './MascotPicker'
import './PhoneAuth.css'

function PhoneAuth({ onLogin }) {
  const [step, setStep] = useState('phone')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedMascot, setSelectedMascot] = useState('robot')
  const [tempUser, setTempUser] = useState(null)

  const formatPhone = (value) => {
    let cleaned = value.replace(/[^\d+]/g, '')
    if (!cleaned.startsWith('+')) cleaned = '+' + cleaned
    return cleaned
  }

  // Заглушка отправки кода
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

  // Заглушка проверки кода
    const handleVerifyCode = async (e) => {
    e.preventDefault()
    if (code !== '123456') {
        setError('Неверный код. Используйте 123456')
        return
    }
    
    setError('')
    const formattedPhone = formatPhone(phone)
    
    // Генерируем UUID из номера
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

    // Проверяем, есть ли уже такой пользователь
    const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('phone', formattedPhone)
        .maybeSingle()

    if (existingUser) {
        onLogin(fakeUser)
    } else {
        setTempUser(fakeUser)
        setStep('mascot')
    }
    }
  // Завершить регистрацию
  const handleComplete = async () => {
    setLoading(true)
    setError('')
    
    try {
      const { error } = await supabase.from('users').insert({
        id: tempUser.id,
        phone: tempUser.phone,
        mascot: selectedMascot,
        fuel: 100,
        hunger: 100,
        activity: 100,
        last_seen: new Date()
      })
      
      if (error) throw error
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
    } else if (step === 'mascot') {
      setStep('code')
    }
    setError('')
  }

  if (step === 'mascot') {
    return (
      <div className="auth-container">
        <div className="auth-card auth-card-wide">
          <h2>🚀 MTB Space Station</h2>
          <MascotPicker selected={selectedMascot} onSelect={setSelectedMascot} />
          {error && <p className="auth-error">{error}</p>}
          <button className="auth-btn" onClick={handleComplete} disabled={loading}>
            {loading ? 'Создание...' : 'Начать игру'}
          </button>
          <button className="auth-back" onClick={handleBack}>← Назад</button>
        </div>
      </div>
    )
  }

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