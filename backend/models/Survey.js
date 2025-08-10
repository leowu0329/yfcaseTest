const mongoose = require('mongoose');

const surveySchema = new mongoose.Schema({
  yfcases_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Yfcase',
    required: [true, '案件ID為必填欄位']
  },
  surveyFirstDay: {
    type: Date,
    default: Date.now
  },
  surveySecondDay: {
    type: Date,
    default: Date.now
  },
  surveyForeclosureAnnouncementLink: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        if (!v) return true; // Allow empty
        return /^https?:\/\/.+/.test(v);
      },
      message: '法拍公告連結格式不正確'
    }
  },
  survey988Link: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        if (!v) return true; // Allow empty
        return /^https?:\/\/.+/.test(v);
      },
      message: '998連結格式不正確'
    }
  },
  surveyObjectPhotoLink: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        if (!v) return true; // Allow empty
        return /^https?:\/\/.+/.test(v);
      },
      message: '物件照片連結格式不正確'
    }
  },
  surveyForeclosureRecordLink: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        if (!v) return true; // Allow empty
        return /^https?:\/\/.+/.test(v);
      },
      message: '法拍記錄連結格式不正確'
    }
  },
  surveyObjectViewLink: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        if (!v) return true; // Allow empty
        return /^https?:\/\/.+/.test(v);
      },
      message: '標的物連結格式不正確'
    }
  },
  surveyPagesViewLink: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        if (!v) return true; // Allow empty
        return /^https?:\/\/.+/.test(v);
      },
      message: '收發文簿連結格式不正確'
    }
  },
  surveyMoneytViewLink: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        if (!v) return true; // Allow empty
        return /^https?:\/\/.+/.test(v);
      },
      message: '流水帳連結格式不正確'
    }
  }
}, {
  timestamps: true // This automatically adds createdAt and updatedAt
});

// Create index for better query performance
surveySchema.index({ yfcases_id: 1 });

module.exports = mongoose.model('Survey', surveySchema);
