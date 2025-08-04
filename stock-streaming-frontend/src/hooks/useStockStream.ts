import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { StockData } from '../types/stock';

interface UseStockStreamProps {
  selectedStocks: string[];
  proxyServerUrl?: string;
}

export const useStockStream = ({ 
  selectedStocks, 
  proxyServerUrl = 'http://localhost:3001' 
}: UseStockStreamProps) => {
  const [stockData, setStockData] = useState<Record<string, StockData>>({});
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (selectedStocks.length === 0) return;

    // 기존 소켓 연결 해제
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    try {
      // 새로운 소켓 연결 생성
      socketRef.current = io(proxyServerUrl, {
        transports: ['websocket', 'polling']
      });

      socketRef.current.on('connect', () => {
        console.log('프록시 서버에 연결됨');
        setIsConnected(true);
        setError(null);
        
        // 선택된 주식들을 구독
        selectedStocks.forEach(symbol => {
          socketRef.current?.emit('subscribe', symbol);
        });
      });

      socketRef.current.on('disconnect', () => {
        console.log('프록시 서버 연결 해제됨');
        setIsConnected(false);
      });

      socketRef.current.on('stockData', (data: StockData) => {
        setStockData(prev => ({
          ...prev,
          [data.symbol]: data
        }));
      });

      socketRef.current.on('error', (err: any) => {
        console.error('소켓 에러:', err);
        setError('연결 오류가 발생했습니다.');
      });

    } catch (err) {
      console.error('소켓 연결 실패:', err);
      setError('서버에 연결할 수 없습니다.');
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [selectedStocks, proxyServerUrl]);

  const subscribeToStock = (symbol: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('subscribe', symbol);
    }
  };

  const unsubscribeFromStock = (symbol: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('unsubscribe', symbol);
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