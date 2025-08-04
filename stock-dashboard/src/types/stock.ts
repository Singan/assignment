export interface Stock {
  id: string;
  name: string;
  currentPrice: number;
  dividend: number;
  changeRate: number;
  changeAmount: number;
  timestamp: Date;
  isSelected: boolean;
}

export interface PriceHistory {
  stockId: string;
  stockName: string;
  price: number;
  timestamp: Date;
  changeRate: number;
  changeAmount: number;
} 