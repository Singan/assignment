import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const stockName = searchParams.get('name');

  if (!stockName) {
    return new Response('Stock name is required', { status: 400 });
  }

  try {
    const springUrl = `http://localhost:8080/stocks/sse?name=${stockName}`;
    
    console.log(`[Proxy] Connecting to Spring Boot: ${springUrl}`);
    console.log(`[Proxy] Stock name: "${stockName}"`);
    
    const response = await fetch(springUrl, {
      method: 'GET',
      headers: {
        'Accept': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

    if (!response.ok) {
      console.error(`[Proxy] Spring Boot error: ${response.status} ${response.statusText}`);
      return new Response(
        `Spring Boot server error: ${response.status}`,
        { status: response.status }
      );
    }

    console.log(`[Proxy] Successfully connected to Spring Boot for ${stockName}`);

    // Spring Boot의 응답을 그대로 전달
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control',
        ...Object.fromEntries(response.headers.entries()),
      },
    });

  } catch (error) {
    console.error(`[Proxy] Connection error for ${stockName}:`, error);
    return new Response(
      `Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      { status: 500 }
    );
  }
} 