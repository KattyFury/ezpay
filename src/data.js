export const TOKENS = [
  { symbol: 'USDC',   name: 'USD Coin',   vnd: 1_234_567, amount: 50.0,  color: '#2775CA' },
  { symbol: 'EURC',   name: 'EUR Coin',   vnd: 0,         amount: 0,     color: '#1A56DB' },
  { symbol: 'cirBTC', name: 'Circle BTC', vnd: 0,         amount: 0,     color: '#F7931A' },
]

export const SWAP_PAIRS = [
  ['USDC', 'EURC'],
  ['USDC', 'cirBTC'],
  ['EURC', 'cirBTC'],
]

export function fmtVND(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' VND'
}
