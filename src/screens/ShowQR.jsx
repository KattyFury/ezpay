import { useRef } from 'react'
import { useNav } from '../nav'
import { QRCodeCanvas } from 'qrcode.react'
import { fmtVND } from '../data'
import { saveImageToPhotos } from '../saveImage'
import { t } from '../i18n'
import { loadSavedQRs, saveSavedQRs } from '../store'

export default function ShowQR() {
  const { navigate, params } = useNav()
  const { amount, currency = 'VND', from } = params
  const walletAddr = localStorage.getItem('ez_wallet_addr') || ''
  const qrValue = `ezwallet:${walletAddr}?amount=${amount}&cur=${currency}`
  const amountText = currency === 'VND' ? fmtVND(amount) : `${amount} ${currency}`
  const wrapRef = useRef(null)

  // Từ CreateQR → "Lưu vào thư viện" (lưu vào kho QR)
  // Từ SavedQRList → "Lưu vào kho ảnh" (lưu ra Photos)
  const fromLibrary = from === 'SavedQRList'

  function saveToPhotos() {
    const canvas = wrapRef.current?.querySelector('canvas')
    if (!canvas) return
    saveImageToPhotos(canvas, `ezwallet-qr-${amount}.png`)
  }

  function saveToLibrary() {
    const list = loadSavedQRs()
    if (!list.some(q => q.amount === amount && (q.currency || 'VND') === currency)) {
      list.push({ id: Date.now(), amount, currency, createdAt: new Date().toISOString() })
      saveSavedQRs(list)
    }
    navigate('SavedQRList')
  }

  return (
    <div className="screen">
      <div className="row-1 center screen-title" style={{ fontSize: 'var(--fs-title)', fontWeight: 'var(--fw-medium)' }}>
        {t('Tạo QR nhận tiền')}
      </div>

      <div ref={wrapRef} className="row-3-6 center col" style={{ gap: 12 }}>
        <QRCodeCanvas value={qrValue} size={200} level="M" />
        <span className="num" style={{ fontSize: 'var(--fs-amount)', fontWeight: 'var(--fw-semibold)' }}>{amountText}</span>
        <span style={{ fontSize: 'var(--fs-label)', color: 'var(--color-muted)' }}>{t('Cho người gửi quét mã này')}</span>
      </div>

      <div className="row10-dual">
        {fromLibrary ? (
          <button className="btn btn-secondary" onClick={saveToPhotos}>{t('Lưu vào kho ảnh')}</button>
        ) : (
          <button className="btn btn-secondary" onClick={saveToLibrary}>{t('Lưu vào thư viện')}</button>
        )}
        <button className="btn btn-primary" onClick={() => navigate(from === 'SavedQRList' ? 'SavedQRList' : 'HomeReceive')}>{t('Quay lại')}</button>
      </div>
    </div>
  )
}
