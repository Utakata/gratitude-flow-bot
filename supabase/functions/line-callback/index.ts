import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { code, redirectUri } = await req.json()
    console.log('Received code:', code)
    console.log('Redirect URI:', redirectUri)

    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://api.line.me/oauth2/v2.1/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: Deno.env.get('LINE_CHANNEL_ID') || '',
        client_secret: Deno.env.get('LINE_CHANNEL_SECRET') || '',
      }),
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text()
      console.error('Token exchange error:', errorData)
      throw new Error('Failed to exchange authorization code')
    }

    const tokenData = await tokenResponse.json()
    console.log('Token data received')

    // Get user profile using access token
    const profileResponse = await fetch('https://api.line.me/v2/profile', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })

    if (!profileResponse.ok) {
      const errorData = await profileResponse.text()
      console.error('Profile fetch error:', errorData)
      throw new Error('Failed to get user profile')
    }

    const profileData = await profileResponse.json()
    console.log('Profile data received:', profileData.userId)

    return new Response(
      JSON.stringify({
        user: {
          id: profileData.userId,
          displayName: profileData.displayName,
          pictureUrl: profileData.pictureUrl,
        },
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error in line-callback function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})