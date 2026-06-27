import { useNav } from '../nav'
import { QRCodeSVG } from 'qrcode.react'
import { fmtVND } from '../data'

function savedQRs() {
  try { return JSON.parse(localStorage.getItem('ez_saved_qrs') || '[]') } catch { return [] }
}

export default function ShowQR() {
  const { navigate, params } = useNav()
  const { amount } = params
  const walletAddr = localStorage.getItem('ez_wallet_addr') || ''
  const qrValue = `ezwallet:${walletAddr}?amount=${amount}`

  function handleSave() {
    const list = savedQRs()
    list.push({ id: Date.now(), amount, createdAt: new Date().toISOString() })
    localStorage.setItem('ez_saved_qrs', JSON.stringify(list))
    navigate('SavedQRList')
  }

  return (
    <div className="screen">
      <div className="row-1 center screen-title" style={{ fontSize: 'var(--fs-title)', fontWeight: 'var(--fw-bold)' }}>
        Custom QR
      </div>

      <div className="row-2-5 center col" style={{ gap: 12 }}>
        <QRCodeSVG value={qrValue} size={160} level="M" />
        <span className="num" style={{ fontSize: 'var(--fs-amount)', fontWeight: 'var(--fw-bold)' }}>
          {fmtVND(amount)}
        </span>
        <span style={{ fontSize: 'var(--fs-label)', color: 'var(--color-muted)' }}>
          Cho người gửi quét mã này
        </span>
      </div>

      <div className="row-10 row10-dual">
        <button className="btn btn-secondary" onClick={() => navigate('HomeReceive')}>Đóng</button>
        <button className="btn btn-primary" onClick={handleSave}>Lưu QR này</button>
      </div>
    </div>
  )
}
