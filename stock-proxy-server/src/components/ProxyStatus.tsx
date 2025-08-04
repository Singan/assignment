'use client';

import React, { useState, useEffect } from 'react';

interface ProxyStatusProps {
  onConnectTest: () => void;
  connectionStatus: 'idle' | 'connecting' | 'connected' | 'error';
  logs: LogEntry[];
}

interface LogEntry {
  id: string;
  timestamp: Date;
  type: 'info' | 'success' | 'error' | 'data';
  message: string;
  data?: any;
}

export function ProxyStatus({ onConnectTest, connectionStatus, logs }: ProxyStatusProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-600';
      case 'connecting': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return '🟢';
      case 'connecting': return '🟡';
      case 'error': return '🔴';
      default: return '⚪';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">🌐 프록시 서버 상태</h2>
      
      {/* 상태 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">프록시 상태</span>
            <span className="text-lg">🟢 온라인</span>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Spring Boot</span>
            <span className={`text-lg ${getStatusColor(connectionStatus)}`}>
              {getStatusIcon(connectionStatus)} {connectionStatus}
            </span>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">연결된 주식</span>
            <span className="text-lg">● 0개</span>
          </div>
        </div>
      </div>

      {/* 연결 테스트 버튼 */}
      <div className="mb-6">
        <button
          onClick={onConnectTest}
          disabled={connectionStatus === 'connecting'}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          {connectionStatus === 'connecting' ? '연결 중...' : '🔗 연결 확인'}
        </button>
      </div>

      {/* 로그 영역 */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">📊 실시간 로그</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {logs.length === 0 ? (
            <p className="text-gray-500 text-center py-4">로그가 없습니다.</p>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="text-sm">
                <span className="text-gray-500">
                  {log.timestamp.toLocaleTimeString()}
                </span>
                <span className="ml-2 text-gray-700">
                  {log.message}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 