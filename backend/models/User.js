const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, '請輸入用戶名'],
    unique: true,
    trim: true,
    maxlength: [20, '用戶名不能超過20個字符']
  },
  email: {
    type: String,
    required: [true, '請輸入郵箱'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      '請輸入有效的郵箱地址'
    ]
  },
  password: {
    type: String,
    required: [true, '請輸入密碼'],
    minlength: [6, '密碼至少6個字符'],
    select: false
  },
  avatar: {
    type: String,
    default: 'default-avatar.png'
  },
  bio: {
    type: String,
    maxlength: [200, '個人簡介不能超過200個字符'],
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 加密密碼
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// 驗證密碼
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema); 