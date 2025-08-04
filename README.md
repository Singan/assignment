# Spring Boot Stock API with Next.js CORS Proxy

Spring Boot 기반의 주식 API 서버와 CORS 문제 해결을 위한 Next.js 프록시 서버가 통합된 프로젝트입니다.

## 🏗️ 아키텍처

```
┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│                     │    │                     │    │                     │
│   Frontend Client   │◄──►│   Next.js Proxy     │◄──►│  Spring Boot API    │
│   (Browser/App)     │    │   (Port 3000)       │    │   (Port 8080)       │
│                     │    │                     │    │                     │
└─────────────────────┘    └─────────────────────┘    └─────────────────────┘
         CORS Issue                 CORS Solution              Stock Data
         Resolved                   + Web Interface            + MongoDB
```

## 🚀 주요 구성 요소

### 1. Spring Boot API 서버 (백엔드)
- **기술**: Spring Boot 3.5.4, WebFlux, MongoDB
- **포트**: 8080 (기본)
- **기능**:
  - 실시간 주식 데이터 스트리밍 (Server-Sent Events)
  - 주식 데이터 저장 및 조회
  - Reactive Programming 기반 비동기 처리

### 2. Next.js CORS 프록시 (프론트엔드 + 프록시)
- **기술**: Next.js 14, TypeScript, Tailwind CSS
- **포트**: 3000
- **기능**:
  - Spring Boot API 전용 프록시 엔드포인트
  - 범용 CORS 프록시
  - 웹 기반 테스트 인터페이스
  - 서버리스 배포 지원

## 🛠️ 빠른 시작

### 1. Spring Boot API 서버 실행

```bash
# MongoDB 시작 (Docker 사용)
docker run -d -p 27017:27017 --name mongodb mongo

# Spring Boot 애플리케이션 실행
./gradlew bootRun
```

### 2. Next.js 프록시 서버 실행

```bash
cd cors-proxy-servers/nextjs-proxy
npm install
cp .env.local.example .env.local
npm run dev
```

### 3. 사용법

#### 웹 인터페이스 접속
```
http://localhost:3000
```

#### API 사용 예시
```javascript
// Spring Boot API를 프록시를 통해 호출
const response = await fetch('http://localhost:3000/api/stocks?name=AAPL');
const reader = response.body.getReader();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const stockData = new TextDecoder().decode(value);
  console.log('실시간 주식 데이터:', stockData);
}
```

## 📊 API 엔드포인트

### Spring Boot API (직접 호출)
- `GET /stocks?name={stockName}` - 주식 스트리밍 데이터
- `POST /stocks` - 주식 데이터 저장

### Next.js 프록시 API (CORS 해결됨)
- `GET /api/stocks?name={stockName}` - 주식 스트리밍 프록시
- `POST /api/stocks` - 주식 저장 프록시
- `GET /api/proxy?url={targetUrl}` - 범용 프록시
- `GET /api/health` - 헬스 체크

## 🌐 배포

### Spring Boot (백엔드)
- **Docker**: `docker build -t stock-api .`
- **Cloud**: AWS, GCP, Azure
- **Database**: MongoDB Atlas (클라우드)

### Next.js 프록시 (프론트엔드)
- **Vercel**: `vercel` (권장)
- **Netlify**: GitHub 연동
- **AWS Amplify**: 자동 배포

## 🔧 환경 변수

### Spring Boot (.env 또는 application.properties)
```properties
spring.data.mongodb.host=localhost
spring.data.mongodb.port=27017
spring.data.mongodb.database=testdb
```

### Next.js (.env.local)
```env
SPRING_BOOT_URL=http://localhost:8080
```

## 📖 자세한 문서

- [Next.js 프록시 상세 문서](./cors-proxy-servers/README.md)
- [Spring Boot API 문서](./src/main/java/com/assignment/john/)

## 🤝 기여

이슈나 개선 사항이 있으시면 언제든지 PR을 보내주세요!

## 📄 라이선스

MIT License
