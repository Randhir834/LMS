const { findUserById, updateUserById } = require('../services/userService');

const getProfile = async (req, res, next) => {
  try {
    const user = await findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, date_of_birth, school, grade, parent_guardian_name, phone, location, qualifications, specialization } = req.body;
    const user = await updateUserById(req.user.id, { name, date_of_birth, school, grade, parent_guardian_name, phone, location, qualifications, specialization });
    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile };
