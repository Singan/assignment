import React, { useEffect, useState, useCallback } from 'react';
import { StockProvider, useStockContext } from './context/StockContext';
import { StockToggle } from './components/StockToggle';
import { StockCard } from './components/StockCard';
import { StockList } from './components/StockList';
import { Stock } from './types/stock';

function StockDashboard() {
  const { state, updateStockData, addPriceHistory, initializeStocks, testConnection } = useStockContext();
  const [isRunning, setIsRunning] = useState(false);

  // 컴포넌트 마운트 시 프록시 서버 연결 테스트
  useEffect(() => {
    testConnection();
  }, []);

  // 선택된 주식이 변경될 때마다 실행 상태 업데이트
  useEffect(() => {
    if (state.selectedStock && state.isConnected) {
      setIsRunning(true);
    } else {
      setIsRunning(false);
    }
  }, [state.selectedStock, state.isConnected]);

  const getConnectionStatusText = () => {
    switch (state.connectionStatus) {
      case 'connecting':
        return '프록시 서버 연결 중...';
      case 'connected':
        return '프록시 서버 연결됨';
      case 'error':
        return '프록시 서버 연결 실패';
      default:
        return '연결 대기 중';
    }
  };

  const getConnectionStatusColor = () => {
    switch (state.connectionStatus) {
      case 'connecting':
        return 'bg-yellow-100 text-yellow-800';
      case 'connected':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📈 실시간 주식 모니터링
          </h1>
          <p className="text-gray-600">
            프록시 서버를 통해 Spring Boot의 실시간 주식 데이터를 확인하세요
          </p>
        </div>

        {/* 프록시 서버 연결 상태 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">프록시 서버 상태</h2>
            <button
              onClick={testConnection}
              disabled={state.connectionStatus === 'connecting'}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {state.connectionStatus === 'connecting' ? '연결 중...' : '연결 테스트'}
            </button>
          </div>
          <div className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium ${getConnectionStatusColor()}`}>
            <span className={`w-2 h-2 rounded-full mr-2 ${
              state.connectionStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' :
              state.connectionStatus === 'connected' ? 'bg-green-500' :
              state.connectionStatus === 'error' ? 'bg-red-500' : 'bg-gray-500'
            }`}></span>
            {getConnectionStatusText()}
          </div>
          {state.connectionStatus === 'error' && (
            <p className="text-red-600 text-sm mt-2">
              프록시 서버(localhost:3001)가 실행 중인지 확인해주세요.
            </p>
          )}
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
          {!state.isConnected && (
            <p className="text-orange-600 text-sm mt-3">
              ⚠️ 프록시 서버에 연결된 후 주식을 선택해주세요.
            </p>
          )}
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
              {isRunning ? '실시간 SSE 데이터 수신 중...' : '대기 중'}
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
              프록시 서버에 연결한 후 위의 토글 버튼을 클릭하여 모니터링할 주식을 선택하세요.
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
