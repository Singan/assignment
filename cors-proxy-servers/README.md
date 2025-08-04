# CORS 프록시 서버 모음

CORS (Cross-Origin Resource Sharing) 문제를 해결하기 위한 두 가지 다른 접근 방식의 프록시 서버 구현입니다.

## 📁 프로젝트 구조

```
cors-proxy-servers/
├── nodejs-proxy/          # Node.js Express 기반 프록시 서버
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   └── README.md
├── nextjs-proxy/          # Next.js API Routes 기반 프록시 서버
│   ├── src/
│   ├── package.json
│   ├── .env.local.example
│   └── README.md
└── README.md             # 이 파일
```

## 🚀 각 서버의 특징 비교

### Node.js Express 프록시 (`nodejs-proxy/`)

**장점:**
- ✅ 완전한 서버 제어
- 🔄 복잡한 프록시 로직 구현 가능
- 📝 상세한 로깅 및 모니터링
- ⚙️ 유연한 미들웨어 시스템
- 🌐 여러 API 엔드포인트 동시 프록시
- 🔧 범용 프록시 기능

**사용 사례:**
- 독립적인 프록시 서버가 필요한 경우
- 복잡한 라우팅 로직이 필요한 경우
- 기존 Express 애플리케이션에 통합

### Next.js API Routes 프록시 (`nextjs-proxy/`)

**장점:**
- ✅ 서버리스 배포 지원 (Vercel, Netlify 등)
- 🎨 웹 인터페이스 포함 (테스트 UI)
- 📱 반응형 UI with Tailwind CSS
- 🚀 간편한 배포 및 확장
- ⚡ 자동 최적화 및 캐싱
- 🔄 SSR/SSG와 통합 가능

**사용 사례:**
- 서버리스 환경에서의 프록시
- 웹 애플리케이션과 통합된 프록시
- 빠른 프로토타이핑 및 테스트

## 🛠️ 빠른 시작

### 1. Node.js Express 프록시 서버

```bash
cd nodejs-proxy
npm install
cp .env.example .env
npm run dev
```

서버 실행 후:
- 헬스 체크: `http://localhost:3001/health`
- API v1 프록시: `http://localhost:3001/api/v1/posts/1`
- 범용 프록시: `http://localhost:3001/proxy?url=https://api.github.com/users/octocat`

### 2. Next.js API Routes 프록시 서버

```bash
cd nextjs-proxy
npm install
cp .env.local.example .env.local
npm run dev
```

서버 실행 후:
- 웹 인터페이스: `http://localhost:3000`
- 헬스 체크: `http://localhost:3000/api/health`
- API v1 프록시: `http://localhost:3000/api/v1/posts/1`
- 범용 프록시: `http://localhost:3000/api/proxy?url=https://api.github.com/users/octocat`

## 🔧 공통 기능

두 프록시 서버 모두 다음 기능을 제공합니다:

### 1. CORS 지원
- 모든 오리진 허용 (프로덕션에서는 제한 권장)
- 모든 HTTP 메서드 지원 (GET, POST, PUT, DELETE, PATCH)
- 사용자 정의 헤더 지원
- Credentials 지원

### 2. 프록시 유형
- **사전 정의된 API 프록시**: 특정 API에 대한 고정 경로
- **범용 프록시**: 임의의 URL에 대한 동적 프록시

### 3. 에러 처리
- URL 유효성 검사
- 네트워크 에러 처리
- 적절한 HTTP 상태 코드 반환
- 상세한 에러 메시지

## 📝 사용 예시

### JavaScript/TypeScript에서 사용

```javascript
// 범용 프록시 사용
async function fetchWithProxy(targetUrl, proxyServerUrl) {
  const proxyUrl = `${proxyServerUrl}/api/proxy?url=${encodeURIComponent(targetUrl)}`;
  const response = await fetch(proxyUrl);
  return response.json();
}

// 사전 정의된 API 프록시 사용
async function fetchJsonPlaceholder(endpoint, proxyServerUrl) {
  const response = await fetch(`${proxyServerUrl}/api/v1/${endpoint}`);
  return response.json();
}

// 사용 예시
const githubUser = await fetchWithProxy(
  'https://api.github.com/users/octocat',
  'http://localhost:3001' // or 'http://localhost:3000'
);

const post = await fetchJsonPlaceholder(
  'posts/1',
  'http://localhost:3001' // or 'http://localhost:3000'
);
```

### cURL 명령어 예시

```bash
# 헬스 체크
curl http://localhost:3001/health

# JSONPlaceholder API 프록시
curl http://localhost:3001/api/v1/posts/1

# GitHub API 프록시
curl "http://localhost:3001/proxy?url=https://api.github.com/users/octocat"

# POST 요청 프록시
curl -X POST \
  "http://localhost:3001/proxy?url=https://httpbin.org/post" \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

## 🌐 배포 가이드

### Node.js Express 서버 배포
- **Heroku**: `git push heroku main`
- **Railway**: GitHub 연동
- **DigitalOcean App Platform**: Dockerfile 사용
- **AWS EC2**: PM2와 함께 배포

### Next.js 서버 배포
- **Vercel**: `vercel` (권장)
- **Netlify**: GitHub 연동
- **AWS Amplify**: Git 연동
- **Railway**: 자동 감지 배포

## 🔒 보안 고려사항

### 프로덕션 환경에서 권장사항:

1. **오리진 제한**:
   ```javascript
   // 특정 도메인만 허용
   origin: ['https://myapp.com', 'https://app.mydomain.com']
   ```

2. **URL 필터링**:
   ```javascript
   // 허용된 도메인만 프록시
   const allowedDomains = ['api.trusted-service.com', 'secure-api.example.com'];
   ```

3. **Rate Limiting**:
   ```javascript
   // express-rate-limit 사용
   const rateLimit = require('express-rate-limit');
   ```

4. **인증 헤더 관리**:
   ```javascript
   // 민감한 헤더 제거
   const excludeHeaders = ['authorization', 'cookie', 'x-api-key'];
   ```

## 🆚 선택 가이드

### Node.js Express를 선택하는 경우:
- 독립적인 프록시 서버가 필요
- 복잡한 비즈니스 로직 구현
- 기존 Express 애플리케이션과 통합
- 전통적인 서버 환경에서 배포

### Next.js를 선택하는 경우:
- 서버리스 환경에서 배포
- 웹 애플리케이션과 함께 사용
- 빠른 프로토타이핑 필요
- Vercel 등 JAMstack 플랫폼 사용

## 🐛 문제 해결

### 일반적인 문제들:

1. **여전히 CORS 에러가 발생하는 경우**:
   - 프록시 서버가 실행 중인지 확인
   - 요청 URL이 올바른지 확인
   - 브라우저 개발자 도구에서 네트워크 탭 확인

2. **404 에러**:
   - API 경로가 올바른지 확인
   - 대상 서버가 응답하는지 확인

3. **환경 변수 문제**:
   - `.env` 파일 위치 확인
   - 서버 재시작
   - 환경 변수명 확인

## 📖 추가 리소스

- [CORS 개념 이해하기](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Express.js 공식 문서](https://expressjs.com/)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [http-proxy-middleware 문서](https://github.com/chimurai/http-proxy-middleware)

## 🤝 기여

이슈나 개선 사항이 있으시면 언제든지 PR을 보내주세요!

## 📄 라이선스

MIT License