import { useState, useEffect } from 'react'
import { useNav } from '../nav'
import Numpad from '../components/Numpad'

function WarningIcon() {
  return (
    <svg width="52" height="52" viewBox="0 0 24 24">
      <path d="M12 2L2 21h20L12 2z" fill="var(--color-warning)" />
      <path d="M12 9v5" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="17.5" r="1" fill="white" />
    </svg>
  )
}

function fmt(ms) {
  const s = Math.max(0, Math.floor(ms / 1000))
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

export default function PinLocked() {
  const { navigate } = useNav()
  const lockUntil = parseInt(localStorage.getItem('ez_locked_until') || '0')
  const [remaining, setRemaining] = useState(lockUntil - Date.now())

  useEffect(() => {
    const id = setInterval(() => {
      const rem = lockUntil - Date.now()
      setRemaining(rem)
      if (rem <= 0) {
        clearInterval(id)
        localStorage.removeItem('ez_locked_until')
        localStorage.removeItem('ez_attempts')
        navigate('EnterPin')
      }
    }, 1000)
    return () => clearInterval(id)
  }, [lockUntil])

  return (
    <div className="screen">
      <div className="row-1-5 center col" style={{ gap: 16 }}>
        <WarningIcon />
        <span style={{ fontSize: 'var(--fs-content)', fontWeight: 'var(--fw-bold)' }}>
          Nhập sai 4 lần
        </span>
        <span style={{ fontSize: 'var(--fs-amount)', fontWeight: 'var(--fw-bold)', color: 'var(--color-warning)' }}>
          {fmt(remaining)}
        </span>
        <span style={{ fontSize: 'var(--fs-label)', color: 'var(--color-gray)', textAlign: 'center' }}>
          Tài khoản tạm khóa. Vui lòng thử lại sau.
        </span>
      </div>

      <div className="row-7-9">
        <Numpad onKey={() => {}} showComma={false} disabled />
      </div>

      <div className="row-10 center">
        <button
          style={{ background: 'none', border: 'none', fontSize: 'var(--fs-label)', color: 'var(--color-primary)', cursor: 'pointer', textDecoration: 'underline' }}
          onClick={() => navigate('ForgotPin')}
        >
          Quên PIN?
        </button>
      </div>
    </div>
  )
}
