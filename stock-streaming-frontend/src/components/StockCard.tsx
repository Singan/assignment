import React from 'react';
import styled from 'styled-components';
import { StockData, STOCK_CONFIGS } from '../types/stock';

interface StockCardProps {
  stockData: StockData;
}

const CardContainer = styled.div<{ color: string }>`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border-left: 4px solid ${props => props.color};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 16px;
`;

const StockName = styled.h3<{ color: string }>`
  margin: 0;
  color: ${props => props.color};
  font-size: 18px;
  font-weight: 600;
`;

const Symbol = styled.span`
  color: #666;
  font-size: 14px;
  margin-left: 8px;
`;

const LiveIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #28a745;
  font-size: 12px;
  font-weight: 500;
`;

const LiveDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #28a745;
  animation: pulse 2s infinite;
  
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

const PriceSection = styled.div`
  margin-bottom: 16px;
`;

const CurrentPrice = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin-bottom: 4px;
`;

const PriceChange = styled.div<{ isPositive: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${props => props.isPositive ? '#28a745' : '#dc3545'};
  font-weight: 500;
`;

const ChangeArrow = styled.span<{ isPositive: boolean }>`
  font-size: 14px;
  &:before {
    content: '${props => props.isPositive ? '↗' : '↘'}';
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const InfoItem = styled.div`
  text-align: center;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 6px;
`;

const InfoLabel = styled.div`
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
`;

const InfoValue = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #333;
`;

const Timestamp = styled.div`
  margin-top: 12px;
  font-size: 11px;
  color: #999;
  text-align: right;
`;

export const StockCard: React.FC<StockCardProps> = ({ stockData }) => {
  const stockConfig = STOCK_CONFIGS.find(config => config.symbol === stockData.symbol);
  const isPositive = stockData.change >= 0;
  
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ko-KR').format(num);
  };
  
  const formatPercentage = (num: number) => {
    return `${isPositive ? '+' : ''}${num.toFixed(2)}%`;
  };
  
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('ko-KR');
  };

  return (
    <CardContainer color={stockConfig?.color || '#666'}>
      <Header>
        <div>
          <StockName color={stockConfig?.color || '#666'}>
            {stockConfig?.name || stockData.name}
            <Symbol>({stockData.symbol})</Symbol>
          </StockName>
        </div>
        <LiveIndicator>
          <LiveDot />
          LIVE
        </LiveIndicator>
      </Header>
      
      <PriceSection>
        <CurrentPrice>₩{formatNumber(stockData.price)}</CurrentPrice>
        <PriceChange isPositive={isPositive}>
          <ChangeArrow isPositive={isPositive} />
          {isPositive ? '+' : ''}{formatNumber(stockData.change)}
          ({formatPercentage(stockData.changePercent)})
        </PriceChange>
      </PriceSection>
      
      <InfoGrid>
        <InfoItem>
          <InfoLabel>거래량</InfoLabel>
          <InfoValue>{formatNumber(stockData.volume)}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>변동률</InfoLabel>
          <InfoValue>{formatPercentage(stockData.changePercent)}</InfoValue>
        </InfoItem>
      </InfoGrid>
      
      <Timestamp>
        업데이트: {formatTime(stockData.timestamp)}
      </Timestamp>
    </CardContainer>
  );
};