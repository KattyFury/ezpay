import { useNav } from '../nav'

const VERSION = '0.1.0'

const ITEMS = [
  { label: 'Ứng dụng', value: 'EZwallet' },
  { label: 'Phiên bản', value: VERSION },
  { label: 'Mạng', value: 'Arc Testnet' },
  { label: 'Wallet', value: 'Circle User Controlled Wallet' },
  { label: 'GitHub', value: 'KattyFury/ezwallet', link: 'https://github.com/KattyFury/ezwallet' },
  { label: 'Điều khoản sử dụng', value: '→', link: 'https://www.circle.com/en/legal/privacy-policy' },
  { label: 'Chính sách bảo mật', value: '→', link: 'https://www.circle.com/en/legal/privacy-policy' },
]

export default function About() {
  const { navigate } = useNav()

  return (
    <div className="screen">
      <div className="row-1 center screen-title" style={{ fontSize: 'var(--fs-title)', fontWeight: 'var(--fw-bold)' }}>
        About
      </div>

      <div className="row-2-9" style={{ gridRow: '2 / 9', justifyContent: 'flex-start', overflowY: 'auto' }}>
        {ITEMS.map(({ label, value, link }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--color-gray)', width: '100%' }}>
            <span style={{ fontSize: 'var(--fs-label)', color: 'var(--color-muted)' }}>{label}</span>
            {link ? (
              <a href={link} target="_blank" rel="noopener" style={{ fontSize: 'var(--fs-item)', fontWeight: 'var(--fw-medium)', color: 'var(--color-content)', textDecoration: 'none', textAlign: 'right', maxWidth: '60%' }}>
                {value}
              </a>
            ) : (
              <span style={{ fontSize: 'var(--fs-item)', fontWeight: 'var(--fw-medium)', textAlign: 'right', maxWidth: '60%', color: 'var(--color-content)' }}>{value}</span>
            )}
          </div>
        ))}
      </div>

      <div className="row-10 row10-single">
        <button className="btn btn-secondary" onClick={() => navigate('MenuScreen')}>Quay lại</button>
      </div>
    </div>
  )
}
