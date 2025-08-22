'use client';

import { useState, useEffect, useRef } from 'react';
import { ProxyStatus } from '@/components/ProxyStatus';
import { StockMonitor } from '@/components/StockMonitor';

interface LogEntry {
  id: string;
  timestamp: Date;
  type: 'info' | 'success' | 'error' | 'data';
  message: string;
  data?: any;
}

export default function Home() {
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [activeConnections, setActiveConnections] = useState<{ [key: string]: boolean }>({});
  const [eventSources, setEventSources] = useState<{ [key: string]: EventSource }>({});
  const logCounter = useRef(0);

  const addLog = (type: LogEntry['type'], message: string, data?: any) => {
    const newLog: LogEntry = {
      id: `${Date.now()}-${++logCounter.current}`,
      timestamp: new Date(),
      type,
      message,
      data,
    };
    setLogs(prev => [newLog, ...prev.slice(0, 49)]); // 최대 50개 로그 유지
  };

  const testConnection = async () => {
    setConnectionStatus('connecting');
    addLog('info', 'Spring Boot 서버 연결 테스트 시작...');

    try {
      const response = await fetch('/api/test');
      const result = await response.json();

      if (result.status === 'success') {
        setConnectionStatus('connected');
        addLog('success', 'Spring Boot 서버 연결 성공!', result);
      } else {
        setConnectionStatus('error');
        addLog('error', 'Spring Boot 서버 연결 실패', result);
      }
    } catch (error) {
      setConnectionStatus('error');
      addLog('error', '연결 테스트 중 오류 발생', error);
    }
  };

  const monitorStock = (stockName: string) => {
    // 기존 연결이 있다면 닫기
    if (eventSources[stockName]) {
      eventSources[stockName].close();
      addLog('info', `${stockName} 기존 연결 종료`);
    }

    try {
      // 주식 이름을 name 파라미터로 전달
      const eventSource = new EventSource(`/api/proxy/stocks/sse?name=${encodeURIComponent(stockName)}`);
      
      eventSource.onopen = () => {
        setActiveConnections(prev => ({ ...prev, [stockName]: true }));
        addLog('success', `${stockName} SSE 연결 성공 - name 파라미터: ${stockName}`);
      };

      eventSource.onmessage = (event) => {
        try {
          console.log(`[SSE] Received data for ${stockName}:`, event.data);
          
          // 빈 데이터 체크
          if (!event.data || event.data.trim() === '') {
            addLog('info', `${stockName} 빈 데이터 수신`);
            return;
          }

          const data = JSON.parse(event.data);
          addLog('data', `${stockName} 데이터 수신 (상승률은 프론트엔드에서 계산)`, data);
        } catch (error) {
          console.error(`[SSE] Parse error for ${stockName}:`, error, 'Raw data:', event.data);
          addLog('error', `${stockName} 데이터 파싱 오류: ${event.data}`, error);
        }
      };

      eventSource.onerror = (error) => {
        console.error(`[SSE] Error for ${stockName}:`, error);
        setActiveConnections(prev => ({ ...prev, [stockName]: false }));
        addLog('error', `${stockName} SSE 연결 오류`, error);
        eventSource.close();
      };

      setEventSources(prev => ({ ...prev, [stockName]: eventSource }));
      
    } catch (error) {
      console.error(`[SSE] Connection error for ${stockName}:`, error);
      addLog('error', `${stockName} 연결 생성 실패`, error);
    }
  };

  const monitorAll = () => {
    const stockNames = ['삼성전자', 'LG', 'SK'];
    stockNames.forEach(stockName => {
      monitorStock(stockName);
    });
    addLog('info', '전체 주식 모니터링 시작 - 각 주식별 name 파라미터 전달');
  };

  // 컴포넌트 언마운트 시 모든 연결 정리
  useEffect(() => {
    return () => {
      Object.values(eventSources).forEach(eventSource => {
        eventSource.close();
      });
    };
  }, [eventSources]);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🚀 주식 프록시 서버</h1>
          <p className="text-gray-600">Spring Boot SSE 스트림을 프론트엔드로 중계하는 프록시 서버</p>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">📋 주요 기능</h3>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• 주식 선택 시 <code className="bg-blue-100 px-1 rounded">name</code> 파라미터로 Spring Boot에 전달</li>
              <li>• 상승률(%) 계산은 프론트엔드에서 처리</li>
              <li>• 실시간 SSE 데이터 중계</li>
              <li>• 다중 주식 동시 모니터링 지원</li>
            </ul>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ProxyStatus
            onConnectTest={testConnection}
            connectionStatus={connectionStatus}
            logs={logs}
          />
          
          <StockMonitor
            onMonitorStock={monitorStock}
            onMonitorAll={monitorAll}
            activeConnections={activeConnections}
          />
        </div>

        <footer className="mt-12 text-center text-gray-500">
          <p>포트 3001에서 실행 중 | Spring Boot 서버: localhost:8080</p>
          <p className="mt-2 text-sm">프론트엔드: localhost:3000 | 프록시: localhost:3001</p>
        </footer>
      </div>
    </div>
  );
}
