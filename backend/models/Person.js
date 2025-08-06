const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
  yfcases_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Yfcase',
    required: [true, '案件ID為必填欄位']
  },
  身份: {
    type: String,
    enum: ['債權人', '債務人'],
    default: '債務人',
    required: [true, '身份為必填欄位']
  },
  姓名: {
    type: String,
    required: [true, '姓名為必填欄位'],
    trim: true
  },
  電話: {
    type: String,
    required: [true, '電話為必填欄位'],
    trim: true
  }
}, {
  timestamps: {
    createdAt: '建立時間',
    updatedAt: '更新時間'
  }
});

// 建立索引以提升查詢效能
personSchema.index({ yfcases_id: 1 });
personSchema.index({ 身份: 1 });

module.exports = mongoose.model('Person', personSchema); 