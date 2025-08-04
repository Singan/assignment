# 📈 실시간 주식 모니터

React와 SSE(Server-Sent Events)를 사용한 실시간 주식 데이터 스트리밍 애플리케이션입니다.

## 🚀 기능

- **실시간 데이터 스트리밍**: SSE를 통한 HotStreaming 방식으로 주식 데이터 실시간 업데이트
- **주식 선택**: 삼성전자, LG전자, SK하이닉스 중 원하는 주식 선택
- **아름다운 UI**: 모던하고 직관적인 사용자 인터페이스
- **연결 상태 표시**: 프록시 서버 연결 상태 실시간 모니터링
- **반응형 디자인**: 다양한 화면 크기에 최적화
- **디버그 패널**: SSE 연결 상태 및 데이터 수신 모니터링

## 🛠 기술 스택

- **React 18** + TypeScript
- **Server-Sent Events (SSE)** - 실시간 스트리밍
- **Styled Components** - CSS-in-JS 스타일링
- **Next.js Proxy Server** - CORS 및 API 프록시

## 📦 설치 및 실행

### 필수 조건
- Node.js 16+ 
- npm 또는 yarn
- Next.js 프록시 서버 (포트 3000)

### 설치
```bash
cd stock-streaming-frontend
npm install
```

### 환경 설정
`.env` 파일에서 프록시 서버 URL을 설정하세요:
```
REACT_APP_PROXY_URL=http://localhost:3000
```

### 실행
```bash
npm start
```

브라우저에서 [http://localhost:3001](http://localhost:3001)으로 접속하세요.
(React 앱은 3001 포트, Next.js 프록시는 3000 포트)

## 🔌 프록시 서버 연동

이 애플리케이션은 Next.js 프록시 서버와 연동하여 동작합니다.

### 프록시 서버 실행
```bash
cd cors-proxy-servers/nextjs-proxy
npm install
npm run dev
```

### API 엔드포인트
- **GET /api/stocks?name={stockName}**: SSE 스트림으로 주식 데이터 수신

### 지원하는 주식 이름
- `Samsung Electronics` (삼성전자)
- `LG Electronics` (LG전자)  
- `SK Hynix` (SK하이닉스)

### 데이터 형식
```typescript
interface StockData {
  symbol: string;      // 주식 심볼
  name: string;        // 주식 이름
  price: number;       // 현재 가격
  change: number;      // 변동 금액
  changePercent: number; // 변동률 (%)
  volume: number;      // 거래량
  timestamp: number;   // 업데이트 시간
}
```

## 📱 사용 방법

1. **프록시 서버 실행**: Next.js 프록시 서버를 먼저 실행하세요
2. **React 앱 실행**: React 개발 서버를 실행하세요
3. **주식 선택**: 상단의 체크박스에서 모니터링할 주식을 선택하세요
4. **연결 확인**: 프록시 서버 연결 상태를 확인하세요
5. **실시간 모니터링**: 선택한 주식들의 실시간 데이터를 확인하세요
6. **디버그**: 문제가 있다면 디버그 패널을 열어 연결 상태를 확인하세요

## 🎨 UI 특징

- **라이브 인디케이터**: 실시간 데이터 수신을 시각적으로 표현
- **색상 코딩**: 각 주식별 고유 색상으로 구분
- **변동 표시**: 상승/하락에 따른 색상과 화살표 표시
- **부드러운 애니메이션**: 호버 효과와 펄스 애니메이션
- **디버그 패널**: SSE 연결 및 데이터 수신 상태 모니터링

## 📂 프로젝트 구조

```
src/
├── components/          # React 컴포넌트
│   ├── StockSelector.tsx    # 주식 선택 UI
│   ├── StockCard.tsx        # 주식 데이터 카드
│   ├── ConnectionStatus.tsx # 연결 상태 표시
│   └── DebugPanel.tsx       # 디버그 패널
├── hooks/              # 커스텀 훅
│   └── useStockStream.ts    # SSE 스트리밍 훅
├── types/              # TypeScript 타입 정의
│   └── stock.ts            # 주식 관련 타입
└── App.tsx             # 메인 애플리케이션
```

## 🔧 개발

### 추가 기능 구현시
1. `src/types/stock.ts`에서 데이터 타입 확장
2. `src/hooks/useStockStream.ts`에서 SSE 로직 수정
3. 새로운 컴포넌트는 `src/components/`에 추가

### 스타일링
- Styled Components를 사용하여 CSS-in-JS 방식으로 스타일링
- 반응형 디자인 고려
- 일관된 색상 팔레트 유지

### SSE 연결 디버깅
- 브라우저 개발자 도구의 Network 탭에서 SSE 연결 상태 확인
- Console 탭에서 SSE 이벤트 로그 확인
- 앱 내 디버그 패널을 통한 실시간 상태 모니터링

## 🚨 문제 해결

### 연결 문제
1. Next.js 프록시 서버가 3000 포트에서 실행 중인지 확인
2. Spring Boot 백엔드 서버가 8080 포트에서 실행 중인지 확인
3. 브라우저 개발자 도구에서 CORS 오류 확인

### 데이터 수신 문제
1. 디버그 패널에서 SSE 연결 상태 확인
2. 브라우저 Console에서 SSE 이벤트 로그 확인
3. 주식 이름 매개변수가 정확한지 확인

## 🤝 기여

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

MIT 라이선스를 따릅니다.
