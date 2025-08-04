import React, { useState } from 'react';
import styled from 'styled-components';

interface DebugPanelProps {
  stockData: Record<string, any>;
  isConnected: boolean;
  error: string | null;
}

const DebugContainer = styled.div`
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
  font-family: monospace;
  font-size: 12px;
`;

const DebugTitle = styled.h4`
  margin: 0 0 12px 0;
  color: #495057;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DebugContent = styled.div<{ isOpen: boolean }>`
  display: ${props => props.isOpen ? 'block' : 'none'};
  max-height: 300px;
  overflow-y: auto;
  background: white;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #e9ecef;
`;

const StatusBadge = styled.span<{ status: 'connected' | 'disconnected' | 'error' }>`
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 500;
  color: white;
  background: ${props => 
    props.status === 'connected' ? '#28a745' :
    props.status === 'error' ? '#dc3545' : '#6c757d'
  };
`;

const TestButton = styled.button`
  padding: 4px 8px;
  margin: 4px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 10px;
  
  &:hover {
    background: #f8f9fa;
  }
`;

export const DebugPanel: React.FC<DebugPanelProps> = ({
  stockData,
  isConnected,
  error
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const testSSEConnection = (stockName: string) => {
    const eventSource = new EventSource(`http://localhost:3000/api/stocks?name=${encodeURIComponent(stockName)}`);
    
    eventSource.onopen = () => {
      console.log(`Test: ${stockName} SSE 연결 성공`);
    };
    
    eventSource.onmessage = (event) => {
      console.log(`Test: ${stockName} 데이터:`, event.data);
    };
    
    eventSource.onerror = (err) => {
      console.error(`Test: ${stockName} SSE 오류:`, err);
    };

    setTimeout(() => {
      eventSource.close();
      console.log(`Test: ${stockName} 연결 종료`);
    }, 10000);
  };

  const getStatus = () => {
    if (error) return 'error';
    if (isConnected) return 'connected';
    return 'disconnected';
  };

  return (
    <DebugContainer>
      <DebugTitle onClick={() => setIsOpen(!isOpen)}>
        🔧 디버그 패널 
        <StatusBadge status={getStatus()}>
          {isConnected ? 'Connected' : error ? 'Error' : 'Disconnected'}
        </StatusBadge>
        <span>{isOpen ? '▲' : '▼'}</span>
      </DebugTitle>
      
      <DebugContent isOpen={isOpen}>
        <div>
          <strong>연결 상태:</strong> {isConnected ? '연결됨' : '연결 안됨'}
        </div>
        
        {error && (
          <div style={{ color: '#dc3545', margin: '8px 0' }}>
            <strong>오류:</strong> {error}
          </div>
        )}
        
        <div style={{ margin: '8px 0' }}>
          <strong>수신된 데이터:</strong>
          <pre style={{ margin: '4px 0', fontSize: '10px' }}>
            {JSON.stringify(stockData, null, 2)}
          </pre>
        </div>

        <div style={{ margin: '8px 0' }}>
          <strong>SSE 연결 테스트:</strong>
          <div>
            <TestButton onClick={() => testSSEConnection('Samsung Electronics')}>
              삼성전자 테스트
            </TestButton>
            <TestButton onClick={() => testSSEConnection('LG Electronics')}>
              LG전자 테스트
            </TestButton>
            <TestButton onClick={() => testSSEConnection('SK Hynix')}>
              SK하이닉스 테스트
            </TestButton>
          </div>
        </div>

        <div style={{ fontSize: '10px', color: '#6c757d', marginTop: '8px' }}>
          * 브라우저 개발자 도구 콘솔에서 상세 로그를 확인하세요.
        </div>
      </DebugContent>
    </DebugContainer>
  );
};