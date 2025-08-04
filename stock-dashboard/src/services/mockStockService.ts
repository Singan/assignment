import { Stock, PriceHistory } from '../types/stock';

// 초기 가격 설정
const INITIAL_PRICES = {
  '삼성전자': 75000,
  'LG전자': 120000,
  'SK하이닉스': 150000
};

// 현재 가격 상태 (실제 변동을 추적하기 위해)
let currentPrices = {
  '삼성전자': INITIAL_PRICES['삼성전자'],
  'LG전자': INITIAL_PRICES['LG전자'],
  'SK하이닉스': INITIAL_PRICES['SK하이닉스']
};

// Mock 데이터 생성 함수
export function generateMockStockData(): Stock[] {
  return [
    {
      id: '1',
      name: '삼성전자',
      currentPrice: currentPrices['삼성전자'],
      dividend: Math.floor(currentPrices['삼성전자'] * 0.02),
      changeRate: 0,
      changeAmount: 0,
      timestamp: new Date(),
      isSelected: false
    },
    {
      id: '2',
      name: 'LG전자',
      currentPrice: currentPrices['LG전자'],
      dividend: Math.floor(currentPrices['LG전자'] * 0.025),
      changeRate: 0,
      changeAmount: 0,
      timestamp: new Date(),
      isSelected: false
    },
    {
      id: '3',
      name: 'SK하이닉스',
      currentPrice: currentPrices['SK하이닉스'],
      dividend: Math.floor(currentPrices['SK하이닉스'] * 0.015),
      changeRate: 0,
      changeAmount: 0,
      timestamp: new Date(),
      isSelected: false
    }
  ];
}

// 1초마다 현재가를 실제로 바꾸는 함수
export function updateStockPrice(stock: Stock): Stock {
  const basePrice = INITIAL_PRICES[stock.name as keyof typeof INITIAL_PRICES];
  
  // 현재 가격에서 ±2% 범위로 변동 (더 현실적인 변동)
  const variation = (Math.random() - 0.5) * 0.04; // ±2% 변동
  const newPrice = Math.floor(currentPrices[stock.name as keyof typeof currentPrices] * (1 + variation));
  
  // 현재 가격 상태 업데이트
  currentPrices[stock.name as keyof typeof currentPrices] = newPrice;
  
  const changeAmount = newPrice - basePrice;
  const changeRate = (changeAmount / basePrice) * 100;
  
  return {
    ...stock,
    currentPrice: newPrice,
    changeRate: Math.round(changeRate * 100) / 100,
    changeAmount: changeAmount,
    dividend: Math.floor(newPrice * (0.01 + Math.random() * 0.02)), // 1-3%
    timestamp: new Date()
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

// 현재 가격 상태 초기화
export function resetPrices() {
  currentPrices = {
    '삼성전자': INITIAL_PRICES['삼성전자'],
    'LG전자': INITIAL_PRICES['LG전자'],
    'SK하이닉스': INITIAL_PRICES['SK하이닉스']
  };
} 