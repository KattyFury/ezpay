import { useState } from 'react'
import { useNav } from '../nav'
import { t } from '../i18n'

function isValid(addr) { return /^0x[0-9a-fA-F]{40}$/.test(addr.trim()) }

export default function PasteAddress() {
  const { navigate } = useNav()
  const [address, setAddress] = useState('')
  const [dirty, setDirty] = useState(false)

  const trimmed = address.trim()
  const valid = isValid(trimmed)
  const showError = dirty && address && !valid

  function handleDan() {
    if (isValid(trimmed)) navigate('SendAmount', { address: trimmed, name: null })
    else setDirty(true)
  }

  return (
    <div className="screen">
      <div className="row-1 center screen-title" style={{ fontSize: 'var(--fs-title)', fontWeight: 'var(--fw-medium)' }}>
        {t('Dán địa chỉ để gửi')}
      </div>

      <div className="row-3" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8 }}>
        <input
          className={`address-input${showError ? ' error' : ''}`}
          placeholder="0x..."
          value={address}
          onChange={e => { setAddress(e.target.value); setDirty(true) }}
          autoFocus
          style={{ width: '100%', height: 48, fontSize: 'var(--fs-body)' }}
        />
        {showError && (
          <span style={{ fontSize: 'var(--fs-label)', color: 'var(--color-error)' }}>
            {t('Địa chỉ không hợp lệ — bắt đầu bằng 0x, 42 ký tự')}
          </span>
        )}
      </div>

      <div className="row-10 row10-dual">
        <button className="btn btn-secondary" onClick={() => navigate('HomeSend')}>{t('Quay lại')}</button>
        <button className="btn btn-primary" disabled={!valid} onClick={handleDan}>{t('Tiếp tục')}</button>
      </div>
    </div>
  )
}
