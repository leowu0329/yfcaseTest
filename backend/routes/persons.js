const express = require('express');
const { body } = require('express-validator');
const {
  getPersonsByYfcase,
  getPerson,
  createPerson,
  updatePerson,
  deletePerson,
  batchDeletePersons
} = require('../controllers/personController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// 所有路由都需要驗證
router.use(protect);

// 驗證規則
const personValidation = [
  body('yfcases_id')
    .notEmpty()
    .withMessage('案件ID為必填欄位')
    .isMongoId()
    .withMessage('案件ID格式不正確'),
  body('身份')
    .isIn(['債權人', '債務人'])
    .withMessage('身份必須是債權人或債務人'),
  body('姓名')
    .notEmpty()
    .withMessage('姓名為必填欄位')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('姓名長度必須在1-50個字元之間'),
  body('電話')
    .notEmpty()
    .withMessage('電話為必填欄位')
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage('電話長度必須在1-20個字元之間')
];

// 路由定義
router.route('/')
  .post(personValidation, createPerson);

router.route('/batch')
  .delete(batchDeletePersons);

router.route('/yfcase/:yfcases_id')
  .get(getPersonsByYfcase);

router.route('/:id')
  .get(getPerson)
  .put(personValidation, updatePerson)
  .delete(deletePerson);

module.exports = router; 