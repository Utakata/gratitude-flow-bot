import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const CHANNEL_ID = Deno.env.get('LINE_CHANNEL_ID')
const CHANNEL_SECRET = Deno.env.get('LINE_CHANNEL_SECRET')

serve(async (req) => {
  try {
    const { code, redirectUri } = await req.json()

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
        client_id: CHANNEL_ID!,
        client_secret: CHANNEL_SECRET!,
      }),
    })

    if (!tokenResponse.ok) {
      throw new Error('Failed to get access token')
    }

    const tokenData = await tokenResponse.json()

    // Get user profile using access token
    const profileResponse = await fetch('https://api.line.me/v2/profile', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })

    if (!profileResponse.ok) {
      throw new Error('Failed to get user profile')
    }

    const profileData = await profileResponse.json()

    return new Response(
      JSON.stringify({
        user: {
          id: profileData.userId,
          displayName: profileData.displayName,
          pictureUrl: profileData.pictureUrl,
        },
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }
})