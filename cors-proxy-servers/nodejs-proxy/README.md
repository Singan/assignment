# Node.js CORS 프록시 서버

CORS 문제를 해결하기 위한 Express.js 기반 프록시 서버입니다.

## 특징

- ✅ 완전한 CORS 지원
- 🔄 다중 API 엔드포인트 프록시
- 🌐 범용 프록시 기능
- 📝 요청/응답 로깅
- ⚙️ 환경 변수를 통한 설정
- 🚀 간편한 설정 및 사용

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env

# 개발 모드 실행
npm run dev

# 프로덕션 모드 실행
npm start
```

## 사용법

### 1. 사전 정의된 API 프록시

```javascript
// JSONPlaceholder API 프록시 (기본 설정)
fetch('http://localhost:3001/api/v1/posts/1')
  .then(response => response.json())
  .then(data => console.log(data));

// HTTPBin API 프록시 (기본 설정)  
fetch('http://localhost:3001/api/v2/get')
  .then(response => response.json())
  .then(data => console.log(data));
```

### 2. 범용 프록시

```javascript
// 임의의 URL에 대한 프록시
const targetUrl = 'https://api.github.com/users/octocat';
fetch(`http://localhost:3001/proxy?url=${encodeURIComponent(targetUrl)}`)
  .then(response => response.json())
  .then(data => console.log(data));
```

### 3. 헬스 체크

```bash
curl http://localhost:3001/health
```

## 환경 변수

| 변수명 | 설명 | 기본값 |
|--------|------|--------|
| `PORT` | 서버 포트 | 3001 |
| `ALLOWED_ORIGINS` | CORS 허용 오리진 (쉼표 구분) | * |
| `API_V1_TARGET` | API v1 프록시 대상 | https://jsonplaceholder.typicode.com |
| `API_V2_TARGET` | API v2 프록시 대상 | https://httpbin.org |

## API 엔드포인트

- `GET /health` - 서버 상태 확인
- `ANY /api/v1/*` - API v1 프록시
- `ANY /api/v2/*` - API v2 프록시  
- `ANY /proxy?url=<target_url>` - 범용 프록시

## 에러 처리

프록시 서버는 다음과 같은 상황에서 적절한 에러 응답을 제공합니다:

- 잘못된 URL 형식
- 프록시 대상 서버 에러
- 네트워크 연결 실패
- 존재하지 않는 엔드포인트

## 보안 고려사항

프로덕션 환경에서는 다음 사항을 고려하세요:

1. `ALLOWED_ORIGINS`를 특정 도메인으로 제한
2. 요청 크기 제한 설정
3. 요청 빈도 제한 (Rate Limiting) 구현
4. HTTPS 사용