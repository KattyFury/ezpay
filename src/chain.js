import { createPublicClient, http } from 'viem'
import { defineChain } from 'viem'

export const arcTestnet = defineChain({
  id: 5042002,
  name: 'Arc Testnet',
  nativeCurrency: { name: 'USDC', symbol: 'USDC', decimals: 18 },
  rpcUrls: { default: { http: ['https://rpc.testnet.arc.network'] } },
  blockExplorers: { default: { name: 'ArcScan', url: 'https://testnet.arcscan.app' } },
})

export const publicClient = createPublicClient({
  chain: arcTestnet,
  transport: http(),
})

const ERC20_ABI = [
  { name: 'balanceOf', type: 'function', stateMutability: 'view', inputs: [{ name: 'account', type: 'address' }], outputs: [{ type: 'uint256' }] },
]

// vndRate: tỷ giá tạm (mock) → 1 token = ? VND. Sau này thay bằng giá thật từ API.
export const TOKENS = [
  { symbol: 'USDC',   address: '0x3600000000000000000000000000000000000000', decimals: 6, color: '#2775CA', vndRate: 25000 },
  { symbol: 'EURC',   address: '0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a', decimals: 6, color: '#1A56DB', vndRate: 27000 },
  { symbol: 'cirBTC', address: '0xf0c4a4ce82a5746abaad9425360ab04fbba432bf', decimals: 8, color: '#F7931A', vndRate: 2600000000 },
]

export async function getTokenBalances(walletAddress) {
  if (!walletAddress) return []
  const results = await Promise.all(
    TOKENS.map(async token => {
      try {
        const raw = await publicClient.readContract({
          address: token.address,
          abi: ERC20_ABI,
          functionName: 'balanceOf',
          args: [walletAddress],
        })
        const amount = Number(raw) / Math.pow(10, token.decimals)
        return { ...token, amount, vnd: Math.round(amount * token.vndRate) }
      } catch {
        return { ...token, amount: 0, vnd: 0 }
      }
    })
  )
  return results.filter(t => t.amount > 0)
}

export function fmtAmount(amount, decimals = 6) {
  if (amount === 0) return '0'
  if (amount < 0.000001) return amount.toExponential(2)
  return amount.toFixed(Math.min(4, decimals))
}
