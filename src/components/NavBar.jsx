import { useNav } from '../nav'

const TABS = [
  { id: 'Swap',        label: 'Đổi tiền' },
  { id: 'HomeSend',    label: 'Gửi' },
  { id: 'HomeReceive', label: 'Nhận' },
  { id: 'MenuScreen',  label: 'Menu' },
]

export default function NavBar({ active }) {
  const { navigate } = useNav()
  return (
    <nav className="navbar full-bleed">
      {TABS.map(t => (
        <button
          key={t.id}
          className={`navbar-btn${active === t.id ? ' active' : ''}`}
          onClick={() => navigate(t.id)}
        >
          {t.label}
        </button>
      ))}
    </nav>
  )
}
