const mongoose = require('mongoose');

const finalDecisionSchema = new mongoose.Schema({
  yfcases_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Yfcase',
    required: [true, '案件ID為必填欄位']
  },
  finalDecision: {
    type: String,
    required: [true, '最終判定為必填欄位'],
    enum: {
      values: ['1拍進場', '2拍進場', '3拍進場', '4拍進場', '放棄'],
      message: '最終判定必須是以下選項之一：1拍進場、2拍進場、3拍進場、4拍進場、放棄'
    }
  },
  finalDecisionRemark: {
    type: String,
    trim: true
  },
  finalDecisionType: {
    type: String,
    required: [true, '分類為必填欄位'],
    enum: {
      values: ['區域負責人', '副署人員A', '副署人員B'],
      message: '分類必須是以下選項之一：區域負責人、副署人員A、副署人員B'
    }
  },
  regionalHead: {
    type: String,
    required: [true, '人員為必填欄位'],
    trim: true
  },
  regionalHeadDate: {
    type: Date,
    default: Date.now,
    required: [true, '簽核日期為必填欄位']
  },
  regionalHeadWorkArea: {
    type: String,
    required: [true, '工作轄區為必填欄位'],
    enum: {
      values: ['雙北桃竹苗', '中彰投', '雲嘉南', '高高屏'],
      message: '工作轄區必須是以下選項之一：雙北桃竹苗、中彰投、雲嘉南、高高屏'
    }
  }
}, {
  timestamps: true // 自動添加 createdAt 和 updatedAt
});

// 創建索引以提升查詢效能
finalDecisionSchema.index({ yfcases_id: 1 });
finalDecisionSchema.index({ finalDecisionType: 1 });
finalDecisionSchema.index({ regionalHeadWorkArea: 1 });

module.exports = mongoose.model('FinalDecision', finalDecisionSchema);
