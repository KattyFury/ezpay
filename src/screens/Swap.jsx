import { useState } from 'react'
import NavBar from '../components/NavBar'
import Numpad from '../components/Numpad'
import { TOKENS, fmtVND } from '../data'
import { IconSwap } from '../icons'

export default function Swap() {
  const [fromIdx, setFromIdx] = useState(1) // ARC
  const [toIdx,   setToIdx]   = useState(0) // USDC
  const [input,   setInput]   = useState('')

  const from = TOKENS[fromIdx]
  const to   = TOKENS[toIdx]

  function handleKey(key) {
    if (key === 'BACK') { setInput(p => p.slice(0, -1)); return }
    if (key === ',' && input.includes(',')) return
    if (input.length >= 10) return
    setInput(p => p + key)
  }

  function swapDir() {
    setFromIdx(toIdx)
    setToIdx(fromIdx)
    setInput('')
  }

  const displayAmt = input || '0'

  return (
    <div className="screen">
      {/* Rows 1–2: FROM token */}
      <div className="row-1-2" style={{ padding: '4px 0' }}>
        <div className="swap-box">
          <div className="token-icon" style={{ background: from.color }}>{from.symbol.slice(0, 2)}</div>
          <div className="col" style={{ flex: 1 }}>
            <span style={{ fontSize: 'var(--fs-label)', color: 'var(--color-gray)' }}>Từ</span>
            <span style={{ fontSize: 'var(--fs-item)', fontWeight: 'var(--fw-medium)' }}>{from.symbol}</span>
          </div>
          <span style={{ fontSize: 'var(--fs-amount)', fontWeight: 'var(--fw-bold)' }}>{displayAmt}</span>
        </div>
      </div>

      {/* Row 3: swap direction */}
      <div className="row-3 center">
        <button
          onClick={swapDir}
          style={{ width: 44, height: 44, borderRadius: '50%', border: '1.5px solid var(--color-gray)', background: 'var(--color-white)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <IconSwap size={22} />
        </button>
      </div>

      {/* Rows 4–5: TO token */}
      <div className="row-4-5" style={{ padding: '4px 0' }}>
        <div className="swap-box">
          <div className="token-icon" style={{ background: to.color }}>{to.symbol.slice(0, 2)}</div>
          <div className="col" style={{ flex: 1 }}>
            <span style={{ fontSize: 'var(--fs-label)', color: 'var(--color-gray)' }}>Đến</span>
            <span style={{ fontSize: 'var(--fs-item)', fontWeight: 'var(--fw-medium)' }}>{to.symbol}</span>
          </div>
          <div className="col" style={{ alignItems: 'flex-end' }}>
            <span style={{ fontSize: 'var(--fs-item)', fontWeight: 'var(--fw-medium)' }}>{fmtVND(to.vnd)}</span>
            <span style={{ fontSize: 'var(--fs-label)', color: 'var(--color-gray)' }}>Số dư khả dụng</span>
          </div>
        </div>
      </div>

      {/* Row 6: OK button */}
      <div className="row-6 center">
        <button className="btn btn-primary" style={{ width: '66.67%' }} disabled={!input}>
          OK
        </button>
      </div>

      {/* Rows 7–9: numpad */}
      <div className="row-7-9">
        <Numpad onKey={handleKey} showComma />
      </div>

      <NavBar active="Swap" />
    </div>
  )
}
