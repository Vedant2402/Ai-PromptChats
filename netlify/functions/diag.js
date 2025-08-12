// Diagnostics Netlify Function
export async function handler() {
  const apiKey = process.env.OPENAI_API_KEY;
  return {
    statusCode: 200,
    body: JSON.stringify({ hasKey: Boolean(apiKey), keyLength: apiKey ? apiKey.length : 0, runtime: process.version })
  };
}
