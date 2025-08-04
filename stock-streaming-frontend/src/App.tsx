import React, { useState } from 'react';
import styled from 'styled-components';
import { StockSelector } from './components/StockSelector';
import { StockCard } from './components/StockCard';
import { ConnectionStatus } from './components/ConnectionStatus';
import { useStockStream } from './hooks/useStockStream';
import './App.css';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 32px;
`;

const AppTitle = styled.h1`
  color: white;
  font-size: 48px;
  font-weight: 700;
  margin: 0 0 8px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const AppSubtitle = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 18px;
  margin: 0;
  font-weight: 300;
`;

const StockGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
  margin-top: 24px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const EmptyStateIcon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
`;

const EmptyStateTitle = styled.h3`
  color: #333;
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 8px 0;
`;

const EmptyStateText = styled.p`
  color: #666;
  font-size: 16px;
  margin: 0;
`;

function App() {
  const [selectedStocks, setSelectedStocks] = useState<string[]>([]);
  
  const { stockData, isConnected, error } = useStockStream({
    selectedStocks,
    proxyServerUrl: process.env.REACT_APP_PROXY_URL || 'http://localhost:3001'
  });

  const handleStockToggle = (symbol: string) => {
    setSelectedStocks(prev => 
      prev.includes(symbol)
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol]
    );
  };

  const stockDataArray = Object.values(stockData);

  return (
    <AppContainer>
      <ContentWrapper>
        <Header>
          <AppTitle>📈 실시간 주식 모니터</AppTitle>
          <AppSubtitle>HotStreaming을 통한 실시간 주식 데이터</AppSubtitle>
        </Header>

        <StockSelector
          selectedStocks={selectedStocks}
          onStockToggle={handleStockToggle}
        />

        {selectedStocks.length > 0 && (
          <ConnectionStatus
            isConnected={isConnected}
            error={error}
          />
        )}

        {stockDataArray.length > 0 ? (
          <StockGrid>
            {stockDataArray.map(stock => (
              <StockCard
                key={stock.symbol}
                stockData={stock}
              />
            ))}
          </StockGrid>
        ) : selectedStocks.length > 0 ? (
          <EmptyState>
            <EmptyStateIcon>⏳</EmptyStateIcon>
            <EmptyStateTitle>데이터 로딩 중</EmptyStateTitle>
            <EmptyStateText>
              프록시 서버에서 주식 데이터를 가져오고 있습니다...
            </EmptyStateText>
          </EmptyState>
        ) : (
          <EmptyState>
            <EmptyStateIcon>💼</EmptyStateIcon>
            <EmptyStateTitle>주식을 선택해주세요</EmptyStateTitle>
            <EmptyStateText>
              위에서 모니터링할 주식을 선택하면 실시간 데이터를 확인할 수 있습니다.
            </EmptyStateText>
          </EmptyState>
        )}
      </ContentWrapper>
    </AppContainer>
  );
}

export default App;
