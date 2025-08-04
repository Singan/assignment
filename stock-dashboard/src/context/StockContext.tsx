import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Stock, PriceHistory } from '../types/stock';

interface StockState {
  selectedStock: Stock | null; // 하나만 선택
  allStocks: Stock[];
  priceHistory: PriceHistory[];
}

type StockAction =
  | { type: 'SELECT_STOCK'; payload: string }
  | { type: 'UPDATE_STOCK_DATA'; payload: Stock }
  | { type: 'ADD_PRICE_HISTORY'; payload: PriceHistory }
  | { type: 'CLEAR_HISTORY'; payload: void }
  | { type: 'INITIALIZE_STOCKS'; payload: Stock[] };

interface StockContextType {
  state: StockState;
  selectStock: (stockId: string) => void;
  updateStockData: (stock: Stock) => void;
  addPriceHistory: (history: PriceHistory) => void;
  clearHistory: () => void;
  initializeStocks: (stocks: Stock[]) => void;
}

const StockContext = createContext<StockContextType | undefined>(undefined);

const initialState: StockState = {
  selectedStock: null,
  allStocks: [],
  priceHistory: []
};

function stockReducer(state: StockState, action: StockAction): StockState {
  switch (action.type) {
    case 'SELECT_STOCK':
      const stockToSelect = state.allStocks.find(stock => stock.id === action.payload);
      if (!stockToSelect) return state;
      
      return {
        ...state,
        selectedStock: stockToSelect,
        priceHistory: [] // 주식 선택 시 히스토리 초기화
      };
    
    case 'UPDATE_STOCK_DATA':
      const updatedAllStocks = state.allStocks.map(stock =>
        stock.id === action.payload.id ? action.payload : stock
      );
      const updatedSelectedStock = state.selectedStock?.id === action.payload.id 
        ? action.payload 
        : state.selectedStock;
      
      return {
        ...state,
        allStocks: updatedAllStocks,
        selectedStock: updatedSelectedStock
      };
    
    case 'ADD_PRICE_HISTORY':
      return {
        ...state,
        priceHistory: [action.payload, ...state.priceHistory.slice(0, 49)] // 최대 50개 유지
      };
    
    case 'CLEAR_HISTORY':
      return {
        ...state,
        priceHistory: []
      };
    
    case 'INITIALIZE_STOCKS':
      return {
        ...state,
        allStocks: action.payload
      };
    
    default:
      return state;
  }
}

export function StockProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(stockReducer, initialState);

  const selectStock = (stockId: string) => {
    dispatch({ type: 'SELECT_STOCK', payload: stockId });
  };

  const updateStockData = (stock: Stock) => {
    dispatch({ type: 'UPDATE_STOCK_DATA', payload: stock });
  };

  const addPriceHistory = (history: PriceHistory) => {
    dispatch({ type: 'ADD_PRICE_HISTORY', payload: history });
  };

  const clearHistory = () => {
    dispatch({ type: 'CLEAR_HISTORY', payload: undefined });
  };

  const initializeStocks = (stocks: Stock[]) => {
    dispatch({ type: 'INITIALIZE_STOCKS', payload: stocks });
  };

  return (
    <StockContext.Provider value={{ state, selectStock, updateStockData, addPriceHistory, clearHistory, initializeStocks }}>
      {children}
    </StockContext.Provider>
  );
}

export function useStockContext() {
  const context = useContext(StockContext);
  if (context === undefined) {
    throw new Error('useStockContext must be used within a StockProvider');
  }
  return context;
} 