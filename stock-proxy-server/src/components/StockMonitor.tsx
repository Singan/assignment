'use client';

import React, { useState } from 'react';

interface StockMonitorProps {
  onMonitorStock: (stockName: string) => void;
  onMonitorAll: () => void;
  activeConnections: { [key: string]: boolean };
}

const STOCK_NAMES = ['삼성전자', 'LG', 'SK'];

export function StockMonitor({ onMonitorStock, onMonitorAll, activeConnections }: StockMonitorProps) {
  const [currentStock, setCurrentStock] = useState<string | null>(null);

  const handleStockClick = (stockName: string) => {
    setCurrentStock(stockName);
    onMonitorStock(stockName);
  };

  const handleMonitorAll = () => {
    setCurrentStock(null);
    onMonitorAll();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">📈 주식 모니터링</h2>
      
      {/* 모니터링 버튼들 */}
      <div className="space-y-4">
        <div>
          <button
            onClick={handleMonitorAll}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
          >
            📊 전체 모니터링
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {STOCK_NAMES.map((stockName) => (
            <button
              key={stockName}
              onClick={() => handleStockClick(stockName)}
              className={`py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                currentStock === stockName
                  ? 'bg-blue-500 text-white shadow-lg transform scale-105'
                  : activeConnections[stockName]
                  ? 'bg-green-100 text-green-800 border-2 border-green-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {activeConnections[stockName] ? '🟢' : '⚪'} {stockName}
            </button>
          ))}
        </div>
      </div>

      {/* 현재 모니터링 상태 */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">현재 모니터링</h3>
        {currentStock ? (
          <p className="text-gray-700">
            <span className="font-medium">{currentStock}</span> 주식 모니터링 중...
          </p>
        ) : (
          <p className="text-gray-500">모니터링할 주식을 선택하세요.</p>
        )}
      </div>

      {/* 연결 상태 표시 */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">연결 상태</h3>
        <div className="space-y-2">
          {STOCK_NAMES.map((stockName) => (
            <div key={stockName} className="flex items-center justify-between">
              <span className="text-gray-700">{stockName}</span>
              <span className={`text-sm font-medium ${
                activeConnections[stockName] ? 'text-green-600' : 'text-gray-400'
              }`}>
                {activeConnections[stockName] ? '🟢 연결됨' : '⚪ 연결 안됨'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 