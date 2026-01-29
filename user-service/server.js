
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
