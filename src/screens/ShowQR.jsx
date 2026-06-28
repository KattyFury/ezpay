import { useRef, useEffect } from 'react'
import { useNav } from '../nav'
import { QRCodeCanvas } from 'qrcode.react'
import { fmtVND } from '../data'

function savedQRs() {
  try { return JSON.parse(localStorage.getItem('ez_saved_qrs') || '[]') } catch { return [] }
}

export default function ShowQR() {
  const { navigate, params } = useNav()
  const { amount } = params
  const walletAddr = localStorage.getItem('ez_wallet_addr') || ''
  const qrValue = `ezwallet:${walletAddr}?amount=${amount}`
  const wrapRef = useRef(null)

  // Tự lưu vào Kho QR (nếu chưa có)
  useEffect(() => {
    const list = savedQRs()
    if (!list.some(q => q.amount === amount)) {
      list.push({ id: Date.now(), amount, createdAt: new Date().toISOString() })
      localStorage.setItem('ez_saved_qrs', JSON.stringify(list))
    }
  }, [amount])

  function saveToPhotos() {
    const canvas = wrapRef.current?.querySelector('canvas')
    if (!canvas) return
    const a = document.createElement('a')
    a.href = canvas.toDataURL('image/png')
    a.download = `ezwallet-qr-${amount}.png`
    a.click()
  }

  return (
    <div className="screen">
      <div className="row-1 center screen-title" style={{ fontSize: 'var(--fs-title)', fontWeight: 'var(--fw-medium)' }}>
        Custom QR
      </div>

      <div ref={wrapRef} className="row-3-6 center col" style={{ gap: 12 }}>
        <QRCodeCanvas value={qrValue} size={200} level="M" />
        <span className="num" style={{ fontSize: 'var(--fs-amount)', fontWeight: 'var(--fw-bold)' }}>{fmtVND(amount)}</span>
        <span style={{ fontSize: 'var(--fs-label)', color: 'var(--color-muted)' }}>Cho người gửi quét mã này</span>
      </div>

      <div className="row10-dual">
        <button className="btn btn-secondary" onClick={saveToPhotos}>Lưu vào kho ảnh</button>
        <button className="btn btn-primary" onClick={() => navigate(params.from || 'HomeReceive')}>Quay lại</button>
      </div>
    </div>
  )
}
