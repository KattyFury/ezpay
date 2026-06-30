import { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import NavBar from '../components/NavBar'
import BalanceHeader from '../components/BalanceHeader'
import Icon from '../components/Icon'
import NotifArea from '../components/NotifArea'
import { useNav } from '../nav'
import { getTokenBalances } from '../chain'
import { ensureWalletAddress } from '../circle'
import { t } from '../i18n'

export default function HomeReceive() {
  const { navigate } = useNav()
  const [copied, setCopied] = useState(false)
  const [totalVND, setTotalVND] = useState(0)
  const [walletAddr, setWalletAddr] = useState(localStorage.getItem('ez_wallet_addr') || '')
  const shortAddr = walletAddr ? walletAddr.slice(0, 6) + '...' + walletAddr.slice(-4) : '…'

  // Lấy lại địa chỉ ví nếu thiếu (tạo ví xong nhưng Circle provision chậm)
  useEffect(() => {
    if (walletAddr) return
    ensureWalletAddress().then(a => { if (a) setWalletAddr(a) })
  }, [])

  useEffect(() => {
    if (!walletAddr) return
    getTokenBalances(walletAddr).then(ts => setTotalVND(ts.reduce((s, t) => s + t.vnd, 0)))
  }, [walletAddr])

  async function handleShare() {
    if (navigator.share) {
      try { await navigator.share({ text: walletAddr }); return } catch {}
    }
    await navigator.clipboard.writeText(walletAddr)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function copyAddr() {
    navigator.clipboard.writeText(walletAddr)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="screen">
      <BalanceHeader totalVND={totalVND} loading={false} />

      <div className="row-3-5 center col" style={{ gap: 12 }}>
        <QRCodeSVG value={walletAddr || '0x'} size={200} level="M" />
        <button onClick={copyAddr} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          border: '1px solid var(--color-gray)', borderRadius: 8,
          padding: '6px 14px', background: 'none', cursor: 'pointer',
        }}>
          <span className="num" style={{ fontSize: 'var(--fs-body)', color: 'var(--color-content)' }}>{shortAddr}</span>
          <Icon name={copied ? 'check' : 'copy'} size={16} color={copied ? 'var(--color-primary)' : 'var(--color-content)'} />
        </button>
      </div>

      <div className="row-7-8" style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '2dvh' }}>
        <NotifArea fallback={
          <div style={{ width: '100%', background: 'var(--color-warning-soft)', borderRadius: 12, padding: '12px 14px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <Icon name="hint" size={18} color="var(--color-warning)" style={{ flexShrink: 0, marginTop: 2 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 'var(--fs-label)', textAlign: 'left', color: 'var(--color-content)' }}>
              <div><span style={{ fontWeight: 'var(--fw-semibold)' }}>{t('QR mặc định')}</span> – {t('Đây chính là địa chỉ ví của bạn')}</div>
              <div><span style={{ fontWeight: 'var(--fw-semibold)' }}>{t('Chia sẻ')}</span> – {t('Bấm để chia sẻ địa chỉ ví của bạn')}</div>
              <div><span style={{ fontWeight: 'var(--fw-semibold)' }}>{t('Tạo QR')}</span> – {t('Tạo mã QR nhận đúng số tiền bạn muốn')}</div>
              <div><span style={{ fontWeight: 'var(--fw-semibold)' }}>{t('Kho QR')}</span> – {t('Nơi bạn lưu trữ những QR hay dùng')}</div>
            </div>
          </div>
        } />
      </div>

      <div className="row-9 action-grid">
        <button className="action-card" onClick={handleShare}>
          <Icon name="share" size={22} />
          <span>{copied ? t('Đã copy!') : t('Chia sẻ')}</span>
        </button>
        <button className="action-card primary" onClick={() => navigate('CreateQR')}>
          <Icon name="qr" size={22} color="var(--color-white)" />
          <span>{t('Tạo QR')}</span>
        </button>
        <button className="action-card" onClick={() => navigate('SavedQRList')}>
          <Icon name="download" size={22} />
          <span>{t('Kho QR')}</span>
        </button>
      </div>

      <NavBar active="HomeReceive" />
    </div>
  )
}
