# 📈 실시간 주식 모니터

React와 WebSocket을 사용한 실시간 주식 데이터 스트리밍 애플리케이션입니다.

## 🚀 기능

- **실시간 데이터 스트리밍**: WebSocket을 통한 HotStreaming 방식으로 주식 데이터 실시간 업데이트
- **주식 선택**: 삼성전자, LG전자, SK하이닉스 중 원하는 주식 선택
- **아름다운 UI**: 모던하고 직관적인 사용자 인터페이스
- **연결 상태 표시**: 프록시 서버 연결 상태 실시간 모니터링
- **반응형 디자인**: 다양한 화면 크기에 최적화

## 🛠 기술 스택

- **React 18** + TypeScript
- **Socket.IO Client** - WebSocket 통신
- **Styled Components** - CSS-in-JS 스타일링
- **Recharts** - 차트 라이브러리 (확장 가능)

## 📦 설치 및 실행

### 필수 조건
- Node.js 16+ 
- npm 또는 yarn

### 설치
```bash
cd stock-streaming-frontend
npm install
```

### 환경 설정
`.env` 파일에서 프록시 서버 URL을 설정하세요:
```
REACT_APP_PROXY_URL=http://localhost:3001
```

### 실행
```bash
npm start
```

브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속하세요.

## 🔌 프록시 서버 연동

이 애플리케이션은 별도의 프록시 서버와 연동하여 동작합니다. 프록시 서버는 다음 이벤트를 지원해야 합니다:

### 클라이언트에서 서버로
- `subscribe`: 특정 주식 구독
- `unsubscribe`: 특정 주식 구독 해제

### 서버에서 클라이언트로
- `stockData`: 주식 데이터 전송

### 데이터 형식
```typescript
interface StockData {
  symbol: string;      // 주식 심볼 (SAMSUNG, LG, SK)
  name: string;        // 주식 이름
  price: number;       // 현재 가격
  change: number;      // 변동 금액
  changePercent: number; // 변동률 (%)
  volume: number;      // 거래량
  timestamp: number;   // 업데이트 시간
}
```

## 📱 사용 방법

1. **주식 선택**: 상단의 체크박스에서 모니터링할 주식을 선택하세요
2. **연결 확인**: 프록시 서버 연결 상태를 확인하세요
3. **실시간 모니터링**: 선택한 주식들의 실시간 데이터를 확인하세요

## 🎨 UI 특징

- **라이브 인디케이터**: 실시간 데이터 수신을 시각적으로 표현
- **색상 코딩**: 각 주식별 고유 색상으로 구분
- **변동 표시**: 상승/하락에 따른 색상과 화살표 표시
- **부드러운 애니메이션**: 호버 효과와 펄스 애니메이션

## 📂 프로젝트 구조

```
src/
├── components/          # React 컴포넌트
│   ├── StockSelector.tsx    # 주식 선택 UI
│   ├── StockCard.tsx        # 주식 데이터 카드
│   └── ConnectionStatus.tsx # 연결 상태 표시
├── hooks/              # 커스텀 훅
│   └── useStockStream.ts    # WebSocket 스트리밍 훅
├── types/              # TypeScript 타입 정의
│   └── stock.ts            # 주식 관련 타입
└── App.tsx             # 메인 애플리케이션
```

## 🔧 개발

### 추가 기능 구현시
1. `src/types/stock.ts`에서 데이터 타입 확장
2. `src/hooks/useStockStream.ts`에서 WebSocket 로직 수정
3. 새로운 컴포넌트는 `src/components/`에 추가

### 스타일링
- Styled Components를 사용하여 CSS-in-JS 방식으로 스타일링
- 반응형 디자인 고려
- 일관된 색상 팔레트 유지

## 🤝 기여

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

MIT 라이선스를 따릅니다.
