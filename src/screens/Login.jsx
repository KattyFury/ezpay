import logoLong from '../../logo-long.png'
import { useNav } from '../nav'

export default function Login() {
  const { navigate } = useNav()

  return (
    <div className="screen">
      <div className="row-1-5 center col" style={{ gap: 12 }}>
        <img src={logoLong} alt="ezwallet" style={{ width: '68%', maxWidth: 220 }} />
        <span style={{ fontSize: 'var(--fs-label)', color: 'var(--color-gray)' }}>
          Ví stablecoin tối giản
        </span>
      </div>

      <div className="row-8 center">
        <button
          className="btn btn-primary"
          style={{ width: '100%' }}
          onClick={() => navigate('CreatePin')}
        >
          Đăng nhập với Email
        </button>
      </div>

      <div className="row-9 center">
        <button
          className="btn btn-secondary"
          style={{ width: '100%', opacity: 0.4 }}
          disabled
        >
          Số điện thoại (sắp ra mắt)
        </button>
      </div>

      <div className="row-10 center">
        <span style={{ fontSize: 'var(--fs-label)', color: 'var(--color-gray)', textAlign: 'center', padding: '0 24px' }}>
          Đăng nhập = chấp nhận điều khoản sử dụng
        </span>
      </div>
    </div>
  )
}
