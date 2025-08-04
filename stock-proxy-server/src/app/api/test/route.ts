import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Spring Boot 서버 연결 테스트
    // /api/proxy/stocks/sse -> /stocks/sse로 리라이팅하여 테스트
    const springUrl = 'http://localhost:8080/stocks/sse?name=삼성전자';
    
    console.log(`[Test] Testing connection to Spring Boot: ${springUrl}`);
    
    const response = await fetch(springUrl, {
      method: 'GET',
      headers: {
        'Accept': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

    if (response.ok) {
      console.log(`[Test] Successfully connected to Spring Boot`);
      return NextResponse.json({
        status: 'success',
        message: 'Spring Boot server is connected',
        springBootUrl: springUrl,
        proxyUrl: 'http://localhost:3001/api/proxy/stocks/sse?name=삼성전자',
        timestamp: new Date().toISOString(),
      });
    } else {
      console.log(`[Test] Spring Boot server responded with status: ${response.status}`);
      return NextResponse.json({
        status: 'error',
        message: 'Spring Boot server is not responding',
        statusCode: response.status,
        timestamp: new Date().toISOString(),
      }, { status: 503 });
    }

  } catch (error) {
    console.error('[Test] Connection test error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Failed to connect to Spring Boot server',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
} 