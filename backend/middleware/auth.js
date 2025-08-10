const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 保護路由
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 獲取 token
      token = req.headers.authorization.split(' ')[1];

      // 驗證 token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 獲取用戶信息
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: '未授權，用戶不存在' });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: '未授權，token 無效' });
    }
  } else {
    return res.status(401).json({ message: '未授權，沒有 token' });
  }
};

// 生成 JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

module.exports = { protect, generateToken }; 