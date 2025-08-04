import React from 'react';
import { Stock } from '../types/stock';

interface StockCardProps {
  stock: Stock;
}

export function StockCard({ stock }: StockCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  const getChangeColor = (changeRate: number) => {
    if (changeRate > 0) return 'text-green-600';
    if (changeRate < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getChangeIcon = (changeRate: number) => {
    if (changeRate > 0) return '↗';
    if (changeRate < 0) return '↘';
    return '→';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-800">{stock.name}</h3>
        <span className="text-sm text-gray-500">{formatTime(stock.timestamp)}</span>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">현재가</span>
          <span className="text-2xl font-bold text-gray-800">
            ₩{formatPrice(stock.currentPrice)}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600">배당금</span>
          <span className="text-lg font-semibold text-blue-600">
            ₩{formatPrice(stock.dividend)}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600">변동률</span>
          <div className="flex items-center space-x-1">
            <span className={`text-lg font-semibold ${getChangeColor(stock.changeRate)}`}>
              {getChangeIcon(stock.changeRate)} {stock.changeRate > 0 ? '+' : ''}{stock.changeRate}%
            </span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600">변동금액</span>
          <span className={`text-lg font-semibold ${getChangeColor(stock.changeAmount)}`}>
            {stock.changeAmount > 0 ? '+' : ''}{formatPrice(stock.changeAmount)}원
          </span>
        </div>
      </div>
    </div>
  );
} 