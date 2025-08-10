const express = require('express');
const { body } = require('express-validator');
const {
  getFinalDecisionsByYfcase,
  getFinalDecision,
  createFinalDecision,
  updateFinalDecision,
  deleteFinalDecision,
  batchDeleteFinalDecisions
} = require('../controllers/finalDecisionController');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect); // All routes protected

const finalDecisionValidation = [
  body('yfcases_id')
    .notEmpty()
    .withMessage('案件ID為必填欄位')
    .isMongoId()
    .withMessage('案件ID格式不正確'),
  body('finalDecision')
    .notEmpty()
    .withMessage('最終判定為必填欄位')
    .isIn(['1拍進場', '2拍進場', '3拍進場', '4拍進場', '放棄'])
    .withMessage('最終判定必須是以下選項之一：1拍進場、2拍進場、3拍進場、4拍進場、放棄'),
  body('finalDecisionRemark')
    .optional({ nullable: true, checkFalsy: true })
    .trim(),
  body('finalDecisionType')
    .notEmpty()
    .withMessage('分類為必填欄位')
    .isIn(['區域負責人', '副署人員A', '副署人員B'])
    .withMessage('分類必須是以下選項之一：區域負責人、副署人員A、副署人員B'),
  body('regionalHead')
    .notEmpty()
    .withMessage('人員為必填欄位')
    .trim(),
  body('regionalHeadDate')
    .optional()
    .isISO8601()
    .withMessage('簽核日期格式不正確'),
  body('regionalHeadWorkArea')
    .notEmpty()
    .withMessage('工作轄區為必填欄位')
    .isIn(['雙北桃竹苗', '中彰投', '雲嘉南', '高高屏'])
    .withMessage('工作轄區必須是以下選項之一：雙北桃竹苗、中彰投、雲嘉南、高高屏')
];

// 更新最終判定記錄的驗證規則（不包含 yfcases_id）
const finalDecisionUpdateValidation = [
  body('finalDecision')
    .notEmpty()
    .withMessage('最終判定為必填欄位')
    .isIn(['1拍進場', '2拍進場', '3拍進場', '4拍進場', '放棄'])
    .withMessage('最終判定必須是以下選項之一：1拍進場、2拍進場、3拍進場、4拍進場、放棄'),
  body('finalDecisionRemark')
    .optional({ nullable: true, checkFalsy: true })
    .trim(),
  body('finalDecisionType')
    .notEmpty()
    .withMessage('分類為必填欄位')
    .isIn(['區域負責人', '副署人員A', '副署人員B'])
    .withMessage('分類必須是以下選項之一：區域負責人、副署人員A、副署人員B'),
  body('regionalHead')
    .notEmpty()
    .withMessage('人員為必填欄位')
    .trim(),
  body('regionalHeadDate')
    .optional()
    .isISO8601()
    .withMessage('簽核日期格式不正確'),
  body('regionalHeadWorkArea')
    .notEmpty()
    .withMessage('工作轄區為必填欄位')
    .isIn(['雙北桃竹苗', '中彰投', '雲嘉南', '高高屏'])
    .withMessage('工作轄區必須是以下選項之一：雙北桃竹苗、中彰投、雲嘉南、高高屏')
];

router.route('/').post(finalDecisionValidation, createFinalDecision);
router.route('/batch').delete(batchDeleteFinalDecisions);
router.route('/yfcase/:yfcases_id').get(getFinalDecisionsByYfcase);
router.route('/:id').get(getFinalDecision).put(finalDecisionUpdateValidation, updateFinalDecision).delete(deleteFinalDecision);

module.exports = router;
