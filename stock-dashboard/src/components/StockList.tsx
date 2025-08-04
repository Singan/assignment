import React from 'react';
import { PriceHistory } from '../types/stock';

interface StockListProps {
  priceHistory: PriceHistory[];
}

export function StockList({ priceHistory }: StockListProps) {
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

  if (priceHistory.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 가격 변화 히스토리</h3>
        <div className="text-center text-gray-500 py-8">
          선택된 주식이 없습니다. 주식을 선택하면 실시간 가격 변화를 확인할 수 있습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 가격 변화 히스토리</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">시간</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">주식명</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">가격</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">변동률</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">변동금액</th>
            </tr>
          </thead>
          <tbody>
            {priceHistory.map((history, index) => (
              <tr 
                key={`${history.stockId}-${history.timestamp.getTime()}-${index}`}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="py-3 px-4 text-sm text-gray-600">
                  {formatTime(history.timestamp)}
                </td>
                <td className="py-3 px-4 text-sm font-medium text-gray-800">
                  {history.stockName}
                </td>
                <td className="py-3 px-4 text-sm text-right font-semibold text-gray-800">
                  ₩{formatPrice(history.price)}
                </td>
                <td className={`py-3 px-4 text-sm text-right font-semibold ${getChangeColor(history.changeRate)}`}>
                  {getChangeIcon(history.changeRate)} {history.changeRate > 0 ? '+' : ''}{history.changeRate}%
                </td>
                <td className={`py-3 px-4 text-sm text-right font-semibold ${getChangeColor(history.changeAmount)}`}>
                  {history.changeAmount > 0 ? '+' : ''}{formatPrice(history.changeAmount)}원
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 