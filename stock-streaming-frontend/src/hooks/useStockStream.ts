import { useState, useEffect, useRef } from 'react';
import { StockData } from '../types/stock';

interface UseStockStreamProps {
  selectedStocks: string[];
  proxyServerUrl?: string;
}

export const useStockStream = ({ 
  selectedStocks, 
  proxyServerUrl = 'http://localhost:3000' 
}: UseStockStreamProps) => {
  const [stockData, setStockData] = useState<Record<string, StockData>>({});
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const eventSourcesRef = useRef<Record<string, EventSource>>({});

  useEffect(() => {
    // 기존 연결들 정리
    Object.values(eventSourcesRef.current).forEach(eventSource => {
      eventSource.close();
    });
    eventSourcesRef.current = {};

    if (selectedStocks.length === 0) {
      setIsConnected(false);
      setStockData({});
      return;
    }

    let connectedCount = 0;
    const totalStocks = selectedStocks.length;

    selectedStocks.forEach(symbol => {
      try {
        // SSE 연결 생성 - 프록시 서버의 /api/stocks 엔드포인트 사용
        const eventSource = new EventSource(`${proxyServerUrl}/api/stocks?name=${encodeURIComponent(symbol)}`);
        
        eventSourcesRef.current[symbol] = eventSource;

        eventSource.onopen = () => {
          console.log(`${symbol} SSE 연결 열림`);
          connectedCount++;
          if (connectedCount === totalStocks) {
            setIsConnected(true);
            setError(null);
          }
        };

        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log(`${symbol} 데이터 수신:`, data);
            
            // 받은 데이터를 StockData 형식에 맞게 변환
            const stockData: StockData = {
              symbol: symbol,
              name: data.name || symbol,
              price: data.price || data.currentPrice || 0,
              change: data.change || 0,
              changePercent: data.changePercent || data.changePercentage || 0,
              volume: data.volume || data.tradingVolume || 0,
              timestamp: data.timestamp || Date.now()
            };

            setStockData(prev => ({
              ...prev,
              [symbol]: stockData
            }));
          } catch (parseError) {
            console.error(`${symbol} 데이터 파싱 오류:`, parseError);
          }
        };

        eventSource.onerror = (err) => {
          console.error(`${symbol} SSE 오류:`, err);
          connectedCount = Math.max(0, connectedCount - 1);
          
          if (eventSource.readyState === EventSource.CLOSED) {
            setError(`${symbol} 연결이 끊어졌습니다.`);
          } else {
            setError(`${symbol} 연결 오류가 발생했습니다.`);
          }
          
          if (connectedCount === 0) {
            setIsConnected(false);
          }
        };

      } catch (err) {
        console.error(`${symbol} SSE 연결 실패:`, err);
        setError(`${symbol} 서버에 연결할 수 없습니다.`);
      }
    });

    return () => {
      // 컴포넌트 언마운트 시 모든 SSE 연결 정리
      Object.values(eventSourcesRef.current).forEach(eventSource => {
        eventSource.close();
      });
      eventSourcesRef.current = {};
    };
  }, [selectedStocks, proxyServerUrl]);

  const subscribeToStock = (symbol: string) => {
    if (!eventSourcesRef.current[symbol]) {
      try {
        const eventSource = new EventSource(`${proxyServerUrl}/api/stocks?name=${encodeURIComponent(symbol)}`);
        eventSourcesRef.current[symbol] = eventSource;

        eventSource.onopen = () => {
          console.log(`${symbol} SSE 연결 열림`);
          setIsConnected(true);
          setError(null);
        };

        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            
            const stockData: StockData = {
              symbol: symbol,
              name: data.name || symbol,
              price: data.price || data.currentPrice || 0,
              change: data.change || 0,
              changePercent: data.changePercent || data.changePercentage || 0,
              volume: data.volume || data.tradingVolume || 0,
              timestamp: data.timestamp || Date.now()
            };

            setStockData(prev => ({
              ...prev,
              [symbol]: stockData
            }));
          } catch (parseError) {
            console.error(`${symbol} 데이터 파싱 오류:`, parseError);
          }
        };

        eventSource.onerror = (err) => {
          console.error(`${symbol} SSE 오류:`, err);
          setError(`${symbol} 연결 오류가 발생했습니다.`);
        };

      } catch (err) {
        console.error(`${symbol} SSE 연결 실패:`, err);
        setError(`${symbol} 서버에 연결할 수 없습니다.`);
      }
    }
  };

  const unsubscribeFromStock = (symbol: string) => {
    if (eventSourcesRef.current[symbol]) {
      eventSourcesRef.current[symbol].close();
      delete eventSourcesRef.current[symbol];
      
      setStockData(prev => {
        const newData = { ...prev };
        delete newData[symbol];
        return newData;
      });
    }
  };

  return {
    stockData,
    isConnected,
    error,
    subscribeToStock,
    unsubscribeFromStock
  };
};