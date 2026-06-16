import { useState } from 'react'
import { useNav } from '../nav'
import Numpad from '../components/Numpad'
import PinDots from '../components/PinDots'

export default function CreatePin() {
  const { navigate } = useNav()
  const [step, setStep] = useState('create')
  const [firstPin, setFirstPin] = useState('')
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)

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

    if (step === 'create') {
      setTimeout(() => {
        setFirstPin(next)
        setInput('')
        setStep('confirm')
      }, 150)
    } else {
      if (next === firstPin) {
        localStorage.setItem('ez_pin', next)
        setTimeout(() => navigate('Recovery'), 150)
      } else {
        setError(true)
        setTimeout(() => {
          setError(false)
          setInput('')
        }, 700)
      }
    }
  }

  return (
    <div className="screen">
      <div className="row-1-5 center col" style={{ gap: 24 }}>
        <div className="col center" style={{ gap: 8 }}>
          <span style={{ fontSize: 'var(--fs-content)', fontWeight: 'var(--fw-bold)' }}>
            {step === 'create' ? 'Tạo PIN 4 số' : 'Xác nhận PIN 4 số'}
          </span>
          <span style={{ fontSize: 'var(--fs-label)', color: 'var(--color-gray)' }}>
            {step === 'create' ? 'PIN dùng để xác thực giao dịch' : 'Nhập lại PIN vừa tạo'}
          </span>
          {error && (
            <span style={{ fontSize: 'var(--fs-label)', color: 'var(--color-error)' }}>
              PIN không khớp, thử lại
            </span>
          )}
        </div>
        <PinDots filled={input.length} error={error} />
      </div>

      <div className="row-7-9">
        <Numpad onKey={handleKey} showComma={false} />
      </div>

      <div className="row-10 center">
        <span style={{ fontSize: 'var(--fs-label)', color: 'var(--color-gray)' }}>
          Tự chuyển khi đủ 4 số
        </span>
      </div>
    </div>
  )
}
