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
      <div className="row-1 center" style={{ fontSize: 'var(--fs-title)', fontWeight: 'var(--fw-bold)' }}>
        Dán địa chỉ
      </div>

      <div className="row-2-8" style={{ gap: 12, width: '100%' }}>
        <textarea
          className={`address-input${showError ? ' error' : ''}`}
          placeholder="0x..."
          value={address}
          onChange={e => { setAddress(e.target.value); setDirty(true) }}
          rows={3}
          style={{ fontSize: 'var(--fs-body)', resize: 'none', width: '100%' }}
        />
        {showError && (
          <span style={{ fontSize: 'var(--fs-label)', color: 'var(--color-error)', alignSelf: 'flex-start' }}>
            Địa chỉ không hợp lệ — bắt đầu bằng 0x, 42 ký tự
          </span>
        )}
        <button className="btn btn-secondary" style={{ width: '100%' }} onClick={handlePaste}>
          Dán từ clipboard
        </button>
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
