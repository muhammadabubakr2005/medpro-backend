const User = require('../Models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendResetEmail } = require('../Utils/email');

const JWT_SECRET = process.env.JWT_SECRET || 'medpro_secret';

exports.register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const existing = await User.findOne({ $or: [{ email }, { phone }] });
    if (existing) return res.status(400).json({ message: 'User already exists' });
    // const salt=crypto.randomBytes(32).toString('hex');

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, phone, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.login = async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;
    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: '2h',
    });

    res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    if (updates.password) delete updates.password;

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
    }).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new passwords are required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error changing password', error });
  }
};


exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const token = crypto.randomBytes(32).toString('hex');
    const expiry = Date.now() + 1000 * 60 * 15; // 15 minutes

    user.resetPasswordToken = token;
    user.resetPasswordExpires = expiry;
    await user.save();

    const resetLink = `http://localhost:3000/reset-password/${token}`; // Frontend URL
    const message = `
      <h2>Reset Your Password</h2>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>This link will expire in 15 minutes.</p>
    `;

    await sendResetEmail(user.email, 'Password Reset - MedPro', message);

    res.json({ message: 'Password reset link sent to email' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending reset link', error });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // Check expiry
    });

    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: 'Error resetting password', error });
  }
};
