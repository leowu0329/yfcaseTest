const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
  yfcases_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Yfcase',
    required: [true, '案件ID為必填欄位']
  },
  personType: {
    type: String,
    enum: ['債權人', '債務人'],
    default: '債務人',
    required: [true, '身份為必填欄位']
  },
  personName: {
    type: String,
    required: [true, '姓名為必填欄位'],
    trim: true
  },
  personMobile: {
    type: String,
    required: [true, '電話為必填欄位'],
    trim: true
  }
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
});

// 建立索引以提升查詢效能
personSchema.index({ yfcases_id: 1 });
personSchema.index({ personType: 1 });

module.exports = mongoose.model('Person', personSchema); 