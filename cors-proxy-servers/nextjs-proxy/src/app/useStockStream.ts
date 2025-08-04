import { useState, useEffect, useRef } from 'react';

interface Stock {
  id?: string;
  name: string;
  currentPrice: number;
  dividend: number;
}

export function useStockStream(stockName: string) {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!stockName) return;

    // 기존 연결 정리
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    // Server-Sent Events 연결
    const eventSource = new EventSource(`/api/stocks?name=${encodeURIComponent(stockName)}`);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      console.log('Stock stream connected:', stockName);
      setIsConnected(true);
      setError(null);
    };

    eventSource.onmessage = (event) => {
      try {
        const stockData = JSON.parse(event.data);
        console.log('Received stock data:', stockData);
        
        setStocks(prev => {
          // 최신 데이터를 맨 앞에 추가하고, 최대 100개만 유지
          const newStocks = [stockData, ...prev].slice(0, 100);
          return newStocks;
        });
      } catch (err) {
        console.error('Error parsing stock data:', err);
        setError('데이터 파싱 오류');
      }
    };

    eventSource.onerror = (event) => {
      console.error('Stock stream error:', event);
      setIsConnected(false);
      setError('스트림 연결 오류');
      
      // 자동 재연결 (5초 후)
      setTimeout(() => {
        if (eventSourceRef.current?.readyState === EventSource.CLOSED) {
          console.log('Attempting to reconnect...');
          // 컴포넌트가 언마운트되지 않았으면 재연결
        }
      }, 5000);
    };

    // 정리 함수
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      setIsConnected(false);
    };
  }, [stockName]);

  const disconnect = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setIsConnected(false);
    setStocks([]);
  };

  return {
    stocks,
    isConnected,
    error,
    disconnect
  };
}