import React, { useEffect, useState, useCallback } from 'react';
import { StockProvider, useStockContext } from './context/StockContext';
import { StockToggle } from './components/StockToggle';
import { StockCard } from './components/StockCard';
import { StockList } from './components/StockList';
import { generateMockStockData, updateStockPrice, generatePriceHistory, resetPrices } from './services/mockStockService';
import { Stock } from './types/stock';

function StockDashboard() {
  const { state, updateStockData, addPriceHistory, initializeStocks } = useStockContext();
  const [isRunning, setIsRunning] = useState(false);

  // 초기 주식 데이터 설정
  useEffect(() => {
    resetPrices(); // 가격 상태 초기화
    const initialStocks = generateMockStockData();
    initializeStocks(initialStocks);
  }, []); // 의존성 배열을 빈 배열로 변경

  // 1초마다 현재가를 바꾸고 히스토리에 추가
  useEffect(() => {
    if (!state.selectedStock) {
      setIsRunning(false);
      return;
    }

    setIsRunning(true);
    const interval = setInterval(() => {
      // 1초마다 현재가를 실제로 바꿈
      const updatedStock = updateStockPrice(state.selectedStock!);
      updateStockData(updatedStock);
      
      // 바뀐 데이터를 히스토리에 추가
      const history = generatePriceHistory(updatedStock);
      addPriceHistory(history);
    }, 1000);

    return () => {
      clearInterval(interval);
      setIsRunning(false);
    };
  }, [state.selectedStock?.id]); // selectedStock.id만 의존성으로 사용

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📈 실시간 주식 모니터링
          </h1>
          <p className="text-gray-600">
            원하는 주식을 선택하여 실시간 가격 변화를 확인하세요
          </p>
        </div>

        {/* 토글 버튼들 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">주식 선택</h2>
          <div className="flex flex-wrap gap-3">
            {state.allStocks.map(stock => (
              <StockToggle
                key={stock.id}
                stockId={stock.id}
                stockName={stock.name}
                isSelected={state.selectedStock?.id === stock.id}
              />
            ))}
          </div>
        </div>

        {/* 실시간 상태 표시 */}
        {state.selectedStock && (
          <div className="mb-4 text-center">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              isRunning ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              <span className={`w-2 h-2 rounded-full mr-2 ${
                isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-500'
              }`}></span>
              {isRunning ? '실시간 업데이트 중...' : '대기 중'}
            </span>
          </div>
        )}

        {/* 선택된 주식 카드 */}
        {state.selectedStock && (
          <div className="flex justify-center mb-8">
            <div className="w-full max-w-md">
              <StockCard stock={state.selectedStock} />
            </div>
          </div>
        )}

        {/* 가격 히스토리 */}
        <StockList priceHistory={state.priceHistory} />

        {/* 안내 메시지 */}
        {!state.selectedStock && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              주식을 선택해주세요
            </h3>
            <p className="text-gray-500">
              위의 토글 버튼을 클릭하여 모니터링할 주식을 선택하세요.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <StockProvider>
      <StockDashboard />
    </StockProvider>
  );
}

export default App;
