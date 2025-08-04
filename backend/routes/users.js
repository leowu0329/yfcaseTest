const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    更新用戶資料
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', protect, [
  body('username')
    .optional()
    .isLength({ min: 3, max: 20 })
    .withMessage('用戶名必須在3-20個字符之間')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('用戶名只能包含字母、數字和下劃線'),
  body('bio')
    .optional()
    .isLength({ max: 200 })
    .withMessage('個人簡介不能超過200個字符')
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

    const { username, bio, avatar } = req.body;

    // 檢查用戶名是否已被使用
    if (username) {
      const existingUser = await User.findOne({ 
        username, 
        _id: { $ne: req.user._id } 
      });
      
      if (existingUser) {
        return res.status(400).json({ 
          message: '用戶名已被使用' 
        });
      }
    }

    // 更新用戶資料
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        ...(username && { username }),
        ...(bio !== undefined && { bio }),
        ...(avatar && { avatar })
      },
      { new: true, runValidators: true }
    );

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      bio: updatedUser.bio,
      createdAt: updatedUser.createdAt
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服務器錯誤' });
  }
});

// @desc    更改密碼
// @route   PUT /api/users/password
// @access  Private
router.put('/password', protect, [
  body('currentPassword')
    .notEmpty()
    .withMessage('請輸入當前密碼'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('新密碼至少6個字符')
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

    const { currentPassword, newPassword } = req.body;

    // 獲取用戶並包含密碼
    const user = await User.findById(req.user._id).select('+password');

    // 驗證當前密碼
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: '當前密碼錯誤' });
    }

    // 更新密碼
    user.password = newPassword;
    await user.save();

    res.json({ message: '密碼更新成功' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服務器錯誤' });
  }
});

// @desc    刪除用戶帳戶
// @route   DELETE /api/users/profile
// @access  Private
router.delete('/profile', protect, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.json({ message: '帳戶已刪除' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服務器錯誤' });
  }
});

module.exports = router; 