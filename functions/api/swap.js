// Worker chỉ làm 1 việc: nhận calldata từ App Kit (browser) → tạo Circle contractExecution challenge
const W3S_API = 'https://api.circle.com/v1/w3s'
const JSON_HEADERS = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }

export async function onRequestPost(ctx) {
  const apiKey = ctx.env.API_KEY || ctx.env.CIRCLE_API_KEY
  const { action, userToken, walletId, contractAddress, callData } = await ctx.request.json()

  if (action !== 'challenge') return new Response(JSON.stringify({ error: 'unknown action' }), { status: 400, headers: JSON_HEADERS })
  if (!userToken || !walletId || !contractAddress || !callData) return new Response(JSON.stringify({ error: 'missing params' }), { status: 400, headers: JSON_HEADERS })

  const headers = { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'X-User-Token': userToken }
  const res = await fetch(`${W3S_API}/user/transactions/contractExecution`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      idempotencyKey: crypto.randomUUID(),
      walletId, contractAddress, callData,
      fee: { type: 'level', config: { feeLevel: 'MEDIUM' } },
    }),
  })
  const data = await res.json()
  const challengeId = data?.data?.challengeId
  if (!challengeId) return new Response(JSON.stringify({ error: 'no challengeId', detail: data }), { status: 500, headers: JSON_HEADERS })
  return new Response(JSON.stringify({ challengeId }), { headers: JSON_HEADERS })
}

export async function onRequestOptions() {
  return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type' } })
}
