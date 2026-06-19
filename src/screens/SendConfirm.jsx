import { useNav } from '../nav'
import { fmtVND } from '../data'

const USDC_RATE = 25000

function shortenAddr(addr) {
  return addr ? addr.slice(0, 6) + '…' + addr.slice(-4) : ''
}

export default function SendConfirm() {
  const { navigate, params } = useNav()
  const { address, name, amount, memo } = params
  const usdcAmount = (amount / USDC_RATE).toFixed(4)

  function confirmWithPin() {
    navigate('EnterPin', {
      onSuccess: 'SendReceipt',
      onSuccessParams: { address, name, amount, memo, timestamp: Date.now() },
    })
  }

  return (
    <div className="screen">
      <div className="row-1 center send-title">
        <button className="back-btn" onClick={() => navigate('SendAmount', params)}>‹</button>
        <span>Xác nhận</span>
      </div>

      <div className="row-2-5 col" style={{ justifyContent: 'center', gap: 10 }}>
        <div className="confirm-box">
          <div className="confirm-row">
            <span className="confirm-label">Gửi đến</span>
            <span className="confirm-value">{name || shortenAddr(address)}</span>
          </div>
          {name && (
            <div className="confirm-row">
              <span className="confirm-label">Địa chỉ</span>
              <span className="confirm-value" style={{ fontSize: 'var(--fs-label)' }}>{shortenAddr(address)}</span>
            </div>
          )}
          <div className="confirm-row">
            <span className="confirm-label">Số tiền</span>
            <span className="confirm-value" style={{ fontWeight: 'var(--fw-bold)', color: 'var(--color-primary)' }}>
              {fmtVND(amount)}
            </span>
          </div>
          <div className="confirm-row">
            <span className="confirm-label">USDC</span>
            <span className="confirm-value" style={{ fontSize: 'var(--fs-label)', color: 'var(--color-gray)' }}>
              {usdcAmount} USDC
            </span>
          </div>
          {memo ? (
            <div className="confirm-row">
              <span className="confirm-label">Nội dung</span>
              <span className="confirm-value">{memo}</span>
            </div>
          ) : null}
          <div className="confirm-row">
            <span className="confirm-label">Phí</span>
            <span className="confirm-value" style={{ fontSize: 'var(--fs-label)', color: 'var(--color-gray)' }}>
              ~0 ₫ (testnet)
            </span>
          </div>
        </div>

        <div className="warning-badge">
          ⚠ Giao dịch không thể hoàn tác sau khi xác nhận
        </div>
      </div>

      <div className="row-10 row10-dual">
        <button className="btn btn-secondary" onClick={() => navigate('SendAmount', params)}>Sửa</button>
        <button className="btn" style={{ background: 'var(--color-error)', color: 'var(--color-white)' }} onClick={confirmWithPin}>
          Xác nhận · PIN
        </button>
      </div>
    </div>
  )
}
