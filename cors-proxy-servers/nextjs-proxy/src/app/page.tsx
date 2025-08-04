'use client';

import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState('GET');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTest = async () => {
    if (!url) {
      setError('URL을 입력해주세요.');
      return;
    }

    setLoading(true);
    setError('');
    setResponse('');

    try {
      const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}`;
      const res = await fetch(proxyUrl, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.text();
      setResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const testExamples = [
    {
      name: 'JSONPlaceholder Posts',
      url: 'https://jsonplaceholder.typicode.com/posts/1',
      method: 'GET'
    },
    {
      name: 'GitHub API User',
      url: 'https://api.github.com/users/octocat',
      method: 'GET'
    },
    {
      name: 'HTTPBin GET',
      url: 'https://httpbin.org/get',
      method: 'GET'
    }
  ];

  const handleExampleClick = (example: typeof testExamples[0]) => {
    setUrl(example.url);
    setMethod(example.method);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Next.js CORS 프록시 서버
          </h1>
          <p className="text-lg text-gray-600">
            CORS 문제를 해결하기 위한 Next.js 기반 프록시 서버입니다.
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            프록시 테스트
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                대상 URL
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://api.example.com/data"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                HTTP 메서드
              </label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
                <option value="PATCH">PATCH</option>
              </select>
            </div>

            <button
              onClick={handleTest}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? '요청 중...' : '프록시 요청 테스트'}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              <strong>에러:</strong> {error}
            </div>
          )}

          {response && (
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">응답:</h3>
              <pre className="bg-gray-100 p-3 rounded-md overflow-auto max-h-96 text-sm">
                {response}
              </pre>
            </div>
          )}
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            예시 요청
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {testExamples.map((example, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(example)}
                className="p-4 border border-gray-300 rounded-md hover:bg-gray-50 text-left"
              >
                <h3 className="font-medium text-gray-900">{example.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{example.method}</p>
                <p className="text-xs text-gray-500 mt-1 break-all">{example.url}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            사용법
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900">1. 범용 프록시</h3>
              <code className="block bg-gray-100 p-2 rounded text-sm mt-2">
                fetch('/api/proxy?url=' + encodeURIComponent(targetUrl))
              </code>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900">2. API v1 프록시 (JSONPlaceholder)</h3>
              <code className="block bg-gray-100 p-2 rounded text-sm mt-2">
                fetch('/api/v1/posts/1')
              </code>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900">3. 헬스 체크</h3>
              <code className="block bg-gray-100 p-2 rounded text-sm mt-2">
                fetch('/api/health')
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
