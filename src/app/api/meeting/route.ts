// pages/api/token.js
import twilio from 'twilio';
import { NextRequest, NextResponse } from 'next/server';

const AccessToken = twilio.jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

// Twilio credentials
const ACCOUNT_SID = 'AC61f0caff4f9cd420cbd4a1229fc8b6f5';
const API_KEY_SID = 'SKeebf79d8130ad676614497bd62903093';
const API_KEY_SECRET = 'xWyGx1v6ilM2hG5M59FZk92iiOg6oxg0';

export async function GET(req: NextRequest) {
  try {
    // Validate credentials format
    if (!ACCOUNT_SID.startsWith('AC')) {
      throw new Error('Invalid Account SID format');
    }
    if (!API_KEY_SID.startsWith('SK')) {
      throw new Error('Invalid API Key SID format');
    }

    const searchParams = req.nextUrl.searchParams;
    const identity = searchParams.get('identity');

    console.log('Generating token with:', {
      accountSid: ACCOUNT_SID,
      apiKeySid: API_KEY_SID,
      identity: identity || 'Anonymous'
    });

    // Create Video Grant
    const videoGrant = new VideoGrant({
      room: 'MyMeetingRoom'
    });

    // Create an access token which we will sign and return to the client,
    // containing the grant we just created
    const token = new AccessToken(
      ACCOUNT_SID,
      API_KEY_SID,
      API_KEY_SECRET,
      { 
        identity: identity || 'Anonymous',
        ttl: 3600 // 1 hour
      }
    );

    token.addGrant(videoGrant);

    // Serialize the token to a JWT string
    const jwt = token.toJwt();

    // Log the token for debugging (be careful with this in production)
    console.log('Generated JWT:', jwt);

    return NextResponse.json({ 
      token: jwt 
    }, { 
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Token generation error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to generate token',
      details: error instanceof Error ? error.stack : undefined
    }, { 
      status: 500 
    });
  }
}
