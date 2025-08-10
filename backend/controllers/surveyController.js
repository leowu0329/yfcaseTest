const Survey = require('../models/Survey');
const { validationResult } = require('express-validator');

// 獲取案件的所有勘查記錄
const getSurveysByYfcase = async (req, res) => {
  try {
    const surveys = await Survey.find({ yfcases_id: req.params.yfcases_id })
      .sort({ createdAt: -1 });
    res.json(surveys);
  } catch (error) {
    console.error('Error getting surveys:', error);
    res.status(500).json({ message: '獲取勘查記錄失敗' });
  }
};

// 獲取單一勘查記錄
const getSurvey = async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);
    if (!survey) {
      return res.status(404).json({ message: '找不到該勘查記錄' });
    }
    res.json(survey);
  } catch (error) {
    console.error('Error getting survey:', error);
    res.status(500).json({ message: '獲取勘查記錄失敗' });
  }
};

// 創建勘查記錄
const createSurvey = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: '資料驗證失敗',
      errors: errors.array() 
    });
  }

  try {
    const { 
      yfcases_id, surveyFirstDay, surveySecondDay,
      surveyForeclosureAnnouncementLink, survey988Link,
      surveyObjectPhotoLink, surveyForeclosureRecordLink,
      surveyObjectViewLink, surveyPagesViewLink, surveyMoneytViewLink
    } = req.body;

    console.log('Creating survey with data:', {
      yfcases_id, surveyFirstDay, surveySecondDay,
      surveyForeclosureAnnouncementLink, survey988Link,
      surveyObjectPhotoLink, surveyForeclosureRecordLink,
      surveyObjectViewLink, surveyPagesViewLink, surveyMoneytViewLink
    });

    const survey = new Survey({
      yfcases_id,
      surveyFirstDay: surveyFirstDay || new Date(),
      surveySecondDay: surveySecondDay || new Date(),
      surveyForeclosureAnnouncementLink,
      survey988Link,
      surveyObjectPhotoLink,
      surveyForeclosureRecordLink,
      surveyObjectViewLink,
      surveyPagesViewLink,
      surveyMoneytViewLink
    });

    console.log('Survey instance created:', survey);
    const savedSurvey = await survey.save();
    console.log('Survey saved successfully:', savedSurvey);
    res.status(201).json(savedSurvey);
  } catch (error) {
    console.error('Error creating survey:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      errors: error.errors
    });
    res.status(500).json({ 
      message: '創建勘查記錄時發生錯誤',
      error: error.message,
      details: error.errors
    });
  }
};

// 更新勘查記錄
const updateSurvey = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: '資料驗證失敗',
      errors: errors.array() 
    });
  }

  try {
    const { 
      surveyFirstDay, surveySecondDay,
      surveyForeclosureAnnouncementLink, survey988Link,
      surveyObjectPhotoLink, surveyForeclosureRecordLink,
      surveyObjectViewLink, surveyPagesViewLink, surveyMoneytViewLink
    } = req.body;

    const survey = await Survey.findById(req.params.id);
    if (!survey) {
      return res.status(404).json({ message: '找不到該勘查記錄' });
    }

    survey.surveyFirstDay = surveyFirstDay || survey.surveyFirstDay;
    survey.surveySecondDay = surveySecondDay || survey.surveySecondDay;
    survey.surveyForeclosureAnnouncementLink = surveyForeclosureAnnouncementLink;
    survey.survey988Link = survey988Link;
    survey.surveyObjectPhotoLink = surveyObjectPhotoLink;
    survey.surveyForeclosureRecordLink = surveyForeclosureRecordLink;
    survey.surveyObjectViewLink = surveyObjectViewLink;
    survey.surveyPagesViewLink = surveyPagesViewLink;
    survey.surveyMoneytViewLink = surveyMoneytViewLink;

    const updatedSurvey = await survey.save();
    res.json(updatedSurvey);
  } catch (error) {
    console.error('Error updating survey:', error);
    res.status(500).json({ message: '更新勘查記錄時發生錯誤' });
  }
};

// 刪除勘查記錄
const deleteSurvey = async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);
    if (!survey) {
      return res.status(404).json({ message: '找不到該勘查記錄' });
    }

    await Survey.findByIdAndDelete(req.params.id);
    res.json({ message: '勘查記錄刪除成功' });
  } catch (error) {
    console.error('Error deleting survey:', error);
    res.status(500).json({ message: '刪除勘查記錄時發生錯誤' });
  }
};

// 批量刪除勘查記錄
const batchDeleteSurveys = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: '請提供要刪除的勘查記錄ID' });
    }

    const result = await Survey.deleteMany({ _id: { $in: ids } });
    res.json({ 
      message: `成功刪除 ${result.deletedCount} 筆勘查記錄`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error batch deleting surveys:', error);
    res.status(500).json({ message: '批量刪除勘查記錄時發生錯誤' });
  }
};

module.exports = {
  getSurveysByYfcase,
  getSurvey,
  createSurvey,
  updateSurvey,
  deleteSurvey,
  batchDeleteSurveys
};
