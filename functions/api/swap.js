import { AppKit } from '@circle-fin/app-kit'
import { createViemAdapterFromPrivateKey } from '@circle-fin/adapter-viem-v2'

const W3S_API = 'https://api.circle.com/v1/w3s'

const TOKEN_ADDR = {
  USDC:   '0x3600000000000000000000000000000000000000',
  EURC:   '0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a',
  cirBTC: '0xf0c4a4ce82a5746abaad9425360ab04fbba432bf',
}

const arcTestnet = {
  id: 5042002,
  name: 'Arc Testnet',
  nativeCurrency: { name: 'USDC', symbol: 'USDC', decimals: 18 },
  rpcUrls: { default: { http: ['https://rpc.testnet.arc.network'] } },
}

const JSON_HEADERS = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }

async function w3sReq(method, path, body, apiKey, userToken) {
  const headers = { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' }
  if (userToken) headers['X-User-Token'] = userToken
  const res = await fetch(`${W3S_API}${path}`, {
    method, headers, body: body ? JSON.stringify(body) : undefined,
  })
  return res.json()
}

export async function onRequestPost(ctx) {
  const apiKey = ctx.env.API_KEY || ctx.env.CIRCLE_API_KEY
  const kitKey = ctx.env.KIT_KEY
  const { action, userToken, walletId, walletAddress, tokenIn, tokenOut, amountIn } = await ctx.request.json()

  const kit = new AppKit()
  const DUMMY_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'

  if (action === 'estimate') {
    try {
      const adapter = createViemAdapterFromPrivateKey({ privateKey: DUMMY_KEY, rpcUrl: 'https://rpc.testnet.arc.network' })
      const estimate = await kit.estimateSwap({
        from: { adapter, chain: 'Arc_Testnet' },
        tokenIn, tokenOut, amountIn: String(amountIn),
        config: { kitKey, slippageBps: 300 },
      })
      return new Response(JSON.stringify({ estimate }), { headers: JSON_HEADERS })
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: JSON_HEADERS })
    }
  }

  if (action === 'execute') {
    let capturedTx = null
    try {
      const captureClient = {
        account: { address: walletAddress }, chain: arcTestnet,
        sendTransaction: async (p) => { capturedTx = p; throw new Error('CAPTURE_DONE') },
        writeContract: async (p) => { capturedTx = p; throw new Error('CAPTURE_DONE') },
        signTypedData: async () => '0x', signMessage: async () => '0x',
        getChainId: async () => arcTestnet.id,
      }
      const adapter = createViemAdapterFromPrivateKey({
        privateKey: DUMMY_KEY,
        rpcUrl: 'https://rpc.testnet.arc.network',
      })
      // Override wallet client with capture
      adapter.getWalletClient = () => captureClient

      try {
        await kit.swap({
          from: { adapter, chain: 'Arc_Testnet' },
          tokenIn, tokenOut, amountIn: String(amountIn),
          config: { kitKey, slippageBps: 300 },
        })
      } catch (e) { if (!capturedTx) throw e }

      if (!capturedTx) throw new Error('Could not capture swap tx')

      const txResp = await w3sReq('POST', '/user/transactions/contractExecution', {
        idempotencyKey: crypto.randomUUID(),
        walletId,
        contractAddress: capturedTx.to || capturedTx.address,
        callData: capturedTx.data,
        fee: { type: 'level', config: { feeLevel: 'MEDIUM' } },
      }, apiKey, userToken)

      const challengeId = txResp?.data?.challengeId
      if (!challengeId) throw new Error('no challengeId: ' + JSON.stringify(txResp))
      return new Response(JSON.stringify({ challengeId }), { headers: JSON_HEADERS })
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: JSON_HEADERS })
    }
  }

  return new Response(JSON.stringify({ error: 'unknown action' }), { status: 400, headers: JSON_HEADERS })
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type' },
  })
}
