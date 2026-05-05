// @ts-nocheck
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { provider, model, messages, temperature = 0.7 } = await req.json()

    let apiKey = '';
    let apiUrl = '';

    // Provider Routing Logic
    switch (provider) {
      case 'gemini':
        apiKey = Deno.env.get('GEMINI_API_KEY')
        const geminiModel = model || 'gemini-1.5-flash'
        apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`
        break;
      case 'groq':
        apiKey = Deno.env.get('GROQ_API_KEY')
        apiUrl = 'https://api.groq.com/openai/v1/chat/completions'
        break;
      case 'deepseek':
      case 'openrouter':
        apiKey = Deno.env.get('OPENROUTER_API_KEY')
        apiUrl = 'https://openrouter.ai/api/v1/chat/completions'
        break;
      case 'openai':
        apiKey = Deno.env.get('OPENAI_API_KEY')
        apiUrl = 'https://api.openai.com/v1/chat/completions'
        break;
      default:
        throw new Error(`Unsupported provider: ${provider}`)
    }

    if (!apiKey) throw new Error(`${provider.toUpperCase()} API Key is not set on the server.`)

    // API Call
    let response;
    if (provider === 'gemini') {
      response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: messages.map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }]
          })),
          generationConfig: { temperature, maxOutputTokens: 2048 }
        })
      })
    } else {
      // OpenAI compatible providers (Groq, OpenRouter, OpenAI)
      response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://synapse-ai.app', // Required for OpenRouter
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          temperature: temperature
        })
      })
    }

    const data = await response.json()
    return new Response(JSON.stringify(data), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    })

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    })
  }
})
