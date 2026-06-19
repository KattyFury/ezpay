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
      <div className="row-1 center send-title">
        <button className="back-btn" onClick={() => navigate('HomeSend')}>‹</button>
        <span>Gửi tiền</span>
      </div>

      <div className="row-2-5 col" style={{ justifyContent: 'center', gap: 10 }}>
        <div className="recipient-box">
          <div className="recipient-avatar">
            {(name || address || '?').slice(0, 2).toUpperCase()}
          </div>
          <div className="col" style={{ gap: 2 }}>
            {name && (
              <span style={{ fontSize: 'var(--fs-item)', fontWeight: 'var(--fw-medium)' }}>{name}</span>
            )}
            <span style={{ fontSize: name ? 'var(--fs-sub)' : 'var(--fs-item)', fontWeight: 'var(--fw-medium)', color: name ? 'var(--color-gray)' : 'var(--color-black)' }}>
              {shortenAddr(address)}
            </span>
          </div>
        </div>

        <div className="amount-display" style={{ color: overBalance ? 'var(--color-error)' : 'var(--color-black)' }}>
          {digits ? fmtVND(amount) : <span style={{ color: 'var(--color-gray)' }}>0 ₫</span>}
        </div>
        {overBalance && (
          <span style={{ fontSize: 'var(--fs-label)', color: 'var(--color-error)', textAlign: 'center' }}>
            Số dư không đủ (khả dụng: {fmtVND(MOCK_VND)})
          </span>
        )}

        <div className="memo-row">
          <span style={{ fontSize: 'var(--fs-label)', color: 'var(--color-gray)', flexShrink: 0 }}>
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

      <div className="row-10 row10-dual">
        <button className="btn btn-secondary" onClick={() => navigate('HomeSend')}>Quay lại</button>
        <button className="btn btn-primary" disabled={!canContinue}
          onClick={() => navigate('SendConfirm', { address, name, amount, memo })}
        >
          Tiếp tục
        </button>
      </div>
    </div>
  )
}
