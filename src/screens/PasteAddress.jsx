import { useState } from 'react'
import { useNav } from '../nav'

function isValid(addr) { return /^0x[0-9a-fA-F]{40}$/.test(addr.trim()) }

export default function PasteAddress() {
  const { navigate } = useNav()
  const [address, setAddress] = useState('')
  const [dirty, setDirty] = useState(false)

  const trimmed = address.trim()
  const valid = isValid(trimmed)
  const showError = dirty && address && !valid

  // Nút "Dán": nếu ô chưa có địa chỉ hợp lệ → dán từ clipboard; rồi nếu hợp lệ thì đi tiếp
  async function handleDan() {
    let addr = trimmed
    if (!isValid(addr)) {
      try { const t = await navigator.clipboard.readText(); if (t) { addr = t.trim(); setAddress(addr); setDirty(true) } } catch {}
    }
    if (isValid(addr)) navigate('SendAmount', { address: addr, name: null })
    else setDirty(true)
  }

  return (
    <div className="screen">
      <div className="row-1 center screen-title" style={{ fontSize: 'var(--fs-title)', fontWeight: 'var(--fw-medium)' }}>
        Dán địa chỉ để gửi
      </div>

      <div className="row-3" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8 }}>
        <input
          className={`address-input${showError ? ' error' : ''}`}
          placeholder="0x..."
          value={address}
          onChange={e => { setAddress(e.target.value); setDirty(true) }}
          style={{ width: '100%', height: 48, fontSize: 'var(--fs-body)' }}
        />
        {showError && (
          <span style={{ fontSize: 'var(--fs-label)', color: 'var(--color-error)' }}>
            Địa chỉ không hợp lệ — bắt đầu bằng 0x, 42 ký tự
          </span>
        )}
      </div>

      <div className="row-10 row10-dual">
        <button className="btn btn-secondary" onClick={() => navigate('HomeSend')}>Quay lại</button>
        <button className="btn btn-primary" onClick={handleDan}>Dán</button>
      </div>
    </div>
  )
}
