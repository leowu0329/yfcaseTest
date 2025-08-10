const mongoose = require('mongoose');

const buildSchema = new mongoose.Schema({
  yfcases_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Yfcase',
    required: [true, '案件ID為必填欄位']
  },
  buildNumber: {
    type: String,
    required: [true, '建號為必填欄位'],
    trim: true
  },
  buildUrl: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        if (!v) return true; // 允許空值
        return /^https?:\/\/.+/.test(v);
      },
      message: '連結格式不正確，必須是有效的URL'
    }
  },
  buildArea: {
    type: Number,
    required: [true, '建坪為必填欄位'],
    min: [0, '建坪不能為負數'],
    set: v => Math.round(v * 100) / 100 // 保留兩位小數
  },
  buildHoldingPointPersonal: {
    type: Number,
    required: [true, '個人持分為必填欄位'],
    min: [1, '個人持分必須為正整數'],
    validate: {
      validator: Number.isInteger,
      message: '個人持分必須為整數'
    }
  },
  buildHoldingPointAll: {
    type: Number,
    required: [true, '所有持分為必填欄位'],
    min: [1, '所有持分必須為正整數'],
    validate: {
      validator: Number.isInteger,
      message: '所有持分必須為整數'
    }
  },
  buildCalculatedArea: {
    type: Number,
    default: 0,
    min: [0, '計算後建坪不能為負數'],
    set: v => Math.round(v * 100) / 100 // 保留兩位小數
  },
  buildTypeUse: {
    type: String,
    required: [true, '建物型為必填欄位'],
    enum: [
      '公設',
      '公寓-5樓含以下無電梯',
      '透天厝',
      '店面-店舖',
      '辦公商業大樓',
      '住宅大樓-11層含以上有電梯',
      '華廈-10層含以下有電梯',
      '套房',
      '農舍',
      '增建-持分後坪數打對折'
    ],
    default: '透天厝'
  },
  buildUsePartition: {
    type: String,
    required: [true, '使用分區為必填欄位'],
    enum: [
      '第一種住宅區',
      '第二種住宅區',
      '第三種住宅區',
      '第四種住宅區',
      '第五種住宅區',
      '第一種商業區',
      '第二種商業區',
      '第三種商業區',
      '第四種商業區',
      '第二種工業區',
      '第三種工業區',
      '行政區',
      '文教區',
      '倉庫區',
      '風景區',
      '農業區',
      '保護區',
      '行水區',
      '保存區',
      '特定專用區'
    ],
    default: '第一種住宅區'
  },
  buildRemark: {
    type: String,
    trim: true,
    maxlength: [500, '備註不能超過500個字元']
  }
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
});

// 建立索引以提升查詢效能
buildSchema.index({ yfcases_id: 1 });
buildSchema.index({ buildNumber: 1 });
buildSchema.index({ buildTypeUse: 1 });

// 計算計算後建坪的虛擬欄位
buildSchema.virtual('calculatedArea').get(function() {
  if (this.buildTypeUse === '增建-持分後坪數打對折') {
    return Math.round((this.buildHoldingPointPersonal / this.buildHoldingPointAll) * this.buildArea * 0.5 * 100) / 100;
  } else {
    return Math.round((this.buildHoldingPointPersonal / this.buildHoldingPointAll) * this.buildArea * 100) / 100;
  }
});

// 保存前自動計算並設置計算後建坪
buildSchema.pre('save', function(next) {
  console.log('Pre-save middleware triggered for build:', {
    buildTypeUse: this.buildTypeUse,
    buildArea: this.buildArea,
    buildHoldingPointPersonal: this.buildHoldingPointPersonal,
    buildHoldingPointAll: this.buildHoldingPointAll
  });
  
  if (this.buildTypeUse === '增建-持分後坪數打對折') {
    this.buildCalculatedArea = Math.round((this.buildHoldingPointPersonal / this.buildHoldingPointAll) * this.buildArea * 0.5 * 100) / 100;
  } else {
    this.buildCalculatedArea = Math.round((this.buildHoldingPointPersonal / this.buildHoldingPointAll) * this.buildArea * 100) / 100;
  }
  
  console.log('Calculated buildCalculatedArea:', this.buildCalculatedArea);
  next();
});

// 更新前自動計算並設置計算後建坪
buildSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  console.log('Pre-findOneAndUpdate middleware triggered for build:', update);
  
  if (update.buildArea && update.buildHoldingPointPersonal && update.buildHoldingPointAll && update.buildHoldingPointAll > 0) {
    if (update.buildTypeUse === '增建-持分後坪數打對折') {
      update.buildCalculatedArea = Math.round((update.buildHoldingPointPersonal / update.buildHoldingPointAll) * update.buildArea * 0.5 * 100) / 100;
    } else {
      update.buildCalculatedArea = Math.round((update.buildHoldingPointPersonal / update.buildHoldingPointAll) * update.buildArea * 100) / 100;
    }
  } else {
    update.buildCalculatedArea = 0;
  }
  
  console.log('Calculated buildCalculatedArea in update:', update.buildCalculatedArea);
  next();
});

module.exports = mongoose.model('Build', buildSchema);
