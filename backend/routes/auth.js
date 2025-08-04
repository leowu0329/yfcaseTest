const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect, generateToken } = require('../middleware/auth');

const router = express.Router();

// @desc    註冊用戶
// @route   POST /api/auth/register
// @access  Public
router.post('/register', [
  body('username')
    .isLength({ min: 3, max: 20 })
    .withMessage('用戶名必須在3-20個字符之間')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('用戶名只能包含字母、數字和下劃線'),
  body('email')
    .isEmail()
    .withMessage('請輸入有效的郵箱地址'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('密碼至少6個字符')
], async (req, res) => {
  try {
    // 檢查驗證錯誤
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: '驗證失敗',
        errors: errors.array() 
      });
    }

    const { username, email, password } = req.body;

    // 檢查用戶是否已存在
    const userExists = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (userExists) {
      return res.status(400).json({ 
        message: '用戶名或郵箱已存在' 
      });
    }

    // 創建用戶
    const user = await User.create({
      username,
      email,
      password
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        token: generateToken(user._id)
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服務器錯誤' });
  }
});

// @desc    用戶登入
// @route   POST /api/auth/login
// @access  Public
router.post('/login', [
  body('email')
    .isEmail()
    .withMessage('請輸入有效的郵箱地址'),
  body('password')
    .notEmpty()
    .withMessage('請輸入密碼')
], async (req, res) => {
  try {
    // 檢查驗證錯誤
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: '驗證失敗',
        errors: errors.array() 
      });
    }

    const { email, password } = req.body;

    // 查找用戶並包含密碼
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ message: '郵箱或密碼錯誤' });
    }

    // 驗證密碼
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: '郵箱或密碼錯誤' });
    }

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服務器錯誤' });
  }
});

// @desc    獲取當前用戶信息
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      createdAt: user.createdAt
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服務器錯誤' });
  }
});

module.exports = router; 