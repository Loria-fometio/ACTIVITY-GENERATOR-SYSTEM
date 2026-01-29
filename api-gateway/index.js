require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 4000;

const USER_SERVICE = process.env.USER_SERVICE_URL || 'http://localhost:5000';
const ACTIVITY_SERVICE = process.env.ACTIVITY_SERVICE_URL || 'http://localhost:3000';
const USE_MOCK = process.env.REACT_APP_USE_MOCK_API === 'true';

app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));

// Health check
app.get('/health', (req, res) => res.json({ status: 'OK', service: 'api-gateway' }));
app.get('/', (req, res) => res.json({ message: 'API Gateway running' }));

// Proxy user-related API calls FIRST (more specific routes first)
app.use(
  '/api/users',
  createProxyMiddleware({
    target: USER_SERVICE,
    changeOrigin: true,
    logLevel: 'debug'
  })
);

// Proxy activity and chatbot calls to activity service
app.use(
  '/api/activities',
  createProxyMiddleware({
    target: ACTIVITY_SERVICE,
    changeOrigin: true,
    logLevel: 'debug'
  })
);

app.use(
  '/api/chatbot',
  createProxyMiddleware({
    target: ACTIVITY_SERVICE,
    changeOrigin: true,
    logLevel: 'debug'
  })
);

// Catch-all for other API routes
app.use(
  '/api',
  createProxyMiddleware({
    target: ACTIVITY_SERVICE,
    changeOrigin: true,
    logLevel: 'debug'
  })
);

app.listen(PORT, () => {
  console.log(`\n🚀 API Gateway listening on http://localhost:${PORT}`);
  console.log(`📍 Routes:`);
  console.log(`   /api/users     -> ${USER_SERVICE} (User Service)`);
  console.log(`   /api/activities -> ${ACTIVITY_SERVICE} (Activity Service)`);
  console.log(`   /api/chatbot   -> ${ACTIVITY_SERVICE} (Activity Service)`);
  console.log(`\n`);
})
