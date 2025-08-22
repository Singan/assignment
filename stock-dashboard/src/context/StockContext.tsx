import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { Stock, PriceHistory } from '../types/stock';
import { 
  connectToStockSSE, 
  disconnectFromStockSSE, 
  transformStockData, 
  generatePriceHistory, 
  generateInitialStockData,
  testProxyConnection 
} from '../services/stockService';

interface StockState {
  selectedStock: Stock | null; // 하나만 선택
  allStocks: Stock[];
  priceHistory: PriceHistory[];
  isConnected: boolean; // 프록시 서버 연결 상태
  connectionStatus: 'idle' | 'connecting' | 'connected' | 'error';
}

type StockAction =
  | { type: 'SELECT_STOCK'; payload: string }
  | { type: 'UPDATE_STOCK_DATA'; payload: Stock }
  | { type: 'ADD_PRICE_HISTORY'; payload: PriceHistory }
  | { type: 'CLEAR_HISTORY'; payload: void }
  | { type: 'INITIALIZE_STOCKS'; payload: Stock[] }
  | { type: 'SET_CONNECTION_STATUS'; payload: 'idle' | 'connecting' | 'connected' | 'error' }
  | { type: 'SET_CONNECTED'; payload: boolean };

interface StockContextType {
  state: StockState;
  selectStock: (stockId: string) => void;
  updateStockData: (stock: Stock) => void;
  addPriceHistory: (history: PriceHistory) => void;
  clearHistory: () => void;
  initializeStocks: (stocks: Stock[]) => void;
  testConnection: () => Promise<void>;
}

const StockContext = createContext<StockContextType | undefined>(undefined);

const initialState: StockState = {
  selectedStock: null,
  allStocks: generateInitialStockData(),
  priceHistory: [],
  isConnected: false,
  connectionStatus: 'idle'
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
    
    case 'SET_CONNECTION_STATUS':
      return {
        ...state,
        connectionStatus: action.payload
      };
    
    case 'SET_CONNECTED':
      return {
        ...state,
        isConnected: action.payload
      };
    
    default:
      return state;
  }
}

export function StockProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(stockReducer, initialState);

  const selectStock = (stockId: string) => {
    dispatch({ type: 'SELECT_STOCK', payload: stockId });
    
    // 주식 선택 시 SSE 연결
    const stock = state.allStocks.find(s => s.id === stockId);
    if (stock && state.isConnected) {
      console.log(`[StockContext] Connecting to SSE for ${stock.name}`);
      
      connectToStockSSE(stock.name, (rawData) => {
        // Spring Boot에서 받은 데이터를 프론트엔드 형식으로 변환
        const transformedStock = transformStockData(rawData, stock.name);
        
        // 주식 데이터 업데이트
        dispatch({ type: 'UPDATE_STOCK_DATA', payload: transformedStock });
        
        // 가격 히스토리 추가
        const history = generatePriceHistory(transformedStock);
        dispatch({ type: 'ADD_PRICE_HISTORY', payload: history });
      });
    }
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

  const testConnection = async () => {
    dispatch({ type: 'SET_CONNECTION_STATUS', payload: 'connecting' });
    
    try {
      const isConnected = await testProxyConnection();
      dispatch({ type: 'SET_CONNECTED', payload: isConnected });
      dispatch({ type: 'SET_CONNECTION_STATUS', payload: isConnected ? 'connected' : 'error' });
      
      if (isConnected) {
        console.log('[StockContext] Successfully connected to proxy server');
      } else {
        console.log('[StockContext] Failed to connect to proxy server');
      }
    } catch (error) {
      console.error('[StockContext] Connection test error:', error);
      dispatch({ type: 'SET_CONNECTED', payload: false });
      dispatch({ type: 'SET_CONNECTION_STATUS', payload: 'error' });
    }
  };

  // 컴포넌트 언마운트 시 SSE 연결 해제
  useEffect(() => {
    return () => {
      disconnectFromStockSSE();
    };
  }, []);

  return (
    <StockContext.Provider value={{ 
      state, 
      selectStock, 
      updateStockData, 
      addPriceHistory, 
      clearHistory, 
      initializeStocks,
      testConnection 
    }}>
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