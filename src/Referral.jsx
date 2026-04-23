import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import './Referral.css'

function Referral({ dbUserId, onClose }) {
  const [referralCode, setReferralCode] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!dbUserId || dbUserId === 'local') return
    
    const loadCode = async () => {
      const { data } = await supabase
        .from('users')
        .select('referral_code')
        .eq('id', dbUserId)
        .single()
      
      if (data?.referral_code) {
        setReferralCode(data.referral_code)
      }
    }
    loadCode()
  }, [dbUserId])

  const referralLink = `https://mtb-space.vercel.app/?ref=${referralCode}`

  const copyLink = () => {
    navigator.clipboard.writeText(referralCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="referral">
      <h3>👥 Пригласи друга</h3>
      <p>Ты и друг получите <strong>+500 ⭐</strong> после его регистрации</p>
      <div className="referral-code">
        <span>Твой код:</span>
        <strong>{referralCode}</strong>
      </div>
      <button className="referral-copy-btn" onClick={copyLink}>
        {copied ? '✅ Скопировано!' : '📋 Скопировать код'}
      </button>
      <p className="referral-hint">Отправь код другу — он введёт его при регистрации</p>
    </div>
  )
}

export default Referral