const CIRCLE_API = 'https://api.circle.com/v1/w3s';

async function circlePost(path, body, apiKey) {
  const res = await fetch(`${CIRCLE_API}${path}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function onRequestPost(ctx) {
  const apiKey = ctx.env.API_KEY || ctx.env.CIRCLE_API_KEY;
  const { email } = await ctx.request.json();

  if (!email) {
    return new Response(JSON.stringify({ error: 'email required' }), { status: 400 });
  }

  const userId = email.toLowerCase().trim();

  await circlePost('/users', { userId }, apiKey);

  const tokenData = await circlePost('/users/token', { userId }, apiKey);

  if (tokenData.code) {
    return new Response(JSON.stringify({ error: tokenData.message }), { status: 400 });
  }

  return new Response(JSON.stringify({
    userToken: tokenData.data.userToken,
    encryptionKey: tokenData.data.encryptionKey,
  }), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
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
