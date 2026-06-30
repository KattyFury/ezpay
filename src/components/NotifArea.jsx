import { useState, useEffect } from 'react'
import Icon from './Icon'
import { useNav } from '../nav'
import { getNotifs, dismissNotif, addNotif } from '../notif'
import { t } from '../i18n'

// Phát hiện tiền vào (poll ArcScan) → tạo thông báo "đã nhận" (dùng chung mọi màn có NotifArea)
// Chống trùng: mỗi tx hash chỉ thông báo MỘT lần (lưu set hash đã thông báo).
function notifiedHashes() {
  try { return new Set(JSON.parse(localStorage.getItem('ez_notified_hashes') || '[]')) } catch { return new Set() }
}
function markNotified(hash) {
  const s = notifiedHashes(); s.add(hash)
  localStorage.setItem('ez_notified_hashes', JSON.stringify([...s].slice(-100)))
}

function pollIncoming(after) {
  const addr = localStorage.getItem('ez_wallet_addr')
  if (!addr) return
  fetch(`https://testnet.arcscan.app/api?module=account&action=tokentx&address=${addr}&sort=desc&limit=20`)
    .then(r => r.json()).then(d => {
      const recv = (d?.result || []).filter(tx => tx.to?.toLowerCase() === addr.toLowerCase())
      const lastSeen = parseInt(localStorage.getItem('ez_last_recv_ts') || '0')
      if (recv[0]) localStorage.setItem('ez_last_recv_ts', recv[0].timeStamp)
      if (lastSeen) {
        const seen = notifiedHashes()
        recv.filter(tx => parseInt(tx.timeStamp) > lastSeen && !seen.has(tx.hash)).reverse().forEach(tx => {
          const amt = (parseFloat(tx.value) / Math.pow(10, parseInt(tx.tokenDecimal || 6))).toFixed(2)
          addNotif(`${t('Đã nhận')} ${amt} ${tx.tokenSymbol || 'USDC'} ${t('từ')} ${tx.from.slice(0, 6)}...${tx.from.slice(-4)}`, 'received', tx.hash)
          markNotified(tx.hash)
        })
        after()
      }
    }).catch(() => {})
}

// màu theo loại thông báo
const STYLE = {
  received: { color: 'var(--color-primary)', icon: 'down' },  // nhận = xanh
  sent:     { color: 'var(--color-muted)',   icon: 'up' },    // gửi = xám
  error:    { color: 'var(--color-error)',   icon: 'hint' },  // lỗi = đỏ
}

export default function NotifArea({ fallback }) {
  const { navigate } = useNav()
  const [notifs, setNotifs] = useState(getNotifs())
  useEffect(() => { pollIncoming(() => setNotifs(getNotifs())) }, [])
  function clear(id, e) { e.stopPropagation(); dismissNotif(id); setNotifs(getNotifs()) }
  function open(n) {
    navigate('TxHistory', n.hash ? { openHash: n.hash } : {})
  }

  if (notifs.length === 0) return fallback

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {notifs.slice(0, 2).map(n => {
        const s = STYLE[n.type] || STYLE.sent
        return (
          <div key={n.id} onClick={() => open(n)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, border: `1.5px solid ${s.color}`, borderRadius: 10, padding: '12px 14px', cursor: 'pointer' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--fs-label)', color: 'var(--color-content)', textAlign: 'left' }}>
              <Icon name={s.icon} size={18} color={s.color} />
              {n.text}
            </span>
            <button onClick={e => clear(n.id, e)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexShrink: 0, padding: 2 }}><Icon name="x" size={14} color="var(--color-muted)" /></button>
          </div>
        )
      })}
    </div>
  )
}
