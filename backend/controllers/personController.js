const Person = require('../models/Person');
const { validationResult } = require('express-validator');

// @desc    獲取案件的所有人員
// @route   GET /api/persons/:yfcases_id
// @access  Private
const getPersonsByYfcase = async (req, res) => {
  try {
    const persons = await Person.find({ yfcases_id: req.params.yfcases_id })
      .sort({ 建立時間: -1 });

    res.json({
      success: true,
      data: persons
    });
  } catch (error) {
    console.error('獲取人員列表錯誤:', error);
    res.status(500).json({ 
      success: false, 
      message: '獲取人員列表失敗' 
    });
  }
};

// @desc    獲取單一人員
// @route   GET /api/persons/:id
// @access  Private
const getPerson = async (req, res) => {
  try {
    const person = await Person.findById(req.params.id);
    
    if (!person) {
      return res.status(404).json({ 
        success: false, 
        message: '人員不存在' 
      });
    }

    res.json({
      success: true,
      data: person
    });
  } catch (error) {
    console.error('獲取人員錯誤:', error);
    res.status(500).json({ 
      success: false, 
      message: '獲取人員失敗' 
    });
  }
};

// @desc    創建新人員
// @route   POST /api/persons
// @access  Private
const createPerson = async (req, res) => {
  try {
    // 檢查驗證錯誤
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '資料驗證失敗',
        errors: errors.array()
      });
    }

    const person = await Person.create(req.body);

    res.status(201).json({
      success: true,
      data: person
    });
  } catch (error) {
    console.error('創建人員錯誤:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: '人員資料已存在'
      });
    }
    res.status(500).json({ 
      success: false, 
      message: '創建人員失敗' 
    });
  }
};

// @desc    更新人員
// @route   PUT /api/persons/:id
// @access  Private
const updatePerson = async (req, res) => {
  try {
    // 檢查驗證錯誤
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '資料驗證失敗',
        errors: errors.array()
      });
    }

    const person = await Person.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!person) {
      return res.status(404).json({ 
        success: false, 
        message: '人員不存在' 
      });
    }

    res.json({
      success: true,
      data: person
    });
  } catch (error) {
    console.error('更新人員錯誤:', error);
    res.status(500).json({ 
      success: false, 
      message: '更新人員失敗' 
    });
  }
};

// @desc    刪除人員
// @route   DELETE /api/persons/:id
// @access  Private
const deletePerson = async (req, res) => {
  try {
    const person = await Person.findByIdAndDelete(req.params.id);

    if (!person) {
      return res.status(404).json({ 
        success: false, 
        message: '人員不存在' 
      });
    }

    res.json({
      success: true,
      message: '人員刪除成功'
    });
  } catch (error) {
    console.error('刪除人員錯誤:', error);
    res.status(500).json({ 
      success: false, 
      message: '刪除人員失敗' 
    });
  }
};

// @desc    批量刪除人員
// @route   DELETE /api/persons/batch
// @access  Private
const batchDeletePersons = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: '請提供要刪除的人員ID列表'
      });
    }

    const result = await Person.deleteMany({ _id: { $in: ids } });

    res.json({
      success: true,
      message: `成功刪除 ${result.deletedCount} 個人員`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('批量刪除人員錯誤:', error);
    res.status(500).json({ 
      success: false, 
      message: '批量刪除人員失敗' 
    });
  }
};

module.exports = {
  getPersonsByYfcase,
  getPerson,
  createPerson,
  updatePerson,
  deletePerson,
  batchDeletePersons
}; 