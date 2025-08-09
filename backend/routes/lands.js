const express = require('express');
const { body } = require('express-validator');
const {
  getLandsByYfcase,
  getLand,
  createLand,
  updateLand,
  deleteLand,
  batchDeleteLands,
} = require('../controllers/landController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// 所有土地路由需驗證
router.use(protect);

const landValidation = [
  body('yfcases_id').notEmpty().withMessage('案件ID為必填欄位').isMongoId().withMessage('案件ID格式不正確'),
  body('地號').notEmpty().withMessage('地號為必填欄位').isString().trim(),
  body('連結').optional({ nullable: true, checkFalsy: true }).isURL().withMessage('請輸入正確的網址'),
  body('地坪')
    .notEmpty()
    .withMessage('地坪為必填欄位')
    .bail()
    .custom((v) => !isNaN(v))
    .withMessage('地坪需為數字')
    .toFloat(),
  body('個人持分')
    .notEmpty()
    .withMessage('個人持分為必填欄位')
    .bail()
    .isInt({ min: 1 })
    .withMessage('個人持分需為正整數')
    .toInt(),
  body('所有持分')
    .notEmpty()
    .withMessage('所有持分為必填欄位')
    .bail()
    .isInt({ min: 1 })
    .withMessage('所有持分需為正整數')
    .toInt(),
  body('備註').optional({ nullable: true, checkFalsy: true }).isString().trim(),
];

router.route('/')
  .post(landValidation, createLand);

router.route('/batch')
  .delete(batchDeleteLands);

router.route('/yfcase/:yfcases_id')
  .get(getLandsByYfcase);

router.route('/:id')
  .get(getLand)
  .put(landValidation, updateLand)
  .delete(deleteLand);

module.exports = router;


