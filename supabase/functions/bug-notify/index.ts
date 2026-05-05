// @ts-nocheck
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

const DISCORD_WEBHOOK_URL = Deno.env.get('DISCORD_BUG_WEBHOOK_URL')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { record } = await req.json() // Webhook payload from Supabase
    
    if (!record) throw new Error('No record found')

    // 1. Prepare Discord Message
    const discordMessage = {
      embeds: [{
        title: `🐛 New Bug Report: ${record.title}`,
        color: record.severity === 'critical' ? 0x8B5CF6 : (record.severity === 'high' ? 0xEF4444 : 0xF59E0B),
        fields: [
          { name: 'Category', value: record.category, inline: true },
          { name: 'Severity', value: record.severity, inline: true },
          { name: 'Status', value: record.status, inline: true },
          { name: 'Description', value: record.description },
          { name: 'Steps', value: record.steps_to_reproduce || 'N/A' },
          { name: 'Device', value: `${record.device_info.brand} ${record.device_info.model} (${record.device_info.os} ${record.device_info.osVersion})` },
          { name: 'User Email', value: record.email || 'Anonymous' }
        ],
        timestamp: new Date().toISOString()
      }]
    }

    // 2. Send to Discord
    if (DISCORD_WEBHOOK_URL !== 'REPLACE_WITH_YOUR_DISCORD_WEBHOOK_URL') {
      await fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(discordMessage)
      })
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
