import { useState } from 'react'
import { useNav } from '../nav'
import Numpad from '../components/Numpad'
import { fmtVND, MOCK_VND } from '../data'

function shortenAddr(addr) {
  return addr ? addr.slice(0, 6) + '…' + addr.slice(-4) : ''
}

export default function SendAmount() {
  const { navigate, params } = useNav()
  const { address, name } = params
  const [digits, setDigits] = useState(() => params.amount ? String(params.amount) : '')
  const [memo, setMemo] = useState(params.memo || '')

  const amount = parseInt(digits || '0')
  const overBalance = amount > MOCK_VND
  const canContinue = amount > 0 && !overBalance

  function handleKey(key) {
    if (key === 'BACK') { setDigits(d => d.slice(0, -1)); return }
    if (key === ',') return
    if (digits.length >= 10) return
    if (digits === '0') { setDigits(key); return }
    setDigits(d => d + key)
  }

  return (
    <div className="screen">
      <div className="row-1 center" style={{ fontSize: 'var(--fs-title)', fontWeight: 'var(--fw-bold)' }}>
        Gửi tiền
      </div>

      <div className="row-2 center" style={{ gap: 6 }}>
        <span style={{ fontSize: 'var(--fs-body)', color: 'var(--color-muted)' }}>Gửi cho:</span>
        <span style={{ fontSize: 'var(--fs-body)', fontWeight: 'var(--fw-medium)' }}>
          {name || shortenAddr(address)}
        </span>
      </div>

      <div className="row-3-4 center col" style={{ gap: 6 }}>
        <div style={{ fontSize: 40, fontWeight: 'var(--fw-bold)', lineHeight: 1, textAlign: 'center', color: overBalance ? 'var(--color-error)' : digits ? 'var(--color-black)' : 'var(--color-gray)' }}>
          {digits ? fmtVND(amount) : '0 ₫'}
        </div>
        {overBalance && (
          <span style={{ fontSize: 'var(--fs-label)', color: 'var(--color-error)', textAlign: 'center' }}>
            Số dư không đủ (khả dụng: {fmtVND(MOCK_VND)})
          </span>
        )}
      </div>

      <div className="row-5 center">
        <div className="memo-row" style={{ width: '100%' }}>
          <span style={{ fontSize: 'var(--fs-label)', color: 'var(--color-muted)', flexShrink: 0 }}>
            Nội dung:
          </span>
          <input
            className="memo-input"
            placeholder="Nhập nội dung (tuỳ chọn)"
            value={memo}
            onChange={e => setMemo(e.target.value)}
            maxLength={100}
          />
        </div>
      </div>

      <div className="row-7-9">
        <Numpad onKey={handleKey} showComma={false} />
      </div>

      <div className="row-10" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <button className="btn btn-secondary" style={{ width: '44%' }} onClick={() => navigate('HomeSend')}>Quay lại</button>
        <button className="btn btn-primary" style={{ width: '44%' }} disabled={!canContinue}
          onClick={() => navigate('SendConfirm', { address, name, amount, memo })}
        >
          Tiếp tục
        </button>
      </div>
    </div>
  )
}
