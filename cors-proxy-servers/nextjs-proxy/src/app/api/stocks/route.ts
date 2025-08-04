import { NextRequest, NextResponse } from 'next/server';

// Spring Boot API 서버 설정
const SPRING_BOOT_BASE_URL = process.env.SPRING_BOOT_URL || 'http://localhost:8080';

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

// GET 요청 처리 - 주식 스트리밍
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const stockName = searchParams.get('name');

    if (!stockName) {
      return NextResponse.json(
        {
          error: 'name 매개변수가 필요합니다',
          usage: '/api/stocks?name=<stock_name>',
          example: '/api/stocks?name=AAPL',
        },
        { 
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    const targetUrl = `${SPRING_BOOT_BASE_URL}/stocks?name=${encodeURIComponent(stockName)}`;
    
    console.log(`Stock 프록시 요청: GET -> ${targetUrl}`);

    // Spring Boot API 호출
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Accept': 'text/event-stream',
        'Cache-Control': 'no-cache',
      },
    });

    if (!response.ok) {
      throw new Error(`Spring Boot API 응답 에러: ${response.status} ${response.statusText}`);
    }

    // SSE 스트림을 그대로 전달
    const responseHeaders = new Headers(corsHeaders);
    responseHeaders.set('Content-Type', 'text/event-stream');
    responseHeaders.set('Cache-Control', 'no-cache');
    responseHeaders.set('Connection', 'keep-alive');

    console.log(`Stock 프록시 응답: ${response.status} for ${stockName}`);

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });

  } catch (error) {
    console.error('Stock 프록시 에러:', error);
    
    return NextResponse.json(
      {
        error: 'Spring Boot API 연결 실패',
        message: error instanceof Error ? error.message : 'Unknown error',
        springBootUrl: SPRING_BOOT_BASE_URL,
      },
      { 
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}

// POST 요청 처리 - 주식 저장
export async function POST(request: NextRequest) {
  try {
    const targetUrl = `${SPRING_BOOT_BASE_URL}/stocks`;
    
    console.log(`Stock 프록시 요청: POST -> ${targetUrl}`);

    // 요청 본문 가져오기
    const body = await request.text();

    // Spring Boot API 호출
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: body,
    });

    const responseText = await response.text();
    
    // 응답 헤더 설정
    const responseHeaders = new Headers(corsHeaders);
    responseHeaders.set('Content-Type', 'application/json');

    console.log(`Stock 프록시 응답: ${response.status} for POST /stocks`);

    return new Response(responseText, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });

  } catch (error) {
    console.error('Stock POST 프록시 에러:', error);
    
    return NextResponse.json(
      {
        error: 'Spring Boot API 연결 실패',
        message: error instanceof Error ? error.message : 'Unknown error',
        springBootUrl: SPRING_BOOT_BASE_URL,
      },
      { 
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}