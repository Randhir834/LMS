const express = require('express');
const { authenticate } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { getUsers, getUserById, updateUserRoleController, updateUserController, deleteUser, getAnalytics, createInstructorAccount } = require('../controllers/adminController');

const router = express.Router();

router.use(authenticate, authorizeRoles('admin'));

router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUserController);
router.put('/users/:id/role', updateUserRoleController);
router.delete('/users/:id', deleteUser);
router.get('/analytics', getAnalytics);
router.post('/instructors/create', createInstructorAccount);

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ message: 'Admin routes working', timestamp: new Date().toISOString() });
});

module.exports = router;
