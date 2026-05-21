const { forgotPassword } = require('./src/controllers/authController');
const req = { body: { email: 'randhircool44@gmail.com', expectedRole: 'admin', clientOrigin: 'http://localhost:3000' } };
const res = { 
  json: (data) => console.log('res.json:', data), 
  status: (code) => { console.log('res.status:', code); return res; } 
};
const next = (err) => console.error('Next called with error:', err);
forgotPassword(req, res, next);
