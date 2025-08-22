import { Stock, PriceHistory } from '../types/stock';

// 프록시 서버 URL
const PROXY_BASE_URL = 'http://localhost:3001';

// 초기 가격 설정 (기준가)
const INITIAL_PRICES = {
  '삼성전자': 75000,
  'LG': 120000,
  'SK': 150000
};

// 현재 가격 상태 (변동률 계산용)
let currentPrices = {
  '삼성전자': INITIAL_PRICES['삼성전자'],
  'LG': INITIAL_PRICES['LG'],
  'SK': INITIAL_PRICES['SK']
};

// SSE 연결 관리
let eventSource: EventSource | null = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 3;

// SSE 연결 함수
export function connectToStockSSE(stockName: string, onDataReceived: (data: any) => void) {
  // 기존 연결이 있다면 닫기
  if (eventSource) {
    console.log(`[StockService] Closing previous SSE connection for new stock: ${stockName}`);
    eventSource.close();
    eventSource = null;
    reconnectAttempts = 0;
  }

  try {
    const url = `${PROXY_BASE_URL}/api/proxy/stocks/sse?name=${stockName}`;
    console.log(`[StockService] Connecting to SSE: ${url}`);
    console.log(`[StockService] Stock name: "${stockName}"`);
    
    eventSource = new EventSource(url);
    
    eventSource.onopen = () => {
      console.log(`[StockService] SSE connection opened for ${stockName}`);
      reconnectAttempts = 0; // 연결 성공 시 재시도 횟수 초기화
    };
    
    eventSource.onmessage = (event) => {
      try {
        console.log(`[StockService] Received data for ${stockName}:`, event.data);
        
        if (!event.data || event.data.trim() === '') {
          console.log(`[StockService] Empty data received for ${stockName}`);
          return;
        }
        
        const data = JSON.parse(event.data);
        onDataReceived(data);
      } catch (error) {
        console.error(`[StockService] Parse error for ${stockName}:`, error, 'Raw data:', event.data);
      }
    };
    
    eventSource.onerror = (error) => {
      console.error(`[StockService] SSE error for ${stockName}:`, error);
      
      // 재연결 시도
      if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        reconnectAttempts++;
        console.log(`[StockService] Attempting to reconnect (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}) for ${stockName}`);
        
        setTimeout(() => {
          if (eventSource) {
            eventSource.close();
            eventSource = null;
            connectToStockSSE(stockName, onDataReceived);
          }
        }, 2000 * reconnectAttempts); // 지수 백오프
      } else {
        console.error(`[StockService] Max reconnection attempts reached for ${stockName}`);
        eventSource?.close();
        eventSource = null;
      }
    };
    
  } catch (error) {
    console.error(`[StockService] Connection error for ${stockName}:`, error);
  }
}

// SSE 연결 해제
export function disconnectFromStockSSE() {
  if (eventSource) {
    console.log('[StockService] Disconnecting from SSE');
    eventSource.close();
    eventSource = null;
    reconnectAttempts = 0;
  }
}

// Spring Boot에서 받은 데이터를 프론트엔드 형식으로 변환
export function transformStockData(rawData: any, stockName: string): Stock {
  // Spring Boot에서 받은 데이터 구조에 따라 변환
  // 예상 구조: { price: number, timestamp: string, ... }
  
  const newPrice = rawData.currentPrice || rawData.price || currentPrices[stockName as keyof typeof currentPrices];
  const basePrice = INITIAL_PRICES[stockName as keyof typeof INITIAL_PRICES];
  
  // 현재 가격 상태 업데이트
  currentPrices[stockName as keyof typeof currentPrices] = newPrice;
  
  // 변동률과 변동금액 계산
  const changeAmount = newPrice - basePrice;
  const changeRate = (changeAmount / basePrice) * 100;
  
  return {
    id: stockName, // 주식명을 ID로 사용
    name: stockName,
    currentPrice: newPrice,
    dividend: rawData.dividend || Math.floor(newPrice * (0.01 + Math.random() * 0.02)), // 1-3%
    changeRate: Math.round(changeRate * 100) / 100,
    changeAmount: changeAmount,
    timestamp: new Date(rawData.timestamp || Date.now()),
    isSelected: false
  };
}

// 가격 히스토리 생성
export function generatePriceHistory(stock: Stock): PriceHistory {
  return {
    stockId: stock.id,
    stockName: stock.name,
    price: stock.currentPrice,
    timestamp: stock.timestamp,
    changeRate: stock.changeRate,
    changeAmount: stock.changeAmount
  };
}

// 프록시 서버 연결 테스트
export async function testProxyConnection(): Promise<boolean> {
  try {
    const response = await fetch(`${PROXY_BASE_URL}/api/test`);
    const result = await response.json();
    console.log('[StockService] Proxy connection test result:', result);
    return result.status === 'success';
  } catch (error) {
    console.error('[StockService] Proxy connection test failed:', error);
    return false;
  }
}

// 초기 주식 데이터 생성 (연결 전 기본값)
export function generateInitialStockData(): Stock[] {
  return [
    {
      id: '삼성전자',
      name: '삼성전자',
      currentPrice: INITIAL_PRICES['삼성전자'],
      dividend: Math.floor(INITIAL_PRICES['삼성전자'] * 0.02),
      changeRate: 0,
      changeAmount: 0,
      timestamp: new Date(),
      isSelected: false
    },
    {
      id: 'LG',
      name: 'LG',
      currentPrice: INITIAL_PRICES['LG'],
      dividend: Math.floor(INITIAL_PRICES['LG'] * 0.025),
      changeRate: 0,
      changeAmount: 0,
      timestamp: new Date(),
      isSelected: false
    },
    {
      id: 'SK',
      name: 'SK',
      currentPrice: INITIAL_PRICES['SK'],
      dividend: Math.floor(INITIAL_PRICES['SK'] * 0.015),
      changeRate: 0,
      changeAmount: 0,
      timestamp: new Date(),
      isSelected: false
    }
  ];
}

// 현재 가격 상태 초기화
export function resetPrices() {
  currentPrices = {
    '삼성전자': INITIAL_PRICES['삼성전자'],
    'LG': INITIAL_PRICES['LG'],
    'SK': INITIAL_PRICES['SK']
  };
} 