# Next.js CORS 프록시 서버

CORS 문제를 해결하기 위한 Next.js API Routes 기반 프록시 서버입니다.

## 특징

- ✅ Next.js 14 App Router 사용
- 🔄 API Routes를 이용한 서버사이드 프록시
- 🏢 Spring Boot API 전용 엔드포인트 제공
- 📊 Server-Sent Events (SSE) 스트리밍 지원
- 🌐 범용 프록시 기능
- 🎨 Tailwind CSS를 사용한 테스트 UI
- 📱 반응형 웹 인터페이스
- ⚙️ 환경 변수를 통한 설정
- 🚀 Vercel 등 서버리스 플랫폼 배포 가능

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.local.example .env.local

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build
npm start
```

## 사용법

### 1. 웹 인터페이스 사용

브라우저에서 `http://localhost:3001`에 접속하여 웹 인터페이스를 통해 프록시 기능을 테스트할 수 있습니다.

### 2. API 직접 호출

#### 범용 프록시

```javascript
// 임의의 URL에 대한 프록시
const targetUrl = 'https://api.github.com/users/octocat';
const response = await fetch(`/api/proxy?url=${encodeURIComponent(targetUrl)}`);
const data = await response.json();
```

#### 사전 정의된 API 프록시

```javascript
// JSONPlaceholder API 프록시
const response = await fetch('/api/v1/posts/1');
const data = await response.json();
```

#### Spring Boot Stock API 프록시

```javascript
// 주식 스트리밍 데이터 받기
const response = await fetch('/api/stocks?name=AAPL');
const reader = response.body.getReader();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = new TextDecoder().decode(value);
  console.log('Stock data:', chunk);
}

// 주식 데이터 저장
const saveResponse = await fetch('/api/stocks', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ name: 'AAPL', price: 150.00 }),
});
```

#### 헬스 체크

```javascript
const response = await fetch('/api/health');
const status = await response.json();
```

## API 엔드포인트

| 엔드포인트 | 메서드 | 설명 |
|-----------|-------|------|
| `/api/stocks?name=<stock_name>` | GET | Spring Boot 주식 스트리밍 API |
| `/api/stocks` | POST | Spring Boot 주식 저장 API |
| `/api/health` | GET | 서버 상태 확인 |
| `/api/v1/*` | ALL | API v1 프록시 (JSONPlaceholder) |
| `/api/proxy?url=<target_url>` | ALL | 범용 프록시 |

## 환경 변수

| 변수명 | 설명 | 기본값 |
|--------|------|--------|
| `SPRING_BOOT_URL` | Spring Boot API 서버 URL | http://localhost:8080 |
| `API_V1_TARGET` | API v1 프록시 대상 | https://jsonplaceholder.typicode.com |

## 프로젝트 구조

```
nextjs-proxy/
├── src/
│   └── app/
│       ├── api/
│       │   ├── stocks/
│       │   │   └── route.ts          # Spring Boot Stock API 프록시
│       │   ├── health/
│       │   │   └── route.ts          # 헬스 체크 API
│       │   ├── proxy/
│       │   │   └── route.ts          # 범용 프록시 API
│       │   └── v1/
│       │       └── [...path]/
│       │           └── route.ts      # API v1 프록시
│       ├── page.tsx                  # 메인 페이지 (테스트 UI)
│       ├── layout.tsx
│       └── globals.css
├── .env.local.example
├── package.json
└── README.md
```

## 배포

### Vercel 배포

```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel

# 환경 변수 설정
vercel env add SPRING_BOOT_URL
vercel env add API_V1_TARGET
```

### 기타 플랫폼

Next.js는 다양한 플랫폼에 배포할 수 있습니다:
- Netlify
- AWS Amplify
- Railway
- Render
- Heroku

## 보안 고려사항

1. **허용된 도메인 제한**: 프로덕션에서는 특정 도메인만 프록시하도록 제한
2. **Rate Limiting**: API 요청 제한 구현
3. **입력 검증**: URL 유효성 검사 강화
4. **로깅**: 요청/응답 로깅으로 모니터링
5. **HTTPS**: HTTPS를 통한 안전한 통신

## 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **API**: Next.js API Routes
- **Deployment**: Vercel (권장)

## 문제 해결

### 일반적인 문제들

1. **CORS 에러가 여전히 발생하는 경우**
   - 프록시 서버가 올바르게 실행되고 있는지 확인
   - 요청 URL이 올바른지 확인

2. **프록시 대상 서버에서 403/404 에러**
   - 대상 서버의 API 키나 인증이 필요한지 확인
   - 요청 헤더가 올바르게 전달되고 있는지 확인

3. **환경 변수가 적용되지 않는 경우**
   - `.env.local` 파일이 프로젝트 루트에 있는지 확인
   - 서버를 재시작했는지 확인
