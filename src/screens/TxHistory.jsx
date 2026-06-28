import { useState, useEffect } from 'react'
import { useNav } from '../nav'
import { fmtVND } from '../data'
import { TOKENS } from '../chain'
import Icon from '../components/Icon'

const ARCSCAN = 'https://testnet.arcscan.app'
const TOKEN_MAP = Object.fromEntries(TOKENS.map(t => [t.address.toLowerCase(), t]))

function loadContactMap() {
  try {
    const list = JSON.parse(localStorage.getItem('ez_contacts') || '[]')
    const m = {}
    list.forEach(c => { if (c.address) m[c.address.toLowerCase()] = c.name })
    return m
  } catch { return {} }
}

function timeAgo(ts) {
  const diff = Math.floor(Date.now() / 1000) - parseInt(ts)
  if (diff < 60) return 'vừa xong'
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`
  if (diff < 604800) return `${Math.floor(diff / 86400)} ngày trước`
  return new Date(ts * 1000).toLocaleDateString('vi-VN')
}

function shortAddr(addr) {
  return addr ? addr.slice(0, 6) + '...' + addr.slice(-4) : ''
}

// Tính thông tin chung của 1 giao dịch
function txInfo(tx, walletAddr, contacts) {
  const token = TOKEN_MAP[tx.contractAddress?.toLowerCase()]
  const decimals = parseInt(tx.tokenDecimal || 6)
  const amount = parseFloat(tx.value) / Math.pow(10, decimals)
  const isSend = tx.from?.toLowerCase() === walletAddr?.toLowerCase()
  const symbol = tx.tokenSymbol || token?.symbol || '?'
  const vnd = Math.round(amount * (token?.vndRate || 25000))
  const counter = isSend ? tx.to : tx.from
  const name = contacts[counter?.toLowerCase()] || null
  return { isSend, amount, symbol, vnd, counter, name }
}

function TxRow({ tx, walletAddr, contacts, onClick }) {
  const { isSend, amount, symbol, vnd, counter, name } = txInfo(tx, walletAddr, contacts)
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 12, width: '100%',
      padding: '12px 0', border: 'none', background: 'none', cursor: 'pointer',
      borderBottom: '1px solid var(--color-gray)', fontFamily: 'inherit', textAlign: 'left',
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
        background: isSend ? 'var(--color-warning-soft)' : 'var(--color-primary-soft)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name={isSend ? 'up' : 'down'} size={22} color={isSend ? 'var(--color-warning)' : 'var(--color-primary)'} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 'var(--fs-item)', fontWeight: 'var(--fw-medium)', color: 'var(--color-content)' }}>
          {isSend ? 'Đã gửi' : 'Đã nhận'} {symbol}
        </div>
        <div style={{ fontSize: 'var(--fs-label)', color: 'var(--color-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {isSend ? 'Đến' : 'Từ'} {name || shortAddr(counter)} · {timeAgo(tx.timeStamp)}
        </div>
      </div>

      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div className="num" style={{ fontSize: 'var(--fs-num)', fontWeight: 'var(--fw-semibold)', color: isSend ? 'var(--color-error)' : 'var(--color-primary)' }}>
          {isSend ? '-' : '+'}{amount.toFixed(amount < 0.01 ? 6 : 2)} {symbol}
        </div>
        <div className="num" style={{ fontSize: 'var(--fs-label)', color: 'var(--color-muted)' }}>{fmtVND(vnd)}</div>
      </div>
    </button>
  )
}

function DetailRow({ label, children }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--color-gray)' }}>
      <span style={{ fontSize: 'var(--fs-label)', color: 'var(--color-muted)', flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 'var(--fs-item)', fontWeight: 'var(--fw-medium)', color: 'var(--color-content)', textAlign: 'right', wordBreak: 'break-word' }}>{children}</span>
    </div>
  )
}

export default function TxHistory() {
  const { navigate } = useNav()
  const [txs, setTxs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // 'all' | 'send' | 'receive'
  const [selected, setSelected] = useState(null)
  const walletAddr = localStorage.getItem('ez_wallet_addr')
  const contacts = loadContactMap()

  const isSendTx = tx => tx.from?.toLowerCase() === walletAddr?.toLowerCase()
  const filtered = txs.filter(tx => filter === 'all' ? true : filter === 'send' ? isSendTx(tx) : !isSendTx(tx))
  const emptyMsg = filter === 'send' ? 'Chưa có giao dịch gửi' : filter === 'receive' ? 'Chưa có giao dịch nhận' : 'Chưa có giao dịch nào'

  useEffect(() => {
    if (!walletAddr) { setLoading(false); return }
    fetch(`${ARCSCAN}/api?module=account&action=tokentx&address=${walletAddr}&sort=desc&limit=50`)
      .then(r => r.json())
      .then(d => setTxs(d?.result || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [walletAddr])

  const d = selected ? txInfo(selected, walletAddr, contacts) : null

  return (
    <div className="screen">
      <div className="row-1 center screen-title" style={{ fontSize: 'var(--fs-title)', fontWeight: 'var(--fw-medium)' }}>
        Lịch sử giao dịch
      </div>

      <div className="row-2-8" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', overflowY: 'auto', justifyContent: 'flex-start' }}>
        {loading ? (
          <div style={{ width: '100%', textAlign: 'center', paddingTop: 40, color: 'var(--color-muted)', fontSize: 'var(--fs-label)' }}>Đang tải...</div>
        ) : filtered.length === 0 ? (
          <div style={{ width: '100%', textAlign: 'center', paddingTop: 40 }}>
            <div style={{ fontSize: 'var(--fs-body)', color: 'var(--color-muted)' }}>{emptyMsg}</div>
          </div>
        ) : (
          filtered.map(tx => <TxRow key={tx.hash} tx={tx} walletAddr={walletAddr} contacts={contacts} onClick={() => setSelected(tx)} />)
        )}
      </div>

      <div style={{ gridRow: '9 / 11', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <button className={`btn ${filter === 'send' ? 'btn-primary' : 'btn-secondary'}`} style={{ flex: 1 }}
          onClick={() => setFilter(f => f === 'send' ? 'all' : 'send')}>Chỉ gửi</button>
        <button className={`btn ${filter === 'receive' ? 'btn-primary' : 'btn-secondary'}`} style={{ flex: 1 }}
          onClick={() => setFilter(f => f === 'receive' ? 'all' : 'receive')}>Chỉ nhận</button>
        <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => navigate('MenuScreen')}>Quay lại</button>
      </div>

      {/* Popup chi tiết giao dịch */}
      {selected && d && (
        <div onClick={() => setSelected(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 360, background: 'var(--color-white)', borderRadius: 16, padding: 20 }}>
            <div className="screen-title" style={{ fontSize: 'var(--fs-title)', fontWeight: 'var(--fw-medium)', textAlign: 'center', marginBottom: 8 }}>Chi tiết giao dịch</div>
            <DetailRow label="Loại">{d.isSend ? 'Đã gửi' : 'Đã nhận'} {d.symbol}</DetailRow>
            <DetailRow label={d.isSend ? 'Người nhận' : 'Người gửi'}>{d.name || shortAddr(d.counter)}</DetailRow>
            {d.name && <DetailRow label="Địa chỉ">{shortAddr(d.counter)}</DetailRow>}
            <DetailRow label="Số tiền">
              <span className="num" style={{ color: d.isSend ? 'var(--color-error)' : 'var(--color-primary)' }}>
                {d.isSend ? '-' : '+'}{d.amount.toFixed(d.amount < 0.01 ? 6 : 2)} {d.symbol}
              </span>
            </DetailRow>
            <DetailRow label="Quy đổi"><span className="num">{fmtVND(d.vnd)}</span></DetailRow>
            <DetailRow label="Thời gian">{new Date(selected.timeStamp * 1000).toLocaleString('vi-VN')}</DetailRow>
            {selected.memo && <DetailRow label="Nội dung">{selected.memo}</DetailRow>}
            <button className="btn btn-secondary" style={{ width: '100%', marginTop: 14 }}
              onClick={() => window.open(`${ARCSCAN}/tx/${selected.hash}`, '_blank')}>
              Xem trên ArcScan
            </button>
            <button className="btn btn-primary" style={{ width: '100%', marginTop: 8 }} onClick={() => setSelected(null)}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  )
}
