# 📈 실시간 주식 정보 스트리밍 사이트

React + TypeScript로 구현된 실시간 주식 정보 모니터링 대시보드입니다. 삼성전자, LG전자, SK하이닉스의 가격을 1초마다 업데이트하며, 선택된 주식의 가격 변화 히스토리를 실시간으로 제공합니다.

## 🎯 주요 기능

### 📊 실시간 주식 모니터링
- **토글식 주식 선택**: 삼성전자, LG전자, SK하이닉스 중 하나만 선택
- **1초마다 가격 업데이트**: 선택된 주식의 현재가가 1초마다 ±2% 변동
- **실시간 히스토리**: 가격 변화가 즉시 히스토리 테이블에 추가
- **주식 변경 시 초기화**: 새로운 주식 선택 시 이전 히스토리 자동 삭제

### 🎨 사용자 인터페이스
- **직관적인 카드 디자인**: 주식 정보를 카드 형태로 표시
- **색상 코딩**: 상승(녹색), 하락(빨간색), 보합(회색)
- **실시간 상태 표시**: 업데이트 중인지 시각적으로 표시
- **반응형 디자인**: 모바일/데스크톱 모두 지원

## 🛠️ 기술 스택

### Frontend
- **React 18**: 함수형 컴포넌트와 Hooks
- **TypeScript**: 타입 안정성 보장
- **CSS**: 커스텀 스타일링
- **Context API**: 상태 관리

### Mock Data
- **실시간 시뮬레이션**: 1초마다 가격 변동
- **현실적인 변동**: ±2% 범위의 가격 변화
- **배당금 계산**: 현재가의 1-3% 배당금

## 📁 프로젝트 구조

```
stock-dashboard/
├── src/
│   ├── components/
│   │   ├── StockToggle.tsx      # 주식 선택 토글 버튼
│   │   ├── StockCard.tsx        # 주식 정보 카드
│   │   └── StockList.tsx        # 가격 히스토리 리스트
│   ├── context/
│   │   └── StockContext.tsx     # 상태 관리 (Context API)
│   ├── services/
│   │   └── mockStockService.ts  # Mock 데이터 서비스
│   ├── types/
│   │   └── stock.ts            # 타입 정의
│   ├── App.tsx                 # 메인 컴포넌트
│   └── index.css               # 스타일링
├── package.json
└── README.md
```

## 🚀 설치 및 실행

### 1. 프로젝트 클론
```bash
git clone [repository-url]
cd stock-dashboard
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 개발 서버 실행
```bash
npm start
```

### 4. 브라우저에서 확인
```
http://localhost:3000
```

## 📊 데이터 모델

### Stock Interface
```typescript
interface Stock {
  id: string;           // 주식 ID
  name: string;         // 주식명
  currentPrice: number; // 현재가
  dividend: number;     // 배당금
  changeRate: number;   // 변동률 (%)
  changeAmount: number; // 변동금액
  timestamp: Date;      // 업데이트 시간
  isSelected: boolean;  // 선택 여부
}
```

### PriceHistory Interface
```typescript
interface PriceHistory {
  stockId: string;      // 주식 ID
  stockName: string;    // 주식명
  price: number;        // 가격
  timestamp: Date;      // 시간
  changeRate: number;   // 변동률
  changeAmount: number; // 변동금액
}
```

## 🔄 동작 방식

### 1. 주식 선택 플로우
```
사용자 클릭 → StockToggle → Context API → 상태 업데이트 → UI 리렌더링
```

### 2. 실시간 업데이트 플로우
```
1초마다 → Mock Service → 가격 변동 → Context 업데이트 → UI 갱신
```

### 3. 히스토리 관리 플로우
```
가격 변동 → 히스토리 생성 → Context 추가 → 테이블 업데이트
```

## 🎯 사용 방법

### 1. 주식 선택
- 상단의 토글 버튼을 클릭하여 모니터링할 주식 선택
- 한 번에 하나의 주식만 선택 가능

### 2. 실시간 모니터링
- 선택된 주식의 현재가, 배당금, 변동률 확인
- 1초마다 자동으로 가격 업데이트

### 3. 히스토리 확인
- 하단 테이블에서 가격 변화 히스토리 확인
- 최대 50개의 히스토리 기록 유지

### 4. 주식 변경
- 다른 주식을 선택하면 이전 히스토리 초기화
- 새로운 주식의 모니터링 시작

## ⚡ 성능 최적화

### 메모리 관리
- **Interval 정리**: 컴포넌트 언마운트 시 자동 정리
- **히스토리 제한**: 최대 50개 기록으로 메모리 사용량 제한

### 렌더링 최적화
- **useEffect 의존성 최적화**: 무한 루프 방지
- **필요한 부분만 업데이트**: 선택된 주식만 실시간 업데이트

## 🔧 개발 환경

### 필수 요구사항
- Node.js 16.0 이상
- npm 8.0 이상

### 권장 개발 도구
- VS Code
- React Developer Tools
- TypeScript 지원

## 📈 Mock 데이터 설정

### 초기 가격
- **삼성전자**: 75,000원
- **LG전자**: 120,000원
- **SK하이닉스**: 150,000원

### 변동 설정
- **변동 범위**: ±2% (현재가 기준)
- **업데이트 주기**: 1초마다
- **배당률**: 1-3% (현재가 기준)

## 🚀 향후 확장 계획

### 기능 추가
- [ ] 차트 기능 (가격 변동 그래프)
- [ ] 알림 기능 (특정 가격 도달 시)
- [ ] 포트폴리오 관리
- [ ] 실제 주식 API 연동

### 기술 개선
- [ ] WebSocket 연동
- [ ] 서버 사이드 렌더링 (SSR)
- [ ] PWA 지원
- [ ] 다크 모드

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해 주세요.

---

**개발자**: [Your Name]  
**버전**: 1.0.0  
**최종 업데이트**: 2024년 12월
