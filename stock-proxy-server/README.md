# 🌐 Next.js 프록시 서버

Spring Boot SSE API와 React 프론트엔드 간의 CORS 문제를 해결하는 Next.js 프록시 서버입니다. 실시간 주식 정보 스트리밍을 위한 중간 서버 역할을 합니다.

## 🎯 주요 기능

### 📡 SSE 프록시
- **Spring Boot SSE API 프록시**: `/stocks/sse?name={name}` API를 프록시
- **실시간 스트리밍**: Server-Sent Events 데이터를 실시간으로 전달
- **CORS 해결**: 크로스 오리진 요청 문제 완전 해결

### 🔗 API 요청 처리
- **URL 리라이팅**: `/api/proxy/stocks/sse` → `/stocks/sse`
- **파라미터 전달**: 쿼리 파라미터를 그대로 Spring Boot로 전달
- **에러 처리**: 연결 실패 시 적절한 에러 응답

### 🧪 연결 테스트
- **서버 상태 확인**: Spring Boot 서버 연결 상태 모니터링
- **응답 시간 측정**: API 응답 시간 측정
- **실시간 모니터링**: 프록시 서버 상태 실시간 확인

### 🔄 SSE 연결 관리
- **연결 제어**: 주식 전환 시 기존 연결 자동 해제
- **상태 모니터링**: 각 주식별 연결 상태 실시간 추적
- **메모리 관리**: 연결 해제 시 메모리 누수 방지

## 🛠️ 기술 스택

### Backend
- **Next.js 15**: App Router 기반 API 서버
- **TypeScript**: 타입 안정성 보장
- **Node.js**: 서버 런타임

### API 처리
- **Server-Sent Events**: 실시간 스트리밍 지원
- **CORS 처리**: 크로스 오리진 요청 해결
- **스트림 프록시**: SSE 데이터 스트림 처리

## 📊 서버 구성도

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React App     │    │   Next.js       │    │   Spring Boot   │
│   (포트: 3000)  │◄──►│   (포트: 3001)  │◄──►│   (포트: 8080)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔗 URL 구조

### 1. React 프론트엔드 (포트: 3000)
```
http://localhost:3000
├── / (메인 페이지)
└── 실시간 주식 대시보드
```

### 2. Next.js 프록시 서버 (포트: 3001)
```
http://localhost:3001
├── /api/proxy/stocks/sse    # Spring Boot SSE 프록시
├── /api/test               # 연결 테스트 API
└── / (프록시 서버 상태 페이지)
```

### 3. Spring Boot 서버 (포트: 8080)
```
http://localhost:8080
└── /stocks/sse?name={name}  # SSE 스트리밍 (유일한 API)
```

## 📁 프로젝트 구조

```
stock-proxy-server/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── proxy/
│   │   │   │   └── stocks/
│   │   │   │       └── sse/
│   │   │   │           └── route.ts    # SSE 프록시 API
│   │   │   └── test/
│   │   │       └── route.ts            # 연결 테스트 API
│   │   ├── page.tsx                    # 메인 페이지
│   │   └── layout.tsx
│   └── components/
│       ├── ProxyStatus.tsx             # 프록시 상태 컴포넌트
│       └── StockMonitor.tsx            # 주식 모니터링 컴포넌트
├── next.config.js                      # Next.js 설정
├── package.json
└── README.md
```

## 📊 모니터링 가능한 주식

- 삼성전자
- LG
- SK

## 🚀 설치 및 실행

### 1. 프로젝트 클론
```bash
git clone [repository-url]
cd stock-proxy-server
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 개발 서버 실행
```bash
npm run dev
```

### 4. 브라우저에서 확인
```
http://localhost:3001
```

## 🔄 API 요청 처리 플로우

### 1. 프론트엔드 요청
```javascript
// React App에서 프록시로 요청
const eventSource = new EventSource('http://localhost:3001/api/proxy/stocks/sse?name=삼성');
```

### 2. 프록시 서버 처리
```javascript
// Next.js에서 /api/proxy/stocks/sse 요청을 받음
// → /api 부분을 제거하고 Spring Boot로 전달
// → http://localhost:8080/stocks/sse?name=삼성
```

### 3. Spring Boot 응답
```javascript
// Spring Boot에서 SSE 스트림 응답
// → Next.js 프록시가 스트림을 받아서
// → 프론트엔드로 그대로 전달
```

## 🔄 SSE 연결 관리 시스템

### 연결 관리 방식

#### 1. 수동 연결 해제
```javascript
// 기존 연결을 명시적으로 끊고 새 연결 생성
const switchStock = (fromStock, toStock) => {
  // 1. 기존 연결 해제
  if (eventSources[fromStock]) {
    eventSources[fromStock].close();
    addLog('info', `${fromStock} SSE 연결 해제`);
  }
  
  // 2. 새 연결 생성
  startStockMonitoring(toStock);
  addLog('info', `${toStock} SSE 연결 시작`);
};
```

#### 2. 자동 연결 관리
```javascript
// 한 번에 하나의 주식만 모니터링하는 시스템
const [currentStock, setCurrentStock] = useState(null);
const [currentEventSource, setCurrentEventSource] = useState(null);

const switchToStock = (newStock) => {
  // 기존 연결 해제
  if (currentEventSource) {
    currentEventSource.close();
    addLog('info', `${currentStock} SSE 연결 해제`);
  }
  
  // 새 연결 생성
  const eventSource = new EventSource(`/api/proxy/stocks/sse?name=${newStock}`);
  setCurrentEventSource(eventSource);
  setCurrentStock(newStock);
  
  addLog('info', `${newStock} SSE 연결 시작`);
};
```

### 연결 상태 추적
```javascript
const [activeConnections, setActiveConnections] = useState({
  '삼성': null,
  'LG': null,
  'SK': null
});

const [connectionStatus, setConnectionStatus] = useState({
  '삼성': 'disconnected',
  'LG': 'disconnected',
  'SK': 'disconnected'
});
```

## ⚙️ 설정 파일

### next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: 'http://localhost:8080/:path*',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

### package.json
```json
{
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "next build",
    "start": "next start -p 3001"
  }
}
```

## 📡 SSE 프록시 API

### GET /api/proxy/stocks/sse
Spring Boot의 SSE API를 프록시하는 엔드포인트

#### 요청 파라미터
- `name` (필수): 주식명 (예: 삼성, LG, SK)

#### 요청 예시
```
GET http://localhost:3001/api/proxy/stocks/sse?name=삼성
```

#### 응답
- **Content-Type**: `text/event-stream`
- **Connection**: `keep-alive`
- **실시간 스트리밍 데이터**

#### 에러 응답
```json
{
  "error": "name parameter is required"
}
```

## 🧪 테스트 API

### GET /api/test
Spring Boot 서버 연결 상태를 확인하는 테스트 API

#### 요청 예시
```
GET http://localhost:3001/api/test
```

#### 성공 응답
```json
{
  "status": "success",
  "message": "Spring Boot server is connected",
  "springBootUrl": "http://localhost:8080/stocks/sse?name=삼성",
  "proxyUrl": "http://localhost:3001/api/proxy/stocks/sse?name=삼성",
  "timestamp": "2024-12-19T10:30:00.000Z"
}
```

#### 실패 응답
```json
{
  "status": "error",
  "message": "Spring Boot server is not responding",
  "statusCode": 503,
  "timestamp": "2024-12-19T10:30:00.000Z"
}
```

## 🌐 CORS 해결 방안

### 1. Next.js API Routes CORS 헤더
```javascript
headers: {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}
```

### 2. OPTIONS 요청 처리
```javascript
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: CORS_HEADERS
  });
}
```

### 3. next.config.js 전역 설정
```javascript
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: CORS_HEADERS
    }
  ];
}
```

## 🔧 환경 설정

### 필수 요구사항
- **Node.js**: 18.0 이상
- **npm**: 8.0 이상
- **Spring Boot 서버**: 8080 포트에서 실행 중

### 환경 변수
```env
SPRING_BOOT_URL=http://localhost:8080
NEXTJS_PORT=3001
CORS_ORIGIN=http://localhost:3000
```

## 🎯 사용 방법

### 1. 프록시 서버 시작
```bash
npm run dev
```

### 2. Spring Boot 서버 확인
```bash
# Spring Boot 서버가 8080 포트에서 실행 중인지 확인
curl http://localhost:8080/stocks/sse?name=삼성
```

### 3. 프록시 연결 테스트
```bash
# 프록시 서버 연결 테스트
curl http://localhost:3001/api/test
```

### 4. SSE 프록시 테스트
```bash
# 프록시를 통한 SSE 연결 테스트
curl http://localhost:3001/api/proxy/stocks/sse?name=삼성
```

### 5. 주식 모니터링 테스트
```bash
# 브라우저에서 http://localhost:3001 접속
# 연결 확인 버튼 클릭
# 삼성, LG, SK 주식 모니터링 테스트
```

## ⚡ 성능 최적화

### 스트림 처리
- **ReadableStream**: Spring Boot 응답을 스트림으로 처리
- **메모리 효율성**: 대용량 데이터도 효율적으로 처리
- **실시간 전달**: 지연 없는 실시간 데이터 전송

### 에러 처리
- **연결 실패**: Spring Boot 서버 연결 실패 시 적절한 에러 응답
- **타임아웃**: 요청 타임아웃 처리
- **재연결**: 클라이언트 측 재연결 로직 지원

### 연결 관리
- **자동 정리**: 연결 해제 시 메모리 누수 방지
- **상태 추적**: 연결 상태 실시간 모니터링

## 🚀 배포 고려사항

### 프로덕션 환경
- **환경 변수**: 프로덕션 URL 설정
- **로드 밸런싱**: 다중 인스턴스 지원
- **헬스 체크**: `/api/test` 엔드포인트 활용

### 보안
- **CORS 정책**: 프로덕션 환경에 맞는 CORS 설정
- **API 키**: 필요시 인증 추가
- **요청 제한**: Rate Limiting 구현

### 모니터링
- **로그 수집**: API 요청/응답 로그
- **성능 모니터링**: 응답 시간 측정
- **에러 추적**: 에러 발생 시 알림
- **연결 상태**: SSE 연결 상태 모니터링

