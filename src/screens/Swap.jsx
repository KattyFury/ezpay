import { useState, useEffect } from 'react'
import NavBar from '../components/NavBar'
import Numpad from '../components/Numpad'
import { estimateSwap, executeSwap, getSDK, executeChallenge } from '../circle'
import { getTokenBalances } from '../chain'

const SWAP_TOKENS = ['USDC', 'EURC', 'cirBTC']
const COLORS = { USDC: '#2775CA', EURC: '#1A56DB', cirBTC: '#F7931A' }

function TokenCard({ side, symbol, amount, est, showQuick, onQuick, onToggle }) {
  return (
    <div style={{
      border: '1.5px solid var(--color-gray)', borderRadius: 14,
      padding: '10px 14px', background: 'var(--color-white)',
      display: 'flex', flexDirection: 'column', gap: 6, height: '100%', boxSizing: 'border-box',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: COLORS[symbol] || '#999',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, fontWeight: 700, color: '#fff',
          }}>{symbol.slice(0, 2)}</div>
          <div>
            <div style={{ fontSize: 'var(--fs-label)', color: 'var(--color-muted)' }}>{side}</div>
            <button onClick={onToggle} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'var(--fs-item)', fontWeight: 'var(--fw-medium)', padding: 0 }}>
              {symbol} ▾
            </button>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          {side === 'Từ' ? (
            <div style={{ fontSize: 22, fontWeight: 700, color: amount ? 'var(--color-black)' : 'var(--color-gray)' }}>
              {amount || '0'}
            </div>
          ) : (
            <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-muted)' }}>
              {est || '~'}
            </div>
          )}
        </div>
      </div>
      {showQuick && (
        <div style={{ display: 'flex', gap: 6 }}>
          {['25%', '50%', '75%', 'Max'].map(v => (
            <button key={v} onClick={() => onQuick(v)}
              style={{ flex: 1, height: 24, border: '1px solid var(--color-gray)', borderRadius: 6, background: 'none', cursor: 'pointer', fontSize: 'var(--fs-label)', fontFamily: 'inherit' }}>
              {v}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function TokenPicker({ current, exclude, onSelect, onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 200, display: 'flex', alignItems: 'flex-end' }}
      onClick={onClose}>
      <div style={{ background: '#fff', width: '100%', maxWidth: 430, margin: '0 auto', borderRadius: '16px 16px 0 0', padding: 20 }}
        onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: 'var(--fs-body)', fontWeight: 'var(--fw-bold)', marginBottom: 16 }}>Chọn token</div>
        {SWAP_TOKENS.filter(t => t !== exclude).map(sym => (
          <button key={sym} onClick={() => { onSelect(sym); onClose() }}
            style={{
              display: 'flex', alignItems: 'center', gap: 12, width: '100%',
              padding: '12px 0', border: 'none', background: 'none', cursor: 'pointer',
              borderBottom: '1px solid var(--color-gray)', fontFamily: 'inherit',
            }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: COLORS[sym], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff' }}>
              {sym.slice(0, 2)}
            </div>
            <span style={{ fontSize: 'var(--fs-item)', fontWeight: 'var(--fw-medium)' }}>{sym === current ? `${sym} ✓` : sym}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default function Swap() {
  const [fromIdx, setFromIdx] = useState(0)
  const [toIdx, setToIdx] = useState(1)
  const [input, setInput] = useState('')
  const [estimate, setEstimate] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')
  const [balances, setBalances] = useState({})
  const [picker, setPicker] = useState(null) // 'from' | 'to' | null

  const fromSym = SWAP_TOKENS[fromIdx]
  const toSym = SWAP_TOKENS[toIdx]

  useEffect(() => {
    const addr = localStorage.getItem('ez_wallet_addr')
    if (!addr) return
    getTokenBalances(addr).then(tokens => {
      const map = {}
      tokens.forEach(t => { map[t.symbol] = t.amount })
      setBalances(map)
    })
  }, [])

  function selectToken(side, sym) {
    const idx = SWAP_TOKENS.indexOf(sym)
    if (side === 'from') {
      if (idx === toIdx) setToIdx(fromIdx) // swap if same
      setFromIdx(idx)
    } else {
      if (idx === fromIdx) setFromIdx(toIdx)
      setToIdx(idx)
    }
    setInput(''); setEstimate(null)
  }

  function handleKey(key) {
    setEstimate(null)
    if (key === 'BACK') { setInput(p => p.slice(0, -1)); return }
    if (key === ',' && input.includes(',')) return
    if (input.length >= 10) return
    setInput(p => p + key)
  }

  function swapDir() {
    const tmp = fromIdx; setFromIdx(toIdx); setToIdx(tmp); setInput(''); setEstimate(null)
  }

  async function handleEstimate() {
    if (!input || parseFloat(input.replace(',', '.')) <= 0) return
    setLoading(true); setError('')
    try {
      const walletAddress = localStorage.getItem('ez_wallet_addr')
      const res = await estimateSwap({ walletAddress, tokenIn: fromSym, tokenOut: toSym, amountIn: input.replace(',', '.') })
      if (res.error) throw new Error(res.error)
      setEstimate(res.estimate)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleSwap() {
    setLoading(true); setError(''); setStatus('Đang chuẩn bị...')
    try {
      const walletAddress = localStorage.getItem('ez_wallet_addr')
      const walletId = localStorage.getItem('ez_wallet_id')
      const res = await executeSwap({ walletId, walletAddress, tokenIn: fromSym, tokenOut: toSym, amountIn: input.replace(',', '.') })
      if (res.error) throw new Error(res.error)
      setStatus('Xác nhận PIN...')
      const userToken = localStorage.getItem('ez_user_token')
      const encryptionKey = localStorage.getItem('ez_encryption_key')
      await executeChallenge(getSDK(), userToken, encryptionKey, res.challengeId)
      setStatus('Swap thành công!')
      setInput(''); setEstimate(null)
    } catch (e) {
      setError(e.message); setStatus('')
    } finally {
      setLoading(false)
    }
  }

  const estAmt = estimate?.estimatedOutput?.amount
  const canSwap = !!input && parseFloat(input.replace(',', '.')) > 0

  return (
    <div className="screen">
      {picker && (
        <TokenPicker
          current={picker === 'from' ? fromSym : toSym}
          exclude={picker === 'from' ? toSym : fromSym}
          onSelect={sym => selectToken(picker, sym)}
          onClose={() => setPicker(null)}
        />
      )}
      <div className="row-1" style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--color-gray)' }}>
        <button style={{ flex: 1, height: '100%', border: 'none', background: 'none', fontFamily: 'inherit', fontSize: 'var(--fs-label)', fontWeight: 700, color: 'var(--color-primary)', borderBottom: '2px solid var(--color-primary)' }}>Market</button>
        <button style={{ flex: 1, height: '100%', border: 'none', background: 'none', fontFamily: 'inherit', fontSize: 'var(--fs-label)', color: 'var(--color-muted)', opacity: 0.4, cursor: 'not-allowed' }}>Limit</button>
      </div>

      <div className="row-2" style={{ padding: '8px 0 4px' }}>
        <TokenCard side="Từ" symbol={fromSym} amount={input} showQuick onQuick={v => {
          const bal = balances[fromSym] || 0
          const pct = v === 'Max' ? 1 : parseFloat(v) / 100
          setInput(String((bal * pct).toFixed(6).replace(/\.?0+$/, '')))
          setEstimate(null)
        }} onToggle={() => setPicker('from')} />
      </div>

      <div className="row-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <button onClick={swapDir} style={{ width: 36, height: 36, borderRadius: '50%', border: '1.5px solid var(--color-gray)', background: 'var(--color-white)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 18 }}>⇅</button>
      </div>

      <div className="row-4" style={{ padding: '4px 0 8px' }}>
        <TokenCard side="Đến" symbol={toSym} est={estAmt ? `~${parseFloat(estAmt).toFixed(4)}` : '~'} showQuick={false} onToggle={() => setPicker('to')} />
      </div>

      <div className="row-5" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 'var(--fs-label)', color: 'var(--color-muted)' }}>
        {estimate ? (
          <>
            <span>Phí: {estimate.fees?.map(f => `${f.amount} ${f.token}`).join(' + ')}</span>
            <span>Min: {parseFloat(estimate.stopLimit?.amount || 0).toFixed(4)} {toSym}</span>
          </>
        ) : <span>{error && <span style={{ color: 'var(--color-error)' }}>{error}</span>}</span>}
        {status && <span style={{ color: 'var(--color-primary)' }}>{status}</span>}
      </div>

      <div className="row-6 center">
        {!estimate ? (
          <button className="btn btn-primary" style={{ width: '100%' }} disabled={!canSwap || loading} onClick={handleEstimate}>
            {loading ? 'Đang ước tính...' : 'Xem tỷ giá'}
          </button>
        ) : (
          <button className="btn btn-primary" style={{ width: '100%' }} disabled={loading} onClick={handleSwap}>
            {loading ? 'Đang xử lý...' : `Swap ${input} ${fromSym} → ~${parseFloat(estAmt).toFixed(4)} ${toSym}`}
          </button>
        )}
      </div>

      <div className="row-7-9">
        <Numpad onKey={handleKey} showComma />
      </div>

      <NavBar active="Swap" />
    </div>
  )
}
