const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS 설정
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
};

app.use(cors(corsOptions));

// JSON 파싱 미들웨어
app.use(express.json());

// 로깅 미들웨어
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// 헬스 체크 엔드포인트
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// 프록시 설정을 위한 설정 객체
const proxyConfigs = [
  {
    context: '/api/v1',
    target: process.env.API_V1_TARGET || 'https://jsonplaceholder.typicode.com',
    pathRewrite: {
      '^/api/v1': ''
    }
  },
  {
    context: '/api/v2',
    target: process.env.API_V2_TARGET || 'https://httpbin.org',
    pathRewrite: {
      '^/api/v2': ''
    }
  }
];

// 동적 프록시 미들웨어 생성
proxyConfigs.forEach(config => {
  const proxyMiddleware = createProxyMiddleware({
    target: config.target,
    changeOrigin: true,
    pathRewrite: config.pathRewrite,
    onProxyReq: (proxyReq, req, res) => {
      console.log(`프록시 요청: ${req.method} ${req.url} -> ${config.target}${req.url}`);
    },
    onProxyRes: (proxyRes, req, res) => {
      console.log(`프록시 응답: ${proxyRes.statusCode} for ${req.url}`);
    },
    onError: (err, req, res) => {
      console.error('프록시 에러:', err);
      res.status(500).json({
        error: '프록시 서버 에러',
        message: err.message
      });
    }
  });

  app.use(config.context, proxyMiddleware);
});

// 범용 프록시 엔드포인트 (/proxy?url=<target_url>)
app.use('/proxy', (req, res, next) => {
  const targetUrl = req.query.url;
  
  if (!targetUrl) {
    return res.status(400).json({
      error: 'URL 매개변수가 필요합니다',
      usage: '/proxy?url=<target_url>'
    });
  }

  try {
    new URL(targetUrl); // URL 유효성 검사
  } catch (error) {
    return res.status(400).json({
      error: '잘못된 URL 형식입니다',
      provided: targetUrl
    });
  }

  const proxyMiddleware = createProxyMiddleware({
    target: targetUrl,
    changeOrigin: true,
    pathRewrite: {
      '^/proxy': ''
    },
    router: () => targetUrl,
    onProxyReq: (proxyReq, req, res) => {
      console.log(`범용 프록시 요청: ${req.method} -> ${targetUrl}`);
    },
    onError: (err, req, res) => {
      console.error('범용 프록시 에러:', err);
      res.status(500).json({
        error: '프록시 요청 실패',
        target: targetUrl,
        message: err.message
      });
    }
  });

  proxyMiddleware(req, res, next);
});

// 404 핸들러
app.use('*', (req, res) => {
  res.status(404).json({
    error: '엔드포인트를 찾을 수 없습니다',
    availableEndpoints: [
      'GET /health - 서버 상태 확인',
      'ANY /api/v1/* - JSONPlaceholder API 프록시',
      'ANY /api/v2/* - HTTPBin API 프록시',
      'ANY /proxy?url=<target_url> - 범용 프록시'
    ]
  });
});

// 에러 핸들러
app.use((err, req, res, next) => {
  console.error('서버 에러:', err);
  res.status(500).json({
    error: '내부 서버 에러',
    message: err.message
  });
});

app.listen(PORT, () => {
  console.log(`🚀 CORS 프록시 서버가 포트 ${PORT}에서 실행 중입니다`);
  console.log(`📍 헬스 체크: http://localhost:${PORT}/health`);
  console.log(`🔗 API v1 프록시: http://localhost:${PORT}/api/v1/*`);
  console.log(`🔗 API v2 프록시: http://localhost:${PORT}/api/v2/*`);
  console.log(`🌐 범용 프록시: http://localhost:${PORT}/proxy?url=<target_url>`);
});