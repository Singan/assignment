# Next.js CORS 프록시 서버

CORS (Cross-Origin Resource Sharing) 문제를 해결하기 위한 Next.js 기반 프록시 서버입니다.

## 📁 프로젝트 구조

```
cors-proxy-servers/
├── nextjs-proxy/          # Next.js API Routes 기반 프록시 서버
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/
│   │   │   │   ├── proxy/      # 범용 프록시
│   │   │   │   ├── stocks/     # Spring Boot Stock API 전용 프록시
│   │   │   │   ├── v1/         # JSONPlaceholder API 프록시
│   │   │   │   └── health/     # 헬스 체크
│   │   │   └── page.tsx        # 웹 인터페이스
│   │   └── ...
│   ├── package.json
│   ├── .env.local.example
│   └── README.md
└── README.md             # 이 파일
```

## 🚀 Next.js 프록시 서버의 특징

**장점:**
- ✅ 서버리스 배포 지원 (Vercel, Netlify 등)
- 🎨 웹 인터페이스 포함 (테스트 UI)
- 📱 반응형 UI with Tailwind CSS
- 🚀 간편한 배포 및 확장
- ⚡ 자동 최적화 및 캐싱
- 🔄 SSR/SSG와 통합 가능
- 🔧 Spring Boot API 전용 엔드포인트 제공

**사용 사례:**
- 서버리스 환경에서의 프록시
- Spring Boot API와 연동된 프록시
- 웹 애플리케이션과 통합된 프록시
- 빠른 프로토타이핑 및 테스트

## 🛠️ 빠른 시작

### Next.js 프록시 서버 설정

```bash
cd nextjs-proxy
npm install
cp .env.local.example .env.local
npm run dev
```

### 환경 변수 설정

`.env.local` 파일에서 Spring Boot API 서버 URL을 설정:

```env
SPRING_BOOT_URL=http://localhost:8080
```

### 서버 실행 후 사용 가능한 엔드포인트:

- **웹 인터페이스**: `http://localhost:3001`
- **헬스 체크**: `http://localhost:3001/api/health`
- **Spring Boot Stock API**: `http://localhost:3001/api/stocks?name=AAPL`
- **JSONPlaceholder API**: `http://localhost:3001/api/v1/posts/1`
- **범용 프록시**: `http://localhost:3001/api/proxy?url=https://api.github.com/users/octocat`

## 🔧 제공하는 기능

### 1. Spring Boot API 전용 프록시 (`/api/stocks`)
Spring Boot 서버의 주식 API에 특화된 프록시:
- **GET**: `http://localhost:3001/api/stocks?name=AAPL` - 주식 스트리밍 데이터
- **POST**: `http://localhost:3001/api/stocks` - 주식 데이터 저장
- Server-Sent Events (SSE) 스트리밍 지원
- 자동 CORS 헤더 설정

### 2. CORS 지원
- 모든 오리진 허용 (프로덕션에서는 제한 권장)
- 모든 HTTP 메서드 지원 (GET, POST, PUT, DELETE, PATCH)
- 사용자 정의 헤더 지원
- Credentials 지원

### 3. 프록시 유형
- **Spring Boot API 프록시**: Spring Boot 서버의 `/stocks` API 전용
- **사전 정의된 API 프록시**: 특정 API에 대한 고정 경로
- **범용 프록시**: 임의의 URL에 대한 동적 프록시

### 4. 에러 처리
- URL 유효성 검사
- Spring Boot 서버 연결 상태 확인
- 네트워크 에러 처리
- 적절한 HTTP 상태 코드 반환
- 상세한 에러 메시지

## 📝 사용 예시

### JavaScript/TypeScript에서 Spring Boot API 사용

```javascript
// Spring Boot Stock API - WebFlux 스트리밍 (Tailable Cursor)
async function streamStock(stockName) {
  const response = await fetch(`http://localhost:3001/api/stocks?name=${stockName}`);
  const reader = response.body.getReader();
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    const chunk = new TextDecoder().decode(value);
    console.log('실시간 주식 데이터:', chunk);
  }
}

// Spring Boot Stock API - 주식 저장
async function saveStock(stockData) {
  const response = await fetch('http://localhost:3001/api/stocks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(stockData),
  });
  return response.json();
}

// 범용 프록시 사용
async function fetchWithProxy(targetUrl) {
  const proxyUrl = `http://localhost:3001/api/proxy?url=${encodeURIComponent(targetUrl)}`;
  const response = await fetch(proxyUrl);
  return response.json();
}

// 사용 예시
streamStock('AAPL');
const result = await saveStock({ name: 'AAPL', price: 150.00 });
const githubUser = await fetchWithProxy('https://api.github.com/users/octocat');
```

### cURL 명령어 예시

```bash
# Spring Boot Stock API - WebFlux 스트리밍
curl -N "http://localhost:3001/api/stocks?name=AAPL"

# Spring Boot Stock API - 저장
curl -X POST \
  "http://localhost:3001/api/stocks" \
  -H "Content-Type: application/json" \
  -d '{"name": "AAPL", "price": 150.00}'

# 헬스 체크
curl http://localhost:3001/api/health

# 범용 프록시
curl "http://localhost:3001/api/proxy?url=https://api.github.com/users/octocat"
```

## 🌐 배포 가이드

### Vercel 배포 (권장)
```bash
npm install -g vercel
cd nextjs-proxy
vercel
```

### 기타 플랫폼
- **Netlify**: GitHub 연동
- **AWS Amplify**: Git 연동
- **Railway**: 자동 감지 배포

### 환경 변수 설정
배포 시 다음 환경 변수를 설정하세요:
```
SPRING_BOOT_URL=https://your-spring-boot-server.com
```

## 🔒 보안 고려사항

### 프로덕션 환경에서 권장사항:

1. **오리진 제한**:
   ```javascript
   // 특정 도메인만 허용
   origin: ['https://myapp.com', 'https://app.mydomain.com']
   ```

2. **Spring Boot 서버 URL 보안**:
   ```javascript
   // 내부 네트워크에서만 접근 가능한 URL 사용
   SPRING_BOOT_URL=http://internal-spring-boot:8080
   ```

3. **Rate Limiting**:
   ```javascript
   // Vercel Edge Functions의 내장 제한 사용
   // 또는 추가 미들웨어 구현
   ```

4. **인증 헤더 관리**:
   ```javascript
   // 민감한 헤더 제거
   const excludeHeaders = ['authorization', 'cookie', 'x-api-key'];
   ```

## 📱 웹 인터페이스

Next.js 프록시는 브라우저에서 접근할 수 있는 테스트 인터페이스를 제공합니다:

- **URL**: `http://localhost:3001`
- **기능**:
  - 실시간 프록시 요청 테스트
  - Spring Boot API 예시 요청
  - 응답 데이터 실시간 확인
  - 다양한 HTTP 메서드 지원

## 🐛 문제 해결

### 일반적인 문제들:

1. **Spring Boot API 연결 실패**:
   - Spring Boot 서버가 실행 중인지 확인
   - `.env.local`의 `SPRING_BOOT_URL` 확인
   - 네트워크 연결 상태 확인

2. **여전히 CORS 에러가 발생하는 경우**:
   - Next.js 프록시 서버가 3001 포트에서 실행 중인지 확인
   - 요청 URL이 올바른지 확인 (http://localhost:3001/api/...)
   - 브라우저 개발자 도구에서 네트워크 탭 확인

3. **스트리밍 데이터 문제**:
   - 브라우저가 Server-Sent Events를 지원하는지 확인
   - 네트워크 연결이 안정적인지 확인

4. **환경 변수 문제**:
   - `.env.local` 파일 위치 확인
   - 서버 재시작
   - 환경 변수명 확인

## 📖 추가 리소스

- [CORS 개념 이해하기](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Server-Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
- [Spring Boot WebFlux](https://docs.spring.io/spring-framework/docs/current/reference/html/web-reactive.html)

## 🤝 기여

이슈나 개선 사항이 있으시면 언제든지 PR을 보내주세요!

## 📄 라이선스

MIT License