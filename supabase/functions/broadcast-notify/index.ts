// @ts-nocheck
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req: Request) => {
  // Handle CORS
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    // 1. Get notification details from request body
    const { title, body, data = {} } = await req.json()

    if (!title || !body) {
      throw new Error('Title and Body are required for broadcast.')
    }

    // 2. Initialize Supabase Admin Client (to bypass RLS and see all tokens)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 3. Fetch all users who have a push token
    const { data: profiles, error: dbError } = await supabaseAdmin
      .from('profiles')
      .select('push_token')
      .not('push_token', 'is', null)
      .neq('push_token', '')

    if (dbError) throw dbError

    const tokens = profiles.map(p => p.push_token)
    
    if (tokens.length === 0) {
      return new Response(JSON.stringify({ message: 'No users with push tokens found.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // 4. Prepare messages for Expo Push API
    // Expo allows up to 100 messages per request, so we chunk them
    const messages = tokens.map(token => ({
      to: token,
      sound: 'default',
      title: title,
      body: body,
      data: data,
      channelId: 'default',
    }))

    // 5. Send to Expo
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip, deflate',
      },
      body: JSON.stringify(messages),
    })

    const result = await response.json()

    return new Response(
      JSON.stringify({ 
        success: true, 
        usersCount: tokens.length,
        expoResponse: result 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
