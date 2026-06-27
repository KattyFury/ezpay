import NavBar from '../components/NavBar'
import BalanceHeader from '../components/BalanceHeader'
import { getTokenBalances } from '../chain'
import { useState, useEffect } from 'react'
import timeIcon from '../../icon/time.png'
import globeIcon from '../../icon/globe.png'
import shieldIcon from '../../icon/shield.png'
import infoIcon from '../../icon/info.png'
import rightIcon from '../../icon/right.png'
import { useNav } from '../nav'

const ITEMS = [
  { id: 'TxHistory', icon: timeIcon,   label: 'Lịch sử giao dịch' },
  { id: 'Language',  icon: globeIcon,  label: 'Ngôn ngữ & tiền tệ' },
  { id: 'Security',  icon: shieldIcon, label: 'Bảo mật' },
  { id: 'About',     icon: infoIcon,   label: 'About' },
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
      {/* Rows 1-2: Số dư (đồng bộ với HomeSend / HomeReceive) */}
      <BalanceHeader totalVND={totalVND} loading={false} />

      {/* Row 3: Nạp / Rút */}
      <div className="row-3" style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <button className="btn btn-primary" style={{ flex: 1 }}
          onClick={() => window.open('https://faucet.circle.com/', '_blank')}>
          Nạp tiền
        </button>
        <button className="btn btn-secondary" style={{ flex: 1, opacity: 0.4 }} disabled>
          Rút tiền
        </button>
      </div>

      {/* Rows 4-7: menu items */}
      {ITEMS.map(({ id, icon, label }, i) => (
        <div key={id} className={`row-${i + 4}`} style={{ display: 'flex', alignItems: 'center' }}>
          <button className="menu-item" style={{ width: '100%' }} onClick={() => navigate(id, { title: label })}>
            <img src={icon} alt='' style={{ width: 22, height: 22 }} />
            <span style={{ flex: 1, fontSize: 'var(--fs-body)', fontWeight: 'var(--fw-medium)' }}>{label}</span>
            <img src={rightIcon} alt='' style={{ width: 18, height: 18, opacity: 0.5 }} />
          </button>
        </div>
      ))}
<NavBar active="MenuScreen" />
    </div>
  )
}
