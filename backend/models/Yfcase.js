const mongoose = require('mongoose');

const yfcaseSchema = new mongoose.Schema({
  // 案號：文字型態，必填
  caseNumber: {
    type: String,
    required: [true, '請輸入案號'],
    trim: true,
    unique: true
  },
  
  // 所屬公司：文字型態，有"揚富開發有限公司"及"鉅汰開發有限公司"，預設"揚富開發有限公司"，必填
  company: {
    type: String,
    required: [true, '請選擇所屬公司'],
    enum: {
      values: ['揚富開發有限公司', '鉅汰開發有限公司'],
      message: '所屬公司只能是揚富開發有限公司或鉅汰開發有限公司'
    },
    default: '揚富開發有限公司'
  },
  
  // 案件狀態：文字型態，有"在途"及"結案"，預設"在途"，必填
  status: {
    type: String,
    required: [true, '請選擇案件狀態'],
    enum: {
      values: ['在途', '結案'],
      message: '案件狀態只能是在途或結案'
    },
    default: '在途'
  },
  
  // 縣市：文字型態，必填
  city: {
    type: String,
    required: [true, '請輸入縣市'],
    trim: true
  },
  
  // 鄉鎮區里：文字型態，必填
  district: {
    type: String,
    required: [true, '請輸入鄉鎮區里'],
    trim: true
  },
  
  // 段號：文字型態，非必填
  sectionNumber: {
    type: String,
    trim: true
  },
  
  // 小段：文字型態，非必填
  subsection: {
    type: String,
    trim: true
  },
  
  // 村里：文字型態，非必填
  village: {
    type: String,
    trim: true
  },
  
  // 鄰：文字型態，非必填
  neighborhood: {
    type: String,
    trim: true
  },
  
  // 街路：文字型態，非必填
  street: {
    type: String,
    trim: true
  },
  
  // 段：文字型態，非必填
  section: {
    type: String,
    trim: true
  },
  
  // 巷：文字型態，非必填
  lane: {
    type: String,
    trim: true
  },
  
  // 弄：文字型態，非必填
  alley: {
    type: String,
    trim: true
  },
  
  // 號：文字型態，必填
  number: {
    type: String,
    required: [true, '請輸入號'],
    trim: true
  },
  
  // 樓(含之幾)：文字型態，非必填
  floor: {
    type: String,
    trim: true
  },
  
  // 建立時間：日期時間型態，預設資料建立當下的時間，必填
  createdAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  
  // 更新時間：日期時間型態，預設資料更新當下的時間，必填
  updatedAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  
  // 區域負責人：文字型態，預設新增資料當下的登入人員姓名，必填
  responsiblePerson: {
    type: String,
    required: [true, '請輸入區域負責人'],
    trim: true
  }
}, {
  timestamps: true, // 自動管理 createdAt 和 updatedAt
  collection: 'yfcases' // 指定集合名稱為 yfcases
});

// 更新 updatedAt 欄位
yfcaseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// 更新 updatedAt 欄位（用於 findOneAndUpdate 等操作）
yfcaseSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});

// 虛擬欄位：完整地址
yfcaseSchema.virtual('fullAddress').get(function() {
  const parts = [
    this.city,
    this.district,
    this.sectionNumber,
    this.subsection,
    this.village,
    this.neighborhood,
    this.street,
    this.section,
    this.lane,
    this.alley,
    this.number,
    this.floor
  ].filter(part => part && part.trim());
  
  return parts.join('');
});

// 確保虛擬欄位在 JSON 序列化時包含
yfcaseSchema.set('toJSON', { virtuals: true });
yfcaseSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Yfcase', yfcaseSchema); 