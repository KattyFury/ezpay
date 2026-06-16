import NavBar from '../components/NavBar'
import { MOCK_VND, TOKENS, fmtVND } from '../data'
import { IconContacts, IconScan, IconPaste } from '../icons'

function TokenRow({ token }) {
  return (
    <div className="token-item">
      <div className="token-icon" style={{ background: token.color }}>
        {token.symbol.slice(0, 2)}
      </div>
      <div className="token-info">
        <div style={{ fontSize: 'var(--fs-item)', fontWeight: 'var(--fw-medium)' }}>{token.name}</div>
        <div style={{ fontSize: 'var(--fs-sub)', color: 'var(--color-gray)' }}>{token.symbol}</div>
      </div>
      <div className="token-amount">
        <div style={{ fontSize: 'var(--fs-item)', fontWeight: 'var(--fw-medium)' }}>{fmtVND(token.vnd)}</div>
        <div style={{ fontSize: 'var(--fs-sub)', color: 'var(--color-gray)' }}>{token.amount.toFixed(2)} {token.symbol}</div>
      </div>
    </div>
  )
}

export default function HomeSend() {
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

      {/* Rows 3–5: token list */}
      <div className="row-3-5" style={{ display: 'grid', gridTemplateRows: 'repeat(3, 1fr)' }}>
        {TOKENS.map(t => <TokenRow key={t.symbol} token={t} />)}
      </div>

      {/* Rows 6–7: tip */}
      <div className="row-6-7" style={{ padding: '6px 0' }}>
        <div className="tip-box">Chọn danh bạ, quét QR, hoặc dán địa chỉ để gửi tiền</div>
      </div>

      {/* Rows 8–9: action buttons */}
      <div className="row-8-9 action-grid">
        <button className="action-card">
          <IconContacts size={20} />
          <span>Danh bạ</span>
        </button>
        <button className="action-card primary">
          <IconScan size={26} />
          <span>Quét QR</span>
        </button>
        <button className="action-card">
          <IconPaste size={20} />
          <span>Dán địa chỉ</span>
        </button>
      </div>

      <NavBar active="HomeSend" />
    </div>
  )
}
