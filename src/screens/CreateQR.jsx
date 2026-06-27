import { useState } from 'react'
import { useNav } from '../nav'
import Numpad from '../components/Numpad'

function fmtNum(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

export default function CreateQR() {
  const { navigate } = useNav()
  const [digits, setDigits] = useState('')

  const amount = parseInt(digits || '0')

  function handleKey(key) {
    if (key === 'BACK') { setDigits(d => d.slice(0, -1)); return }
    if (key === ',') return
    if (digits.length >= 12) return
    if (digits === '0') { setDigits(key); return }
    setDigits(d => d + key)
  }

  return (
    <div className="screen">
      <div className="row-1 center screen-title" style={{ fontSize: 'var(--fs-title)', fontWeight: 'var(--fw-bold)' }}>
        Custom QR
      </div>

      <div className="row-2 center">
        <span style={{ fontSize: 'var(--fs-body)', color: 'var(--color-muted)' }}>Số tiền muốn nhận</span>
      </div>

      <div className="row-3-4 center col">
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 10 }}>
          <span className="num" style={{ fontSize: 'var(--fs-amount)', fontWeight: 'var(--fw-bold)', lineHeight: 1, color: digits ? 'var(--color-content)' : 'var(--color-faint)' }}>
            {fmtNum(amount)}
          </span>
          <span className="num" style={{ fontSize: 'var(--fs-body)', color: 'var(--color-muted)' }}>VND</span>
        </div>
      </div>

      {/* Numpad 2.5 hàng + nút ở ranh giới 9/10 — đồng bộ màn Gửi tiền */}
      <div style={{ gridRow: '7 / 11', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 2.5, minHeight: 0 }}>
          <Numpad onKey={handleKey} showComma={false} />
        </div>
        <div style={{ flex: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <button className="btn btn-secondary" style={{ width: '44%' }} onClick={() => navigate('HomeReceive')}>Hủy</button>
          <button className="btn btn-primary" style={{ width: '44%' }} disabled={amount <= 0}
            onClick={() => navigate('ShowQR', { amount })}>
            Tạo QR
          </button>
        </div>
      </div>
    </div>
  )
}
