const express = require('express');
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const {
  getResultsByYfcase,
  getResult,
  createResult,
  updateResult,
  deleteResult,
  batchDeleteResults
} = require('../controllers/resultController');

const router = express.Router();

// 驗證規則
const resultValidation = [
  body('yfcases_id').isMongoId().withMessage('案件ID格式不正確'),
  body('actionResult').optional().isIn(['撤回', '第三人搶標', '等待優購', '遭優購', '無人優購']).withMessage('執行結果選項不正確'),
  body('bidAuctionTime').optional().isIn(['1拍', '2拍', '3拍', '4拍']).withMessage('搶標拍別選項不正確'),
  body('bidMoney').optional().isInt({ min: 0 }).withMessage('搶標金額必須是非負整數'),
  body('objectNumber').optional().trim().isLength({ max: 100 }).withMessage('標的編號長度不能超過100字元')
];

const resultUpdateValidation = [
  body('actionResult').optional().isIn(['撤回', '第三人搶標', '等待優購', '遭優購', '無人優購']).withMessage('執行結果選項不正確'),
  body('bidAuctionTime').optional().isIn(['1拍', '2拍', '3拍', '4拍']).withMessage('搶標拍別選項不正確'),
  body('bidMoney').optional().isInt({ min: 0 }).withMessage('搶標金額必須是非負整數'),
  body('objectNumber').optional().trim().isLength({ max: 100 }).withMessage('標的編號長度不能超過100字元')
];

// 所有路由都需要認證
router.use(protect);

// 獲取案件的所有執行結果記錄
router.get('/yfcase/:yfcases_id', getResultsByYfcase);

// 獲取單一執行結果記錄
router.get('/:id', getResult);

// 創建執行結果記錄
router.post('/', resultValidation, createResult);

// 更新執行結果記錄
router.put('/:id', resultUpdateValidation, updateResult);

// 刪除執行結果記錄
router.delete('/:id', deleteResult);

// 批量刪除執行結果記錄
router.delete('/batch', batchDeleteResults);

module.exports = router;
