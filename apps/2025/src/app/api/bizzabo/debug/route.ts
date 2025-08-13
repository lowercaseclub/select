import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Check environment variables
    const envCheck = {
      BIZZABO_CLIENT_ID: !!process.env.BIZZABO_CLIENT_ID,
      BIZZABO_CLIENT_SECRET: !!process.env.BIZZABO_CLIENT_SECRET,
      BIZZABO_ACCOUNT_ID: !!process.env.BIZZABO_ACCOUNT_ID,
      BIZZABO_API_KEY: !!process.env.BIZZABO_API_KEY,
      BIZZABO_EVENT_ID: !!process.env.BIZZABO_EVENT_ID,
    };

    // Test OAuth authentication
    let oauthResponse = null;
    let oauthError = null;

    try {
      const clientId = process.env.BIZZABO_CLIENT_ID;
      const clientSecret = process.env.BIZZABO_CLIENT_SECRET;
      const accountId = process.env.BIZZABO_ACCOUNT_ID;

      if (clientId && clientSecret && accountId) {
        // Try OAuth first
        const tokenResponse = await fetch(
          "https://auth.bizzabo.com/oauth/token",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              client_id: clientId,
              client_secret: clientSecret,
              audience: "https://api.bizzabo.com/api",
              grant_type: "client_credentials",
              account_id: parseInt(accountId),
            }),
          }
        );

        if (tokenResponse.ok) {
          const tokenData = await tokenResponse.json();

          // Now test the API with the token
          const apiResponse = await fetch("https://api.bizzabo.com/v1/events", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${tokenData.access_token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          });

          if (apiResponse.ok) {
            oauthResponse = await apiResponse.json();
          } else {
            oauthError = {
              status: apiResponse.status,
              statusText: apiResponse.statusText,
              text: await apiResponse.text(),
            };
          }
        } else {
          oauthError = {
            status: tokenResponse.status,
            statusText: tokenResponse.statusText,
            text: await tokenResponse.text(),
          };
        }
      }
    } catch (error) {
      oauthError = {
        message: error instanceof Error ? error.message : "Unknown error",
      };
    }

    return NextResponse.json({
      environment: envCheck,
      oauth: {
        success: !!oauthResponse,
        response: oauthResponse,
        error: oauthError,
      },
    });
  } catch (error) {
    console.error("Debug endpoint error:", error);
    return NextResponse.json(
      {
        error: "Debug endpoint failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
