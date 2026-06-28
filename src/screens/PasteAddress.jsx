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

  async function handlePaste() {
    try { const t = await navigator.clipboard.readText(); setAddress(t); setDirty(true) } catch {}
  }

  return (
    <div className="screen">
      <div className="row-1 center screen-title" style={{ fontSize: 'var(--fs-title)', fontWeight: 'var(--fw-medium)' }}>
        Dán địa chỉ
      </div>

      <div className="row-3" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            className={`address-input${showError ? ' error' : ''}`}
            placeholder="0x..."
            value={address}
            onChange={e => { setAddress(e.target.value); setDirty(true) }}
            style={{ flex: 1, height: 48, fontSize: 'var(--fs-body)' }}
          />
          <button className="btn btn-secondary" style={{ width: 'auto', padding: '0 20px', height: 48 }} onClick={handlePaste}>
            Dán
          </button>
        </div>
        {showError && (
          <span style={{ fontSize: 'var(--fs-label)', color: 'var(--color-error)' }}>
            Địa chỉ không hợp lệ — bắt đầu bằng 0x, 42 ký tự
          </span>
        )}
      </div>

      <div className="row-10 row10-dual">
        <button className="btn btn-secondary" onClick={() => navigate('HomeSend')}>Quay lại</button>
        <button className="btn btn-primary" disabled={!valid}
          onClick={() => navigate('SendAmount', { address: trimmed, name: null })}>
          Tiếp tục
        </button>
      </div>
    </div>
  )
}
