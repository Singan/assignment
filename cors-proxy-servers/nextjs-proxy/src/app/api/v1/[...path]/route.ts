import { NextRequest, NextResponse } from 'next/server';

const API_V1_TARGET = process.env.API_V1_TARGET || 'https://jsonplaceholder.typicode.com';

// CORS 헤더 설정
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Allow-Credentials': 'true',
};

export async function OPTIONS(request: NextRequest) {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleProxyRequest(request, 'GET', params.path);
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleProxyRequest(request, 'POST', params.path);
}

export async function PUT(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleProxyRequest(request, 'PUT', params.path);
}

export async function DELETE(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleProxyRequest(request, 'DELETE', params.path);
}

export async function PATCH(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleProxyRequest(request, 'PATCH', params.path);
}

async function handleProxyRequest(request: NextRequest, method: string, path: string[]) {
  try {
    // 대상 URL 구성
    const targetPath = path.join('/');
    const url = new URL(request.url);
    const queryString = url.search;
    const targetUrl = `${API_V1_TARGET}/${targetPath}${queryString}`;

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

    console.log(`API v1 프록시 요청: ${method} -> ${targetUrl}`);

    // 프록시 요청 실행
    const response = await fetch(targetUrl, {
      method: method,
      headers: proxyHeaders,
      body: body,
    });

    // 응답 헤더 복사
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
    
    console.log(`API v1 프록시 응답: ${response.status} for ${targetUrl}`);

    return new Response(responseBody, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });

  } catch (error) {
    console.error('API v1 프록시 에러:', error);
    
    return NextResponse.json(
      {
        error: 'API v1 프록시 요청 실패',
        message: error instanceof Error ? error.message : 'Unknown error',
        target: API_V1_TARGET,
      },
      { 
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}