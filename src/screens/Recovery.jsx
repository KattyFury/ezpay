import { useNav } from '../nav'

function ShieldIcon() {
  return (
    <svg width="52" height="52" viewBox="0 0 24 24">
      <path d="M12 2L4 6v6c0 5.5 3.5 10.74 8 12 4.5-1.26 8-6.5 8-12V6L12 2z"
        fill="var(--color-primary)" />
    </svg>
  )
}

export default function Recovery() {
  const { navigate } = useNav()

  return (
    <div className="screen">
      <div className="row-1-5 center col" style={{ gap: 16 }}>
        <ShieldIcon />
        <span style={{ fontSize: 'var(--fs-content)', fontWeight: 'var(--fw-bold)' }}>
          Thiết lập khôi phục
        </span>
        <span style={{ fontSize: 'var(--fs-label)', color: 'var(--color-gray)', textAlign: 'center', padding: '0 8px' }}>
          Nếu quên PIN, bạn có thể khôi phục tài khoản bằng phương thức dưới đây
        </span>
      </div>

      <div className="row-8" style={{ padding: '4px 0' }}>
        <div className="option-row selected">
          <div className="option-radio selected" />
          <div className="col" style={{ gap: 2 }}>
            <span style={{ fontSize: 'var(--fs-content)', fontWeight: 'var(--fw-medium)' }}>
              Passkey
            </span>
            <span style={{ fontSize: 'var(--fs-label)', color: 'var(--color-gray)' }}>
              Xác thực bằng vân tay hoặc khuôn mặt
            </span>
          </div>
        </div>
      </div>

      <div className="row-9" style={{ padding: '4px 0' }}>
        <div className="option-row disabled">
          <div className="option-radio" />
          <div className="col" style={{ gap: 2 }}>
            <span style={{ fontSize: 'var(--fs-content)', fontWeight: 'var(--fw-medium)' }}>
              Số điện thoại
            </span>
            <span style={{ fontSize: 'var(--fs-label)', color: 'var(--color-gray)' }}>
              Sắp ra mắt
            </span>
          </div>
        </div>
      </div>

      <div className="row-10 row10-dual">
        <button className="btn btn-secondary" onClick={() => navigate('CreatePin')}>
          Quay lại
        </button>
        <button className="btn btn-primary" onClick={() => navigate('EnterPin')}>
          Tiếp tục
        </button>
      </div>
    </div>
  )
}
