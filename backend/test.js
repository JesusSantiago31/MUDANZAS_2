const jwt = require('jsonwebtoken');
const http = require('http');

const token = jwt.sign(
  { id: 1, rol: 'cliente' },
  process.env.JWT_SECRET || 'super_secret_jwt_key_12345',
  { expiresIn: '24h' }
);

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/solicitudes/mis-solicitudes',
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
};

const req = http.request(options, res => {
  let data = '';
  res.on('data', chunk => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    console.log('Response Body:', data);
  });
});

req.on('error', error => {
  console.error('Error:', error);
});

req.end();
