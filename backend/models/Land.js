const mongoose = require('mongoose');

const landSchema = new mongoose.Schema(
  {
    yfcases_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Yfcase',
      required: [true, '案件ID為必填欄位'],
    },
    地號: {
      type: String,
      required: [true, '請輸入地號'],
      trim: true,
    },
    連結: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          if (!v) return true;
          try {
            // 將相對簡單的 URL 驗證交給 WHATWG URL 解析
            new URL(v);
            return true;
          } catch (e) {
            return false;
          }
        },
        message: '請輸入正確的網址',
      },
    },
    地坪: {
      type: Number,
      required: [true, '請輸入地坪'],
      set: (v) => (v === null || v === undefined ? v : Math.round(Number(v) * 100) / 100),
    },
    個人持分: {
      type: Number,
      required: [true, '請輸入個人持分'],
      min: [1, '個人持分需為正整數'],
      validate: {
        validator: Number.isInteger,
        message: '個人持分需為正整數',
      },
    },
    所有持分: {
      type: Number,
      required: [true, '請輸入所有持分'],
      min: [1, '所有持分需為正整數'],
      validate: {
        validator: Number.isInteger,
        message: '所有持分需為正整數',
      },
    },
    備註: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: {
      createdAt: '建立時間',
      updatedAt: '更新時間',
    },
  }
);

landSchema.index({ yfcases_id: 1 });

module.exports = mongoose.model('Land', landSchema);


