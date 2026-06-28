import { useState, useEffect } from 'react'
import { useNav } from '../nav'
import Numpad from '../components/Numpad'
import PinDots from '../components/PinDots'
import pfp from '../../design/pfp.svg'

const MAX_ATTEMPTS = 4

export default function EnterPin() {
  const { navigate, params } = useNav()
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)

  useEffect(() => {
    const lockUntil = parseInt(localStorage.getItem('ez_locked_until') || '0')
    if (lockUntil > Date.now()) navigate('PinLocked')
  }, [])

  function handleKey(key) {
    if (error) return
    if (key === 'BACK') {
      setInput(p => p.slice(0, -1))
      return
    }
    if (input.length >= 4) return

    const next = input + key
    setInput(next)

    if (next.length < 4) return

    const saved = localStorage.getItem('ez_pin')
    if (next === saved) {
      localStorage.removeItem('ez_attempts')
      const dest = params?.onSuccess || 'HomeSend'
      const destParams = params?.onSuccessParams || {}
      setTimeout(() => navigate(dest, destParams), 150)
    } else {
      const attempts = parseInt(localStorage.getItem('ez_attempts') || '0') + 1
      localStorage.setItem('ez_attempts', String(attempts))
      setError(true)
      setTimeout(() => {
        if (attempts >= MAX_ATTEMPTS) {
          const lockUntil = Date.now() + 30 * 60 * 1000
          localStorage.setItem('ez_locked_until', String(lockUntil))
          navigate('PinLocked')
        } else {
          setError(false)
          setInput('')
        }
      }, 600)
    }
  }

  const attempts = parseInt(localStorage.getItem('ez_attempts') || '0')

  return (
    <div className="screen">
      <div className="row-1-5 center col" style={{ gap: 24 }}>
        <img src={pfp} alt="ezwallet" style={{ width: 72, height: 72 }} />
        <div className="col center" style={{ gap: 8 }}>
          <span style={{ fontSize: 'var(--fs-content)', fontWeight: 'var(--fw-bold)' }}>
            Nhập PIN
          </span>
          {error && attempts < MAX_ATTEMPTS && (
            <span style={{ fontSize: 'var(--fs-label)', color: 'var(--color-error)' }}>
              Sai PIN · còn {MAX_ATTEMPTS - attempts} lần
            </span>
          )}
        </div>
        <PinDots filled={input.length} error={error} />
      </div>

      <div className="row-7-9">
        <Numpad onKey={handleKey} showComma={false} />
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
