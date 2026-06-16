import { QRCodeSVG } from 'qrcode.react'
import NavBar from '../components/NavBar'
import { MOCK_VND, MOCK_ADDR, fmtVND } from '../data'
import { IconShare, IconScan, IconQRSaved } from '../icons'

export default function HomeReceive() {
  const shortAddr = MOCK_ADDR.slice(0, 6) + '...' + MOCK_ADDR.slice(-4)

  return (
    <div className="screen">
      {/* Rows 1–2: balance */}
      <div className="row-1-2 col">
        <div style={{ flex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: 4 }}>
          <span style={{ fontSize: 'var(--fs-label)', color: 'var(--color-gray)' }}>Số dư khả dụng</span>
          <span style={{ fontSize: 'var(--fs-amount)', fontWeight: 'var(--fw-bold)' }}>{fmtVND(MOCK_VND)}</span>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: 'var(--fs-label)', color: 'var(--color-gray)' }}>
            Số dư thực tế: {fmtVND(MOCK_VND)}
          </span>
        </div>
      </div>

      {/* Rows 3–5: QR code */}
      <div className="row-3-5 center col" style={{ gap: 8 }}>
        <QRCodeSVG value={MOCK_ADDR} size={130} level="M" />
        <span style={{ fontSize: 'var(--fs-label)', color: 'var(--color-gray)' }}>
          {shortAddr} · địa chỉ ví của bạn
        </span>
      </div>

      {/* Rows 6–7: tip */}
      <div className="row-6-7" style={{ padding: '6px 0' }}>
        <div className="tip-box">Cho người gửi quét QR này để nhận tiền trực tiếp</div>
      </div>

      {/* Rows 8–9: action buttons */}
      <div className="row-8-9 action-grid">
        <button className="action-card">
          <IconShare size={20} />
          <span>Chia sẻ</span>
        </button>
        <button className="action-card primary">
          <IconScan size={26} />
          <span>Custom QR</span>
        </button>
        <button className="action-card">
          <IconQRSaved size={20} />
          <span>QR đã lưu</span>
        </button>
      </div>

      <NavBar active="HomeReceive" />
    </div>
  )
}
