import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const stockName = searchParams.get('name');

  if (!stockName) {
    return new Response('Stock name is required', { status: 400 });
  }

  try {
    // /api/proxy/stocks/sse -> /stocks/sse로 리라이팅
    // 프록시 경로에서 /api/proxy 부분을 제거하고 Spring Boot로 전달
    const springUrl = `http://localhost:8080/stocks/sse?name=${encodeURIComponent(stockName)}`;
    
    console.log(`[Proxy] Forwarding request: ${request.url} -> ${springUrl}`);
    
    const response = await fetch(springUrl, {
      method: 'GET',
      headers: {
        'Accept': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

    if (!response.ok) {
      throw new Error(`Spring Boot server responded with status: ${response.status}`);
    }

    console.log(`[Proxy] Successfully connected to Spring Boot: ${springUrl}`);

    // SSE 스트림을 클라이언트로 전달
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.error(new Error('No response body'));
          return;
        }

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              console.log(`[Proxy] Stream ended for ${stockName}`);
              break;
            }
            
            // Uint8Array를 문자열로 변환하여 디버깅
            const chunk = new TextDecoder().decode(value);
            console.log(`[Proxy] Received chunk for ${stockName}:`, chunk);
            
            // 데이터를 그대로 전달
            controller.enqueue(value);
          }
        } catch (error) {
          console.error(`[Proxy] Stream error for ${stockName}:`, error);
          controller.error(error);
        } finally {
          reader.releaseLock();
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control',
      },
    });

  } catch (error) {
    console.error(`[Proxy] Error connecting to Spring Boot for ${stockName}:`, error);
    return new Response(
      `Error connecting to Spring Boot server: ${error instanceof Error ? error.message : 'Unknown error'}`,
      { status: 500 }
    );
  }
} 