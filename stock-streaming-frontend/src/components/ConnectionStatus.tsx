import React from 'react';
import styled from 'styled-components';

interface ConnectionStatusProps {
  isConnected: boolean;
  error: string | null;
}

const StatusContainer = styled.div<{ isConnected: boolean; hasError: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 8px;
  background: ${props => 
    props.hasError ? '#ffe6e6' : 
    props.isConnected ? '#e8f5e8' : '#fff3cd'};
  border: 1px solid ${props => 
    props.hasError ? '#ff9999' : 
    props.isConnected ? '#66cc66' : '#ffcc00'};
  margin-bottom: 16px;
`;

const StatusDot = styled.div<{ isConnected: boolean; hasError: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => 
    props.hasError ? '#dc3545' : 
    props.isConnected ? '#28a745' : '#ffc107'};
  animation: ${props => props.isConnected && !props.hasError ? 'pulse 2s infinite' : 'none'};
  
  @keyframes pulse {
    0% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(40, 167, 69, 0.7);
    }
    
    70% {
      transform: scale(1);
      box-shadow: 0 0 0 10px rgba(40, 167, 69, 0);
    }
    
    100% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(40, 167, 69, 0);
    }
  }
`;

const StatusText = styled.span<{ isConnected: boolean; hasError: boolean }>`
  font-weight: 500;
  color: ${props => 
    props.hasError ? '#dc3545' : 
    props.isConnected ? '#28a745' : '#856404'};
`;

const ErrorText = styled.div`
  color: #dc3545;
  font-size: 14px;
  margin-top: 4px;
`;

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  isConnected,
  error
}) => {
  const getStatusText = () => {
    if (error) return '연결 오류';
    if (isConnected) return '프록시 서버 연결됨';
    return '연결 중...';
  };

  return (
    <StatusContainer isConnected={isConnected} hasError={!!error}>
      <StatusDot isConnected={isConnected} hasError={!!error} />
      <StatusText isConnected={isConnected} hasError={!!error}>
        {getStatusText()}
      </StatusText>
      {error && <ErrorText>{error}</ErrorText>}
    </StatusContainer>
  );
};