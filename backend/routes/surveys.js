const express = require('express');
const { body } = require('express-validator');
const {
  getSurveysByYfcase,
  getSurvey,
  createSurvey,
  updateSurvey,
  deleteSurvey,
  batchDeleteSurveys
} = require('../controllers/surveyController');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect); // All routes protected

const surveyValidation = [
  body('yfcases_id')
    .notEmpty()
    .withMessage('案件ID為必填欄位')
    .isMongoId()
    .withMessage('案件ID格式不正確'),
  body('surveyFirstDay')
    .optional()
    .isISO8601()
    .withMessage('初勘日格式不正確'),
  body('surveySecondDay')
    .optional()
    .isISO8601()
    .withMessage('會勘日格式不正確'),
  body('surveyForeclosureAnnouncementLink')
    .optional()
    .trim()
    .isURL()
    .withMessage('法拍公告連結格式不正確'),
  body('survey988Link')
    .optional()
    .trim()
    .isURL()
    .withMessage('998連結格式不正確'),
  body('surveyObjectPhotoLink')
    .optional()
    .trim()
    .isURL()
    .withMessage('物件照片連結格式不正確'),
  body('surveyForeclosureRecordLink')
    .optional()
    .trim()
    .isURL()
    .withMessage('法拍記錄連結格式不正確'),
  body('surveyObjectViewLink')
    .optional()
    .trim()
    .isURL()
    .withMessage('標的物連結格式不正確'),
  body('surveyPagesViewLink')
    .optional()
    .trim()
    .isURL()
    .withMessage('收發文簿連結格式不正確'),
  body('surveyMoneytViewLink')
    .optional()
    .trim()
    .isURL()
    .withMessage('流水帳連結格式不正確')
];

router.route('/').post(surveyValidation, createSurvey);
router.route('/batch').delete(batchDeleteSurveys);
router.route('/yfcase/:yfcases_id').get(getSurveysByYfcase);
router.route('/:id').get(getSurvey).put(surveyValidation, updateSurvey).delete(deleteSurvey);

module.exports = router;
