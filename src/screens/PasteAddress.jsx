import { useState } from 'react'
import { useNav } from '../nav'

function isValidAddress(addr) {
  return /^0x[0-9a-fA-F]{40}$/.test(addr.trim())
}

export default function PasteAddress() {
  const { navigate } = useNav()
  const [address, setAddress] = useState('')
  const [dirty, setDirty] = useState(false)

  const trimmed = address.trim()
  const valid = isValidAddress(trimmed)
  const showError = dirty && address && !valid

  async function handlePaste() {
    try {
      const text = await navigator.clipboard.readText()
      setAddress(text)
      setDirty(true)
    } catch {
      // clipboard denied — user types manually
    }
  }

  return (
    <div className="screen">
      <div className="row-1 center send-title">
        <button className="back-btn" onClick={() => navigate('HomeSend')}>‹</button>
        <span>Dán địa chỉ</span>
      </div>

      <div className="row-2-5 col" style={{ justifyContent: 'center', gap: 10 }}>
        <span style={{ fontSize: 'var(--fs-label)', color: 'var(--color-gray)' }}>
          Địa chỉ ví người nhận
        </span>
        <textarea
          className={`address-input${showError ? ' error' : ''}`}
          placeholder="0x…"
          value={address}
          onChange={e => { setAddress(e.target.value); setDirty(true) }}
          rows={3}
        />
        {showError ? (
          <div className="col" style={{ gap: 3 }}>
            <span style={{ fontSize: 'var(--fs-label)', color: 'var(--color-error)' }}>
              Địa chỉ không hợp lệ
            </span>
            <span style={{ fontSize: 'var(--fs-label)', color: 'var(--color-gray)' }}>
              Địa chỉ Arc bắt đầu bằng 0x và có 42 ký tự
            </span>
          </div>
        ) : null}
        <button className="btn btn-secondary" style={{ alignSelf: 'flex-start', height: 36, fontSize: 'var(--fs-label)' }} onClick={handlePaste}>
          Dán từ clipboard
        </button>
      </div>

      <div className="row-10 row10-dual">
        <button className="btn btn-secondary" onClick={() => navigate('HomeSend')}>Quay lại</button>
        <button className="btn btn-primary" disabled={!valid} onClick={() => navigate('SendAmount', { address: trimmed, name: null })}>
          Tiếp tục
        </button>
      </div>
    </div>
  )
}
