import NavBar from '../components/NavBar'
import { MOCK_VND, fmtVND } from '../data'
import { IconHistory, IconLanguage, IconSecurity, IconInfo, IconChevron } from '../icons'
import { useNav } from '../nav'

const ITEMS = [
  { id: 'TxHistory', Icon: IconHistory,  label: 'Lịch sử giao dịch' },
  { id: 'Language',  Icon: IconLanguage, label: 'Ngôn ngữ & tiền tệ' },
  { id: 'Security',  Icon: IconSecurity, label: 'Bảo mật' },
  { id: 'About',     Icon: IconInfo,     label: 'About' },
]

export default function MenuScreen() {
  const { navigate } = useNav()

  return (
    <div className="screen">
      {/* Rows 1–2: balance + actions */}
      <div className="row-1-2 col" style={{ justifyContent: 'center', gap: 6 }}>
        <span style={{ fontSize: 'var(--fs-label)', color: 'var(--color-gray)' }}>Số dư khả dụng</span>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 'var(--fs-amount)', fontWeight: 'var(--fw-bold)' }}>{fmtVND(MOCK_VND)}</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-primary" style={{ height: 34, fontSize: 'var(--fs-label)', padding: '0 14px' }}
              onClick={() => navigate('Deposit')}>
              Nạp
            </button>
            <button className="btn btn-secondary" style={{ height: 34, fontSize: 'var(--fs-label)', padding: '0 14px', opacity: 0.4 }} disabled>
              Rút
            </button>
          </div>
        </div>
      </div>

      {/* Rows 3–9: menu items */}
      <div className="row-3-9 col">
        {ITEMS.map(({ id, Icon, label }) => (
          <button key={id} className="menu-item" onClick={() => navigate(id)}>
            <Icon size={20} />
            <span style={{ flex: 1, fontSize: 'var(--fs-content)', fontWeight: 'var(--fw-medium)' }}>{label}</span>
            <IconChevron size={16} />
          </button>
        ))}
      </div>

      <NavBar active="MenuScreen" />
    </div>
  )
}
