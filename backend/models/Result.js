const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  yfcases_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Yfcase',
    required: true
  },
  stopBuyDate: {
    type: Date,
    default: Date.now
  },
  actionResult: {
    type: String,
    enum: ['撤回', '第三人搶標', '等待優購', '遭優購', '無人優購'],
    trim: true
  },
  bidAuctionTime: {
    type: String,
    enum: ['1拍', '2拍', '3拍', '4拍'],
    trim: true
  },
  bidMoney: {
    type: Number,
    min: 0,
    validate: {
      validator: Number.isInteger,
      message: '搶標金額必須是正整數'
    }
  },
  objectNumber: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Result', resultSchema);
