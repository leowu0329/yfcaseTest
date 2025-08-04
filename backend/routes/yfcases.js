const express = require('express');
const { body, query } = require('express-validator');
const { protect } = require('../middleware/auth');
const {
  getYfcases,
  getYfcase,
  createYfcase,
  updateYfcase,
  deleteYfcase,
  batchDeleteYfcases,
  getYfcaseStats
} = require('../controllers/yfcaseController');

const router = express.Router();

// 所有路由都需要身份驗證
router.use(protect);

// @desc    獲取所有案件
// @route   GET /api/yfcases
// @access  Private
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('頁碼必須是正整數'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('每頁數量必須在1-100之間'),
  query('sortBy').optional().isIn(['caseNumber', 'company', 'status', 'city', 'createdAt', 'updatedAt']).withMessage('排序欄位無效'),
  query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('排序順序必須是asc或desc')
], getYfcases);

// @desc    獲取案件統計
// @route   GET /api/yfcases/stats
// @access  Private
router.get('/stats', getYfcaseStats);

// @desc    獲取單一案件
// @route   GET /api/yfcases/:id
// @access  Private
router.get('/:id', getYfcase);

// @desc    創建新案件
// @route   POST /api/yfcases
// @access  Private
router.post('/', [
  body('caseNumber')
    .notEmpty().withMessage('案號不能為空')
    .trim()
    .isLength({ min: 1, max: 50 }).withMessage('案號長度必須在1-50個字符之間'),
  
  body('company')
    .notEmpty().withMessage('所屬公司不能為空')
    .isIn(['揚富開發有限公司', '鉅汰開發有限公司']).withMessage('所屬公司只能是揚富開發有限公司或鉅汰開發有限公司'),
  
  body('status')
    .notEmpty().withMessage('案件狀態不能為空')
    .isIn(['在途', '結案']).withMessage('案件狀態只能是在途或結案'),
  
  body('city')
    .notEmpty().withMessage('縣市不能為空')
    .trim()
    .isLength({ min: 1, max: 20 }).withMessage('縣市長度必須在1-20個字符之間'),
  
  body('district')
    .notEmpty().withMessage('鄉鎮區里不能為空')
    .trim()
    .isLength({ min: 1, max: 20 }).withMessage('鄉鎮區里長度必須在1-20個字符之間'),
  
  body('sectionNumber')
    .optional()
    .trim()
    .isLength({ max: 20 }).withMessage('段號長度不能超過20個字符'),
  
  body('subsection')
    .optional()
    .trim()
    .isLength({ max: 20 }).withMessage('小段長度不能超過20個字符'),
  
  body('village')
    .optional()
    .trim()
    .isLength({ max: 20 }).withMessage('村里長度不能超過20個字符'),
  
  body('neighborhood')
    .optional()
    .trim()
    .isLength({ max: 10 }).withMessage('鄰長度不能超過10個字符'),
  
  body('street')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('街路長度不能超過50個字符'),
  
  body('section')
    .optional()
    .trim()
    .isLength({ max: 20 }).withMessage('段長度不能超過20個字符'),
  
  body('lane')
    .optional()
    .trim()
    .isLength({ max: 20 }).withMessage('巷長度不能超過20個字符'),
  
  body('alley')
    .optional()
    .trim()
    .isLength({ max: 20 }).withMessage('弄長度不能超過20個字符'),
  
  body('number')
    .notEmpty().withMessage('號不能為空')
    .trim()
    .isLength({ min: 1, max: 20 }).withMessage('號長度必須在1-20個字符之間'),
  
  body('floor')
    .optional()
    .trim()
    .isLength({ max: 20 }).withMessage('樓長度不能超過20個字符'),
  
  body('responsiblePerson')
    .optional()
    .trim()
    .isLength({ min: 1, max: 20 }).withMessage('區域負責人長度必須在1-20個字符之間')
], createYfcase);

// @desc    更新案件
// @route   PUT /api/yfcases/:id
// @access  Private
router.put('/:id', [
  body('caseNumber')
    .optional()
    .notEmpty().withMessage('案號不能為空')
    .trim()
    .isLength({ min: 1, max: 50 }).withMessage('案號長度必須在1-50個字符之間'),
  
  body('company')
    .optional()
    .notEmpty().withMessage('所屬公司不能為空')
    .isIn(['揚富開發有限公司', '鉅汰開發有限公司']).withMessage('所屬公司只能是揚富開發有限公司或鉅汰開發有限公司'),
  
  body('status')
    .optional()
    .notEmpty().withMessage('案件狀態不能為空')
    .isIn(['在途', '結案']).withMessage('案件狀態只能是在途或結案'),
  
  body('city')
    .optional()
    .notEmpty().withMessage('縣市不能為空')
    .trim()
    .isLength({ min: 1, max: 20 }).withMessage('縣市長度必須在1-20個字符之間'),
  
  body('district')
    .optional()
    .notEmpty().withMessage('鄉鎮區里不能為空')
    .trim()
    .isLength({ min: 1, max: 20 }).withMessage('鄉鎮區里長度必須在1-20個字符之間'),
  
  body('sectionNumber')
    .optional()
    .trim()
    .isLength({ max: 20 }).withMessage('段號長度不能超過20個字符'),
  
  body('subsection')
    .optional()
    .trim()
    .isLength({ max: 20 }).withMessage('小段長度不能超過20個字符'),
  
  body('village')
    .optional()
    .trim()
    .isLength({ max: 20 }).withMessage('村里長度不能超過20個字符'),
  
  body('neighborhood')
    .optional()
    .trim()
    .isLength({ max: 10 }).withMessage('鄰長度不能超過10個字符'),
  
  body('street')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('街路長度不能超過50個字符'),
  
  body('section')
    .optional()
    .trim()
    .isLength({ max: 20 }).withMessage('段長度不能超過20個字符'),
  
  body('lane')
    .optional()
    .trim()
    .isLength({ max: 20 }).withMessage('巷長度不能超過20個字符'),
  
  body('alley')
    .optional()
    .trim()
    .isLength({ max: 20 }).withMessage('弄長度不能超過20個字符'),
  
  body('number')
    .optional()
    .notEmpty().withMessage('號不能為空')
    .trim()
    .isLength({ min: 1, max: 20 }).withMessage('號長度必須在1-20個字符之間'),
  
  body('floor')
    .optional()
    .trim()
    .isLength({ max: 20 }).withMessage('樓長度不能超過20個字符'),
  
  body('responsiblePerson')
    .optional()
    .trim()
    .isLength({ min: 1, max: 20 }).withMessage('區域負責人長度必須在1-20個字符之間')
], updateYfcase);

// @desc    刪除案件
// @route   DELETE /api/yfcases/:id
// @access  Private
router.delete('/:id', deleteYfcase);

// @desc    批量刪除案件
// @route   DELETE /api/yfcases/batch
// @access  Private
router.delete('/batch', [
  body('ids')
    .isArray({ min: 1 }).withMessage('ids必須是非空陣列')
    .custom((value) => {
      if (!value.every(id => /^[0-9a-fA-F]{24}$/.test(id))) {
        throw new Error('所有ID必須是有效的MongoDB ObjectId');
      }
      return true;
    })
], batchDeleteYfcases);

module.exports = router; 