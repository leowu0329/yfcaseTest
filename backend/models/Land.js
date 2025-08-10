const mongoose = require('mongoose');

const landSchema = new mongoose.Schema(
  {
    yfcases_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Yfcase',
      required: [true, '案件ID為必填欄位'],
    },
    landNumber: {
      type: String,
      required: [true, '請輸入地號'],
      trim: true,
    },
    landUrl: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          if (!v) return true;
          try {
            new URL(v);
            return true;
          } catch (e) {
            return false;
          }
        },
        message: '請輸入正確的網址',
      },
    },
    landArea: {
      type: Number,
      required: [true, '請輸入地坪'],
      set: (v) => (v === null || v === undefined ? v : Math.round(Number(v) * 100) / 100),
    },
    landHoldingPointPersonal: {
      type: Number,
      required: [true, '請輸入個人持分'],
      min: [1, '個人持分需為正整數'],
      validate: {
        validator: Number.isInteger,
        message: '個人持分需為正整數',
      },
    },
    landHoldingPointAll: {
      type: Number,
      required: [true, '請輸入所有持分'],
      min: [1, '所有持分需為正整數'],
      validate: {
        validator: Number.isInteger,
        message: '所有持分需為正整數',
      },
    },
    landCalculatedArea: {
      type: Number,
      default: 0,
      set: (v) => (v === null || v === undefined ? v : Math.round(Number(v) * 100) / 100),
    },
    landRemark: {
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

// 儲存前自動計算「計算後地坪」
landSchema.pre('save', function (next) {
  if (
    this.landArea &&
    this.landHoldingPointPersonal &&
    this.landHoldingPointAll &&
    this.landHoldingPointAll > 0
  ) {
    this.landCalculatedArea =
      Math.round(
        (this.landHoldingPointPersonal / this.landHoldingPointAll) *
          this.landArea *
          100
      ) / 100;
  } else {
    this.landCalculatedArea = 0;
  }
  next();
});

// 更新前自動計算「計算後地坪」
landSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  if (
    update.landArea &&
    update.landHoldingPointPersonal &&
    update.landHoldingPointAll &&
    update.landHoldingPointAll > 0
  ) {
    update.landCalculatedArea =
      Math.round(
        (update.landHoldingPointPersonal / update.landHoldingPointAll) *
          update.landArea *
          100
      ) / 100;
  } else {
    update.landCalculatedArea = 0;
  }
  next();
});

module.exports = mongoose.model('Land', landSchema);
