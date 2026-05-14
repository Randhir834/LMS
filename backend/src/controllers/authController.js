const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { findUserByEmail, createUser, updateUserPassword } = require('../services/userService');
const { createResetToken, findUserIdByValidToken, deleteTokensForUser } = require('../services/passwordResetService');
const { sendEmail } = require('../services/emailService');

const ALLOWED_ROLES = ['student', 'instructor', 'admin'];

const register = async (req, res, next) => {
  try {
    const { name, email, password, role, date_of_birth, school, grade, parent_guardian_name, phone, location, qualifications, specialization } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    if (!role || !ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({ error: 'Invalid or missing role.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters.' });
    }

    if (role === 'student') {
      if (!date_of_birth || !school || !grade || !parent_guardian_name || !phone || !location) {
        return res.status(400).json({ error: 'Date of birth, school, grade, parent/guardian name, phone, and location are required for student registration.' });
      }
    }

    if (role === 'instructor') {
      if (!phone || !location || !qualifications || !specialization) {
        return res.status(400).json({ error: 'Phone, location, qualifications, and specialization are required for instructor registration.' });
      }
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await createUser({
      name, email, password: hashedPassword, role,
      date_of_birth, school, grade, parent_guardian_name, phone, location, qualifications, specialization
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id, name: user.name, email: user.email, role: user.role,
        date_of_birth: user.date_of_birth, age: user.age, school: user.school, grade: user.grade,
        parent_guardian_name: user.parent_guardian_name, phone: user.phone, location: user.location,
        qualifications: user.qualifications, specialization: user.specialization
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password, expectedRole } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    if (expectedRole && !ALLOWED_ROLES.includes(expectedRole)) {
      return res.status(400).json({ error: 'Invalid expectedRole.' });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "You don't have an account." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Your password is wrong.' });
    }

    if (expectedRole && user.role !== expectedRole) {
      return res.status(403).json({
        error: 'This account is not valid for this portal. Use the login page that matches your role (student, instructor, or admin).',
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      message: 'Login successful',
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { token: oldToken } = req.body;
    if (!oldToken) {
      return res.status(401).json({ error: 'Token is required' });
    }

    const decoded = jwt.verify(oldToken, process.env.JWT_SECRET);
    const newToken = jwt.sign(
      { id: decoded.id, email: decoded.email, role: decoded.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({ token: newToken });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email, expectedRole, clientOrigin } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }

    if (expectedRole && !ALLOWED_ROLES.includes(expectedRole)) {
      return res.status(400).json({ error: 'Invalid expectedRole.' });
    }

    const user = await findUserByEmail(email);
    const roleOk = user && (!expectedRole || user.role === expectedRole);

    if (roleOk) {
      const token = await createResetToken(user.id);
      const origin = (clientOrigin || process.env.APP_ORIGIN || 'http://localhost:3000').replace(/\/$/, '');
      const path = '/reset-password';
      const link = `${origin}${path}?token=${token}`;
      const subject = 'Reset your password';
      const html = `<p>We received a request to reset your password.</p><p><a href="${link}">Create new password</a></p><p>If you did not request this, you can ignore this email.</p>`;
      const text = `Reset your password: ${link}`;

      const result = await sendEmail({
        to: user.email,
        subject,
        html,
        text,
      });

      if (!result.sent) {
        console.log(`[playfit-lms] Password reset for ${user.email} (${user.role}): ${link}`);
      }
    }

    res.json({
      message:
        'If an account exists for this email, password reset instructions have been generated. Check your email or server logs in development.',
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ error: 'Token and new password are required.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters.' });
    }

    const userId = await findUserIdByValidToken(token);
    if (!userId) {
      return res.status(400).json({ error: 'Invalid or expired reset link. Request a new reset from the login page.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await updateUserPassword(userId, hashedPassword);
    await deleteTokensForUser(userId);

    res.json({ message: 'Password updated successfully. You can sign in with your new password.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, refreshToken, forgotPassword, resetPassword };
