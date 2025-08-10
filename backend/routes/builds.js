const express = require('express');
const { body } = require('express-validator');
const {
  getBuildsByYfcase,
  getBuild,
  createBuild,
  updateBuild,
  deleteBuild,
  batchDeleteBuilds
} = require('../controllers/buildController');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect); // All routes protected

const buildValidation = [
  body('yfcases_id')
    .notEmpty()
    .withMessage('案件ID為必填欄位')
    .isMongoId()
    .withMessage('案件ID格式不正確'),
  body('buildNumber')
    .notEmpty()
    .withMessage('建號為必填欄位')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('建號長度必須在1-100個字元之間'),
  body('buildUrl')
    .optional()
    .trim()
    .isURL()
    .withMessage('連結格式不正確，必須是有效的URL'),
  body('buildArea')
    .notEmpty()
    .withMessage('建坪為必填欄位')
    .isFloat({ min: 0 })
    .withMessage('建坪必須為正數'),
  body('buildHoldingPointPersonal')
    .notEmpty()
    .withMessage('個人持分為必填欄位')
    .isInt({ min: 1 })
    .withMessage('個人持分必須為正整數'),
  body('buildHoldingPointAll')
    .notEmpty()
    .withMessage('所有持分為必填欄位')
    .isInt({ min: 1 })
    .withMessage('所有持分必須為正整數'),
  body('buildTypeUse')
    .notEmpty()
    .withMessage('建物型為必填欄位')
    .isIn([
      '公設',
      '公寓-5樓含以下無電梯',
      '透天厝',
      '店面-店舖',
      '辦公商業大樓',
      '住宅大樓-11層含以上有電梯',
      '華廈-10層含以下有電梯',
      '套房',
      '農舍',
      '增建-持分後坪數打對折'
    ])
    .withMessage('建物型選項不正確'),
  body('buildUsePartition')
    .notEmpty()
    .withMessage('使用分區為必填欄位')
    .isIn([
      '第一種住宅區',
      '第二種住宅區',
      '第三種住宅區',
      '第四種住宅區',
      '第五種住宅區',
      '第一種商業區',
      '第二種商業區',
      '第三種商業區',
      '第四種商業區',
      '第二種工業區',
      '第三種工業區',
      '行政區',
      '文教區',
      '倉庫區',
      '風景區',
      '農業區',
      '保護區',
      '行水區',
      '保存區',
      '特定專用區'
    ])
    .withMessage('使用分區選項不正確'),
  body('buildRemark')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('備註不能超過500個字元')
];

router.route('/').post(buildValidation, createBuild);
router.route('/batch').delete(batchDeleteBuilds);
router.route('/yfcase/:yfcases_id').get(getBuildsByYfcase);
router.route('/:id').get(getBuild).put(buildValidation, updateBuild).delete(deleteBuild);

module.exports = router;
