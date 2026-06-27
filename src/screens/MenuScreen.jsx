import NavBar from '../components/NavBar'
import { getTokenBalances } from '../chain'
import { useState, useEffect } from 'react'
import { IconHistory, IconLanguage, IconSecurity, IconInfo } from '../icons'
import rightIcon from '../../icon/right.png'
import { useNav } from '../nav'

const ITEMS = [
  { id: 'TxHistory', Icon: IconHistory,  label: 'Lịch sử giao dịch' },
  { id: 'Language',  Icon: IconLanguage, label: 'Ngôn ngữ & tiền tệ' },
  { id: 'Security',  Icon: IconSecurity, label: 'Bảo mật' },
  { id: 'About',     Icon: IconInfo,     label: 'About' },
]

export default function MenuScreen() {
  const { navigate } = useNav()
  const [totalVND, setTotalVND] = useState(0)
  useEffect(() => {
    const addr = localStorage.getItem('ez_wallet_addr')
    if (addr) getTokenBalances(addr).then(ts => setTotalVND(ts.reduce((s, t) => s + t.vnd, 0)))
  }, [])

  return (
    <div className="screen">
      {/* Row 1: Số dư — đồng bộ với HomeSend / HomeReceive */}
      <div className="row-1" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 2px' }}>
        <span style={{ fontSize: 20, color: 'var(--color-muted)' }}>Số dư:</span>
        <span style={{ fontSize: 28, fontWeight: 'var(--fw-bold)', color: 'var(--color-black)', lineHeight: 1 }}>
          {totalVND.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
        </span>
        <span style={{ fontSize: 20, color: 'var(--color-muted)' }}>VND</span>
      </div>

      {/* Row 2: Số dư thực tế */}
      {/* Row 3: Nạp / Rút */}
      <div className="row-2" style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <button className="btn btn-primary" style={{ flex: 1 }}
          onClick={() => window.open('https://faucet.circle.com/', '_blank')}>
          Nạp tiền
        </button>
        <button className="btn btn-secondary" style={{ flex: 1, opacity: 0.4 }} disabled>
          Rút tiền
        </button>
      </div>

      {/* Rows 4-7: menu items */}
      {ITEMS.map(({ id, Icon, label }, i) => (
        <div key={id} className={`row-${i + 3}`} style={{ display: 'flex', alignItems: 'center' }}>
          <button className="menu-item" style={{ width: '100%' }} onClick={() => navigate(id, { title: label })}>
            <Icon size={20} />
            <span style={{ flex: 1, fontSize: 'var(--fs-body)', fontWeight: 'var(--fw-medium)' }}>{label}</span>
            <img src={rightIcon} alt='' style={{ width: 18, height: 18, opacity: 0.5 }} />
          </button>
        </div>
      ))}
<NavBar active="MenuScreen" />
    </div>
  )
}
