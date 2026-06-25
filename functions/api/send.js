const CIRCLE_API = 'https://api.circle.com/v1/w3s'

// ERC-20 transfer ABI function signature
const TRANSFER_SIG = 'transfer(address,uint256)'

// Token contract addresses on Arc Testnet
const TOKEN_CONTRACTS = {
  USDC:   { address: '0x3600000000000000000000000000000000000000', decimals: 6 },
  EURC:   { address: '0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a', decimals: 6 },
  cirBTC: { address: '0xf0c4a4ce82a5746abaad9425360ab04fbba432bf', decimals: 8 },
}

async function circleReq(method, path, body, apiKey, userToken) {
  const headers = { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' }
  if (userToken) headers['X-User-Token'] = userToken
  const res = await fetch(`${CIRCLE_API}${path}`, {
    method, headers, body: body ? JSON.stringify(body) : undefined,
  })
  return res.json()
}

const JSON_HEADERS = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }

export async function onRequestPost(ctx) {
  const apiKey = ctx.env.API_KEY || ctx.env.CIRCLE_API_KEY
  const { userToken, walletId, toAddress, token, amountDecimal } = await ctx.request.json()

  if (!userToken || !walletId || !toAddress || !token || !amountDecimal) {
    return new Response(JSON.stringify({ error: 'missing params' }), { status: 400, headers: JSON_HEADERS })
  }

  const tokenInfo = TOKEN_CONTRACTS[token]
  if (!tokenInfo) return new Response(JSON.stringify({ error: 'unknown token' }), { status: 400, headers: JSON_HEADERS })

  // Convert decimal amount to smallest unit (uint256)
  const amountRaw = BigInt(Math.round(parseFloat(amountDecimal) * Math.pow(10, tokenInfo.decimals))).toString()

  const txResp = await circleReq('POST', '/user/transactions/contractExecution', {
    idempotencyKey: crypto.randomUUID(),
    walletId,
    contractAddress: tokenInfo.address,
    abiFunctionSignature: TRANSFER_SIG,
    abiParameters: [toAddress, amountRaw],
    fee: { type: 'level', config: { feeLevel: 'MEDIUM' } },
  }, apiKey, userToken)

  const challengeId = txResp?.data?.challengeId
  if (!challengeId) return new Response(JSON.stringify({ error: 'no challengeId', detail: txResp }), { status: 500, headers: JSON_HEADERS })

  return new Response(JSON.stringify({ challengeId }), { headers: JSON_HEADERS })
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
