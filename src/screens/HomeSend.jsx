import { useState, useEffect } from 'react'
import NavBar from '../components/NavBar'
import BalanceHeader from '../components/BalanceHeader'
import Icon from '../components/Icon'
import { useNav } from '../nav'
import { fmtVND } from '../data'
import { getTokenBalances, fmtAmount } from '../chain'

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
      <BalanceHeader totalVND={totalVND} loading={loading} />

      <div className="row-3-5" style={{ display: 'grid', gridTemplateRows: 'repeat(3, 1fr)', overflowY: 'auto' }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', color: 'var(--color-muted)', fontSize: 'var(--fs-body)', padding: '0 2px' }}>Đang tải...</div>
        ) : tokens.length === 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', color: 'var(--color-muted)', fontSize: 'var(--fs-body)', padding: '0 2px' }}>
            {localStorage.getItem('ez_wallet_addr') ? 'Chưa có token' : 'Ví chưa được tạo — nạp USDC để kích hoạt'}
          </div>
        ) : tokens.map(t => (
          <div key={t.symbol} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 2px' }}>
            <img
              src={`/tokens/${t.symbol.toLowerCase()}.png`}
              alt=""
              style={{ width: 34, height: 34, borderRadius: '50%', flexShrink: 0 }}
              onError={e => {
                e.target.style.display = 'none'
                e.target.nextSibling.style.display = 'flex'
              }}
            />
            <div className="token-icon" style={{ background: t.color, flexShrink: 0, display: 'none' }}>{t.symbol.slice(0, 2)}</div>
            <span className="num" style={{ fontSize: 'var(--fs-num)', fontWeight: 'var(--fw-semibold)' }}>
              {t.amount.toFixed(t.symbol === 'cirBTC' ? 4 : 2)} {t.symbol}
            </span>
            <Icon name="check" size={20} color="var(--color-primary)" />
            <span className="num" style={{ marginLeft: 'auto', fontSize: 'var(--fs-num)', fontWeight: 'var(--fw-normal)' }}>{fmtVND(t.vnd)}</span>
          </div>
        ))}
      </div>

      <div className="row-7-8" style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '2dvh' }}>
        {!loading && (tokens.find(t => t.symbol === 'USDC')?.amount ?? 0) <= 1 ? (
          <div className="tip-box" style={{ borderColor: 'var(--color-warning)', color: 'var(--color-warning)' }}>
            <Icon name="hint" size={16} color="var(--color-warning)" style={{ marginRight: 6 }} />Hết USDC — cần USDC để thanh toán phí giao dịch. Vào <b>Đổi tiền</b> để swap.
          </div>
        ) : (
          <div className="tip-box" style={{ flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', gap: 8, textAlign: 'left', padding: '12px 16px' }}>
            <div><span style={{ color: 'var(--color-content)' }}>Danh bạ</span> <span style={{ color: 'var(--color-muted)' }}>– Nơi bạn lưu địa chỉ ví của người quen</span></div>
            <div><span style={{ color: 'var(--color-content)' }}>Quét QR</span> <span style={{ color: 'var(--color-muted)' }}>– Bấm để quét mã QR của người nhận</span></div>
            <div><span style={{ color: 'var(--color-content)' }}>Dán để gửi</span> <span style={{ color: 'var(--color-muted)' }}>– Bấm để dán địa chỉ ví của người nhận</span></div>
          </div>
        )}
      </div>

      <div className="row-9 action-grid">
        <button className="action-card" onClick={() => navigate('Contacts')}><Icon name="human" size={22} /><span>Danh bạ</span></button>
        <button className="action-card primary" onClick={() => navigate('QRScanner')}><Icon name="scan" size={22} color="var(--color-white)" /><span>Quét QR</span></button>
        <button className="action-card" onClick={() => navigate('PasteAddress')}><Icon name="copy" size={22} /><span>Dán để gửi</span></button>
      </div>

      <NavBar active="HomeSend" />
    </div>
  )
}
