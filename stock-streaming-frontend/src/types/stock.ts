export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: number;
}

export interface StockConfig {
  symbol: string;
  name: string;
  color: string;
}

export const STOCK_CONFIGS: StockConfig[] = [
  { symbol: 'SAMSUNG', name: '삼성전자', color: '#1f77b4' },
  { symbol: 'LG', name: 'LG전자', color: '#ff7f0e' },
  { symbol: 'SK', name: 'SK하이닉스', color: '#2ca02c' }
];