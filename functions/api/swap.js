import { AppKit } from '@circle-fin/app-kit';
import { ViemAdapter } from '@circle-fin/adapter-viem-v2';
import { createPublicClient, http } from 'viem';

const CIRCLE_API = 'https://api.circle.com/v1/w3s';

const arcTestnet = {
  id: 5042002,
  name: 'Arc Testnet',
  nativeCurrency: { name: 'USDC', symbol: 'USDC', decimals: 18 },
  rpcUrls: { default: { http: ['https://rpc.testnet.arc.network'] } },
};

const JSON_HEADERS = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };

async function circleReq(method, path, body, apiKey, userToken) {
  const headers = { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' };
  if (userToken) headers['X-User-Token'] = userToken;
  const res = await fetch(`${CIRCLE_API}${path}`, {
    method, headers, body: body ? JSON.stringify(body) : undefined,
  });
  return res.json();
}

export async function onRequestPost(ctx) {
  const apiKey = ctx.env.API_KEY || ctx.env.CIRCLE_API_KEY;
  const kitKey = ctx.env.KIT_KEY;
  const { action, userToken, walletId, walletAddress, tokenIn, tokenOut, amountIn } = await ctx.request.json();

  if (!userToken) return new Response(JSON.stringify({ error: 'userToken required' }), { status: 400, headers: JSON_HEADERS });

  if (action === 'estimate') {
    try {
      const kit = new AppKit();
      const publicClient = createPublicClient({ chain: arcTestnet, transport: http() });
      const adapter = new ViemAdapter({
        getPublicClient: () => publicClient,
        getWalletClient: () => ({ account: { address: walletAddress }, chain: arcTestnet }),
      });
      const estimate = await kit.estimateSwap({
        from: { adapter, chain: 'Arc_Testnet', address: walletAddress },
        tokenIn, tokenOut, amountIn,
        config: { kitKey, slippageBps: 300 },
      });
      return new Response(JSON.stringify({ estimate }), { headers: JSON_HEADERS });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: JSON_HEADERS });
    }
  }

  if (action === 'execute') {
    try {
      const kit = new AppKit();
      const publicClient = createPublicClient({ chain: arcTestnet, transport: http() });
      let capturedTx = null;

      // Custom wallet client that captures calldata instead of signing
      const captureClient = {
        account: { address: walletAddress },
        chain: arcTestnet,
        sendTransaction: async (params) => { capturedTx = params; throw new Error('CAPTURE_DONE'); },
        writeContract: async (params) => { capturedTx = params; throw new Error('CAPTURE_DONE'); },
        signTypedData: async () => '0x',
        signMessage: async () => '0x',
        getChainId: async () => arcTestnet.id,
      };

      const adapter = new ViemAdapter({
        getPublicClient: () => publicClient,
        getWalletClient: () => captureClient,
      });

      try {
        await kit.swap({
          from: { adapter, chain: 'Arc_Testnet', address: walletAddress },
          tokenIn, tokenOut, amountIn,
          config: { kitKey, slippageBps: 300 },
        });
      } catch (e) {
        if (!capturedTx) throw e;
      }

      if (!capturedTx) return new Response(JSON.stringify({ error: 'Could not capture swap tx' }), { status: 500, headers: JSON_HEADERS });

      // Create user contractExecution challenge
      const to = capturedTx.to || capturedTx.address;
      const data = capturedTx.data || capturedTx.callData;
      const txResp = await circleReq('POST', '/user/transactions/contractExecution', {
        idempotencyKey: crypto.randomUUID(),
        walletId,
        contractAddress: to,
        callData: data,
        fee: { type: 'level', config: { feeLevel: 'MEDIUM' } },
      }, apiKey, userToken);

      const challengeId = txResp?.data?.challengeId;
      if (!challengeId) return new Response(JSON.stringify({ error: 'No challengeId', detail: txResp }), { status: 500, headers: JSON_HEADERS });
      return new Response(JSON.stringify({ challengeId }), { headers: JSON_HEADERS });

    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: JSON_HEADERS });
    }
  }

  return new Response(JSON.stringify({ error: 'unknown action' }), { status: 400, headers: JSON_HEADERS });
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
