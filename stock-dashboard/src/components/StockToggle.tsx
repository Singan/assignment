import React from 'react';
import { useStockContext } from '../context/StockContext';

interface StockToggleProps {
  stockId: string;
  stockName: string;
  isSelected: boolean;
}

export function StockToggle({ stockId, stockName, isSelected }: StockToggleProps) {
  const { selectStock } = useStockContext();

  return (
    <button
      onClick={() => selectStock(stockId)}
      className={`toggle-button ${isSelected ? 'selected' : 'unselected'}`}
    >
      {stockName}
    </button>
  );
} 