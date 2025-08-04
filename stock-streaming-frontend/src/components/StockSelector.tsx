import React from 'react';
import styled from 'styled-components';
import { STOCK_CONFIGS, StockConfig } from '../types/stock';

interface StockSelectorProps {
  selectedStocks: string[];
  onStockToggle: (symbol: string) => void;
}

const SelectorContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
`;

const Title = styled.h2`
  margin: 0 0 20px 0;
  color: #333;
  font-size: 24px;
  font-weight: 600;
`;

const StockList = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`;

const StockItem = styled.label<{ color: string; isSelected: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border: 2px solid ${props => props.isSelected ? props.color : '#e0e0e0'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.isSelected ? `${props.color}10` : 'white'};
  
  &:hover {
    border-color: ${props => props.color};
    background: ${props => `${props.color}10`};
  }
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  margin: 0;
  cursor: pointer;
`;

const StockName = styled.span<{ color: string; isSelected: boolean }>`
  font-weight: 500;
  color: ${props => props.isSelected ? props.color : '#333'};
  transition: color 0.2s ease;
`;

const StockColorDot = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.color};
`;

export const StockSelector: React.FC<StockSelectorProps> = ({
  selectedStocks,
  onStockToggle
}) => {
  return (
    <SelectorContainer>
      <Title>주식 선택</Title>
      <StockList>
        {STOCK_CONFIGS.map((stock: StockConfig) => {
          const isSelected = selectedStocks.includes(stock.symbol);
          
          return (
            <StockItem
              key={stock.symbol}
              color={stock.color}
              isSelected={isSelected}
            >
              <Checkbox
                type="checkbox"
                checked={isSelected}
                onChange={() => onStockToggle(stock.symbol)}
              />
              <StockColorDot color={stock.color} />
              <StockName color={stock.color} isSelected={isSelected}>
                {stock.name}
              </StockName>
            </StockItem>
          );
        })}
      </StockList>
    </SelectorContainer>
  );
};