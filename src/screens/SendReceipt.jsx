import { useNav } from '../nav'
import { fmtVND } from '../data'

function CheckIcon() {
  return (
    <svg width="52" height="52" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="11" fill="var(--color-primary)" />
      <path d="M7 12l4 4 6-6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function shortenAddr(addr) {
  return addr ? addr.slice(0, 6) + '…' + addr.slice(-4) : ''
}

function fmtTime(ts) {
  return new Date(ts).toLocaleString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function SendReceipt() {
  const { navigate, params } = useNav()
  const { address, name, amount, memo, timestamp } = params

  return (
    <div className="screen">
      <div className="row-1 center">
        <span style={{ fontSize: 'var(--fs-content)', fontWeight: 'var(--fw-bold)' }}>Biên lai</span>
      </div>

      <div className="row-2-5 col center" style={{ gap: 10 }}>
        <CheckIcon />
        <span style={{ fontSize: 'var(--fs-content)', fontWeight: 'var(--fw-bold)' }}>Đã gửi thành công</span>
        <span className="num" style={{ fontSize: 28, fontWeight: 'var(--fw-bold)', color: 'var(--color-primary)' }}>
          {fmtVND(amount)}
        </span>
        <div className="confirm-box" style={{ width: '100%' }}>
          <div className="confirm-row">
            <span className="confirm-label">Gửi đến</span>
            <span className="confirm-value">{name || shortenAddr(address)}</span>
          </div>
          {memo ? (
            <div className="confirm-row">
              <span className="confirm-label">Nội dung</span>
              <span className="confirm-value">{memo}</span>
            </div>
          ) : null}
          <div className="confirm-row">
            <span className="confirm-label">Thời gian</span>
            <span className="confirm-value" style={{ fontSize: 'var(--fs-label)' }}>{fmtTime(timestamp)}</span>
          </div>
        </div>
      </div>

      <div className="row-10 row10-dual">
        <button className="btn btn-secondary" onClick={() => {}}>Lưu biên lai</button>
        <button className="btn btn-primary" onClick={() => navigate('HomeSend')}>Xong</button>
      </div>
    </div>
  )
}
