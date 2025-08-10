const Result = require('../models/Result');
const { validationResult } = require('express-validator');

// 獲取案件的所有執行結果記錄
const getResultsByYfcase = async (req, res) => {
  try {
    const { yfcases_id } = req.params;
    
    const results = await Result.find({ yfcases_id })
      .sort({ createdAt: -1 });
    
    res.json(results);
  } catch (error) {
    console.error('獲取執行結果記錄失敗:', error);
    res.status(500).json({ message: '獲取執行結果記錄失敗' });
  }
};

// 獲取單一執行結果記錄
const getResult = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await Result.findById(id);
    
    if (!result) {
      return res.status(404).json({ message: '執行結果記錄不存在' });
    }
    
    res.json(result);
  } catch (error) {
    console.error('獲取執行結果記錄失敗:', error);
    res.status(500).json({ message: '獲取執行結果記錄失敗' });
  }
};

// 創建執行結果記錄
const createResult = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: '輸入資料驗證失敗',
        errors: errors.array()
      });
    }

    const resultData = {
      ...req.body,
      stopBuyDate: req.body.stopBuyDate || new Date()
    };

    const result = new Result(resultData);
    await result.save();
    
    res.status(201).json(result);
  } catch (error) {
    console.error('創建執行結果記錄失敗:', error);
    res.status(500).json({ message: '創建執行結果記錄失敗' });
  }
};

// 更新執行結果記錄
const updateResult = async (req, res) => {
  try {
    const { id } = req.params;
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: '輸入資料驗證失敗',
        errors: errors.array()
      });
    }

    const result = await Result.findByIdAndUpdate(
      id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!result) {
      return res.status(404).json({ message: '執行結果記錄不存在' });
    }
    
    res.json(result);
  } catch (error) {
    console.error('更新執行結果記錄失敗:', error);
    res.status(500).json({ message: '更新執行結果記錄失敗' });
  }
};

// 刪除執行結果記錄
const deleteResult = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await Result.findByIdAndDelete(id);
    
    if (!result) {
      return res.status(404).json({ message: '執行結果記錄不存在' });
    }
    
    res.json({ message: '執行結果記錄已刪除' });
  } catch (error) {
    console.error('刪除執行結果記錄失敗:', error);
    res.status(500).json({ message: '刪除執行結果記錄失敗' });
  }
};

// 批量刪除執行結果記錄
const batchDeleteResults = async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: '請提供要刪除的記錄ID列表' });
    }
    
    const deleteResult = await Result.deleteMany({ _id: { $in: ids } });
    
    res.json({ 
      message: `成功刪除 ${deleteResult.deletedCount} 筆執行結果記錄`,
      deletedCount: deleteResult.deletedCount
    });
  } catch (error) {
    console.error('批量刪除執行結果記錄失敗:', error);
    res.status(500).json({ message: '批量刪除執行結果記錄失敗' });
  }
};

module.exports = {
  getResultsByYfcase,
  getResult,
  createResult,
  updateResult,
  deleteResult,
  batchDeleteResults
};
