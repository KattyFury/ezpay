import { useState, useEffect } from 'react'
import NavBar from '../components/NavBar'
import hintIcon from '../../icon/hint.png'
import danhbaIcon from '../../icon/danhba.png'
import qrIcon from '../../icon/qr.png'
import qrWhiteIcon from '../../icon/qr-white.png'
import { useNav } from '../nav'
import { fmtVND } from '../data'
import { getTokenBalances, fmtAmount } from '../chain'
import { IconPaste } from '../icons'

export default function HomeSend() {
  const { navigate } = useNav()
  const [tokens, setTokens] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const addr = localStorage.getItem('ez_wallet_addr')
    if (!addr) { setLoading(false); return }
    getTokenBalances(addr)
      .then(setTokens)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const totalVND = tokens.reduce((s, t) => s + t.vnd, 0)

  return (
    <div className="screen">
      <div className="row-1 center full-bleed" style={{ borderBottom: '1px solid var(--color-gray)', gap: 6 }}>
        <span style={{ fontSize: 18, color: 'var(--color-muted)' }}>Số dư</span>
        <span style={{ fontSize: 36, fontWeight: 'var(--fw-bold)', color: 'var(--color-black)', lineHeight: 1 }}>
          {loading ? '...' : totalVND.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
        </span>
        <span style={{ fontSize: 18, color: 'var(--color-muted)' }}>VND</span>
      </div>

      <div className="row-2-5" style={{ display: 'grid', gridTemplateRows: 'repeat(4, 1fr)', overflowY: 'auto' }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-muted)', fontSize: 'var(--fs-label)' }}>Đang tải...</div>
        ) : tokens.length === 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-muted)', fontSize: 'var(--fs-label)' }}>
            {localStorage.getItem('ez_wallet_addr') ? 'Chưa có token' : 'Ví chưa được tạo — nạp USDC để kích hoạt'}
          </div>
        ) : tokens.map(t => (
          <div key={t.symbol} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 2px' }}>
            <div className="token-icon" style={{ background: t.color, flexShrink: 0 }}>{t.symbol.slice(0, 2)}</div>
            <span style={{ fontSize: 'var(--fs-item)', fontWeight: 'var(--fw-medium)' }}>
              {t.amount.toFixed(t.symbol === 'cirBTC' ? 4 : 2)} {t.symbol}
            </span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="#2775CA" style={{ flexShrink: 0 }}>
              <path d="M12 2l2.4 1.8 3 .2.9 2.9 2.4 1.8-.9 2.9.9 2.9-2.4 1.8-.9 2.9-3 .2L12 22l-2.4-1.8-3-.2-.9-2.9L3.3 15l.9-2.9-.9-2.9 2.4-1.8.9-2.9 3-.2L12 2z"/>
              <path d="M10.5 14.6l-2-2 1-1 1 1 3-3 1 1z" fill="#fff"/>
            </svg>
            <span style={{ marginLeft: 'auto', fontSize: 'var(--fs-item)', fontWeight: 'var(--fw-medium)' }}>{fmtVND(t.vnd)}</span>
          </div>
        ))}
      </div>

      <div className="row-7-8" style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '2dvh' }}>
        {!loading && (tokens.find(t => t.symbol === 'USDC')?.amount ?? 0) <= 1 ? (
          <div className="tip-box" style={{ borderColor: 'var(--color-warning)', color: 'var(--color-warning)' }}>
            <img src={hintIcon} alt='' style={{ width: 16, height: 16, marginRight: 6 }} />Hết USDC — cần USDC để thanh toán phí giao dịch. Vào <b>Đổi tiền</b> để swap.
          </div>
        ) : (
          <div className="tip-box" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 4, textAlign: 'left', padding: '10px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
              <img src={hintIcon} alt='' style={{ width: 16, height: 16 }} />
              <b>Cách gửi tiền:</b>
            </div>
            <div><b>Danh bạ</b> — lưu địa chỉ ví quen thuộc để gửi nhanh</div>
            <div><b>Quét QR</b> — quét mã người nhận để chuyển tiền tiện lợi</div>
            <div><b>Dán để gửi</b> — dán địa chỉ ví người khác đưa cho bạn</div>
          </div>
        )}
      </div>

      <div className="row-9 action-grid">
        <button className="action-card" onClick={() => navigate('Contacts')}><img src={danhbaIcon} alt="" style={{ width: 20, height: 20 }} /><span>Danh bạ</span></button>
        <button className="action-card primary" onClick={() => navigate('QRScanner')}><img src={qrWhiteIcon} alt="" style={{ width: 24, height: 24 }} /><span>Quét QR</span></button>
        <button className="action-card" onClick={() => navigate('PasteAddress')}><IconPaste size={20} /><span>Dán để gửi</span></button>
      </div>

      <NavBar active="HomeSend" />
    </div>
  )
}
