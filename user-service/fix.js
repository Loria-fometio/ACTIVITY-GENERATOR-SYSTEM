const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing server setup...');

// Create minimal package.json
const packageJson = {
  name: "user-service",
  version: "1.0.0",
  main: "server.js",
  scripts: {
    start: "node server.js",
    dev: "nodemon server.js"
  },
  dependencies: {}
};

fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));

// Create minimal server.js
const serverCode = `
const express = require('express');
const app = express();
const PORT = 5000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Server is working! 🎉' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', time: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log('✅ Server started successfully!');
  console.log('📍 http://localhost:' + PORT);
  console.log('🔗 Health: http://localhost:' + PORT + '/health');
});
`;

fs.writeFileSync('server.js', serverCode);

console.log('✅ Created minimal setup');
console.log('📦 Run: npm install express');
console.log('🚀 Then: npm start');