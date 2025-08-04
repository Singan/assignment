# 🚀 주식 프록시 서버

Spring Boot SSE 스트림을 프론트엔드로 중계하는 Next.js 프록시 서버입니다.

## 📋 기능

- **SSE 프록시**: Spring Boot 서버의 Server-Sent Events를 프론트엔드로 중계
- **실시간 모니터링**: 여러 주식 데이터를 동시에 모니터링
- **연결 상태 관리**: Spring Boot 서버와의 연결 상태 실시간 확인
- **로그 시스템**: 모든 연결 및 데이터 수신 로그 기록

## 🛠️ 기술 스택

- **Next.js 15.4.5**: React 기반 프레임워크
- **TypeScript**: 타입 안전성
- **Tailwind CSS**: 스타일링
- **Server-Sent Events (SSE)**: 실시간 데이터 스트리밍

## 🚀 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

프록시 서버가 `http://localhost:3001`에서 실행됩니다.

### 3. Spring Boot 서버 실행

Spring Boot 서버가 `http://localhost:8080`에서 실행되어야 합니다.

## 📡 API 엔드포인트

### 1. 연결 테스트
```
GET /api/test
```
Spring Boot 서버와의 연결을 테스트합니다.

### 2. SSE 프록시
```
GET /api/proxy/stocks/sse?name={stockName}
```
특정 주식의 SSE 스트림을 프록시합니다.

### 3. 서버 상태
```
GET /api/proxy/status
```
프록시 서버와 Spring Boot 서버의 상태를 확인합니다.

## 🎯 사용법

1. **Spring Boot 서버 실행**: `localhost:8080`에서 실행
2. **프록시 서버 실행**: `npm run dev`로 `localhost:3001`에서 실행
3. **브라우저에서 접속**: `http://localhost:3001`
4. **연결 확인**: "🔗 연결 확인" 버튼 클릭
5. **주식 모니터링**: 개별 주식 또는 "📊 전체 모니터링" 버튼 클릭

## 📊 모니터링 가능한 주식

- 삼성
- LG
- SK

## 🔧 설정

### 포트 변경
`package.json`의 scripts 섹션에서 포트를 변경할 수 있습니다:

```json
{
  "scripts": {
    "dev": "next dev -p 3001",
    "start": "next start -p 3001"
  }
}
```

### Spring Boot 서버 URL 변경
SSE 프록시 라우트에서 Spring Boot 서버 URL을 변경할 수 있습니다:

```typescript
// src/app/api/proxy/stocks/sse/route.ts
const springUrl = `http://localhost:8080/stocks/sse?name=${encodeURIComponent(stockName)}`;
```

## 🐛 문제 해결

### Spring Boot 서버 연결 실패
1. Spring Boot 서버가 `localhost:8080`에서 실행 중인지 확인
2. SSE 엔드포인트가 올바르게 구현되어 있는지 확인
3. CORS 설정 확인

### SSE 연결 오류
1. 브라우저 콘솔에서 오류 메시지 확인
2. 네트워크 탭에서 요청/응답 확인
3. 프록시 서버 로그 확인

## 📝 로그 타입

- **info**: 일반 정보
- **success**: 성공 메시지
- **error**: 오류 메시지
- **data**: 수신된 데이터

## 🔄 빌드 및 배포

### 프로덕션 빌드
```bash
npm run build
npm start
```

### Docker 배포 (선택사항)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

## 📄 라이선스

MIT License

