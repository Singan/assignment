import { NextRequest, NextResponse } from 'next/server';

// CORS 헤더 설정
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Allow-Credentials': 'true',
};

// OPTIONS 요청 처리 (CORS preflight)
export async function OPTIONS(request: NextRequest) {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}

// GET 요청 처리
export async function GET(request: NextRequest) {
  return handleProxyRequest(request, 'GET');
}

// POST 요청 처리
export async function POST(request: NextRequest) {
  return handleProxyRequest(request, 'POST');
}

// PUT 요청 처리
export async function PUT(request: NextRequest) {
  return handleProxyRequest(request, 'PUT');
}

// DELETE 요청 처리
export async function DELETE(request: NextRequest) {
  return handleProxyRequest(request, 'DELETE');
}

// PATCH 요청 처리
export async function PATCH(request: NextRequest) {
  return handleProxyRequest(request, 'PATCH');
}

async function handleProxyRequest(request: NextRequest, method: string) {
  try {
    const { searchParams } = new URL(request.url);
    const targetUrl = searchParams.get('url');

    if (!targetUrl) {
      return NextResponse.json(
        {
          error: 'URL 매개변수가 필요합니다',
          usage: '/api/proxy?url=<target_url>',
        },
        { 
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    // URL 유효성 검사
    try {
      new URL(targetUrl);
    } catch (error) {
      return NextResponse.json(
        {
          error: '잘못된 URL 형식입니다',
          provided: targetUrl,
        },
        { 
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    // 원본 요청의 헤더 복사 (민감한 헤더 제외)
    const proxyHeaders: HeadersInit = {};
    const excludeHeaders = ['host', 'origin', 'referer', 'cookie'];
    
    request.headers.forEach((value, key) => {
      if (!excludeHeaders.includes(key.toLowerCase())) {
        proxyHeaders[key] = value;
      }
    });

    // 요청 본문 처리
    let body: string | undefined;
    if (method !== 'GET' && request.body) {
      body = await request.text();
    }

    console.log(`프록시 요청: ${method} -> ${targetUrl}`);

    // 프록시 요청 실행
    const response = await fetch(targetUrl, {
      method: method,
      headers: proxyHeaders,
      body: body,
    });

    // 응답 헤더 복사 (CORS 관련 헤더 제외)
    const responseHeaders = new Headers(corsHeaders);
    const excludeResponseHeaders = [
      'access-control-allow-origin',
      'access-control-allow-methods',
      'access-control-allow-headers',
      'access-control-allow-credentials',
    ];

    response.headers.forEach((value, key) => {
      if (!excludeResponseHeaders.includes(key.toLowerCase())) {
        responseHeaders.set(key, value);
      }
    });

    const responseBody = await response.text();
    
    console.log(`프록시 응답: ${response.status} for ${targetUrl}`);

    return new Response(responseBody, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });

  } catch (error) {
    console.error('프록시 에러:', error);
    
    return NextResponse.json(
      {
        error: '프록시 요청 실패',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { 
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}