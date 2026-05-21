const { resetPassword } = require('./src/controllers/authController');
const req = { body: { token: 'be1f6210ea6ebb209454968f9bef50512fe0c659fdee2911b246de7834da53df', password: 'newpassword123' } };
const res = { 
  json: (data) => console.log('res.json:', data), 
  status: (code) => { console.log('res.status:', code); return res; } 
};
const next = (err) => console.error('Next called with error:', err);
resetPassword(req, res, next);
