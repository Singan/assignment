import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Spring Boot 서버 상태 확인
    // /api/proxy/stocks/sse -> /stocks/sse로 리라이팅하여 상태 확인
    const springUrl = 'http://localhost:8080/stocks/sse?name=test';
    
    console.log(`[Status] Checking Spring Boot server status: ${springUrl}`);
    
    const springResponse = await fetch(springUrl, {
      method: 'GET',
      headers: {
        'Accept': 'text/event-stream',
      },
    });

    const springStatus = springResponse.ok ? 'connected' : 'disconnected';
    
    console.log(`[Status] Spring Boot server status: ${springStatus}`);

    return NextResponse.json({
      status: 'success',
      proxy: {
        status: 'running',
        port: 3001,
        timestamp: new Date().toISOString(),
      },
      springBoot: {
        status: springStatus,
        url: 'http://localhost:8080',
        responseStatus: springResponse.status,
      },
      endpoints: {
        test: '/api/test',
        sse: '/api/proxy/stocks/sse?name={stockName}',
        status: '/api/proxy/status',
      },
      routing: {
        description: '/api/proxy/stocks/sse -> /stocks/sse (Spring Boot)',
        example: 'http://localhost:3001/api/proxy/stocks/sse?name=삼성전자 -> http://localhost:8080/stocks/sse?name=삼성전자'
      }
    });

  } catch (error) {
    console.error('[Status] Error checking Spring Boot status:', error);
    return NextResponse.json({
      status: 'error',
      proxy: {
        status: 'running',
        port: 3001,
        timestamp: new Date().toISOString(),
      },
      springBoot: {
        status: 'error',
        url: 'http://localhost:8080',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      endpoints: {
        test: '/api/test',
        sse: '/api/proxy/stocks/sse?name={stockName}',
        status: '/api/proxy/status',
      },
      routing: {
        description: '/api/proxy/stocks/sse -> /stocks/sse (Spring Boot)',
        example: 'http://localhost:3001/api/proxy/stocks/sse?name=삼성전자 -> http://localhost:8080/stocks/sse?name=삼성전자'
      }
    }, { status: 500 });
  }
} 