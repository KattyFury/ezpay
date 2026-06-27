import { useNav } from '../nav'
import Icon from './Icon'

const TABS = [
  { id: 'Swap',        label: 'Đổi tiền', icon: 'trade', disabled: true },
  { id: 'HomeSend',    label: 'Gửi',      icon: 'up' },
  { id: 'HomeReceive', label: 'Nhận',     icon: 'down' },
  { id: 'MenuScreen',  label: 'Menu',     icon: 'menu' },
]

export default function NavBar({ active }) {
  const { navigate } = useNav()
  return (
    <nav className="navbar full-bleed">
      {TABS.map(t => (
        <button
          key={t.id}
          className={`navbar-btn${active === t.id ? ' active' : ''}`}
          disabled={t.disabled}
          onClick={t.disabled ? undefined : () => navigate(t.id)}
          style={{ position: 'relative', ...(t.disabled ? { opacity: 0.4, cursor: 'not-allowed' } : {}) }}
        >
          {active === t.id && (
            <span style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '70%', height: 5, borderRadius: '0 0 5px 5px', background: 'var(--color-primary)' }} />
          )}
          <Icon name={t.icon} size={20} color={active === t.id ? 'var(--color-black)' : 'var(--color-muted)'} style={{ marginBottom: 2 }} />
          {t.label}
        </button>
      ))}
    </nav>
  )
}
