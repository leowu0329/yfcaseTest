const Land = require('../models/Land');
const { validationResult } = require('express-validator');

// 取得特定案件(yfcases_id)的土地清單
const getLandsByYfcase = async (req, res) => {
  try {
    const lands = await Land.find({ yfcases_id: req.params.yfcases_id }).sort({ 建立時間: -1 });
    res.json({ success: true, data: lands });
  } catch (error) {
    console.error('獲取土地清單錯誤:', error);
    res.status(500).json({ success: false, message: '獲取土地清單失敗' });
  }
};

// 取得單筆土地
const getLand = async (req, res) => {
  try {
    const land = await Land.findById(req.params.id);
    if (!land) {
      return res.status(404).json({ success: false, message: '土地不存在' });
    }
    res.json({ success: true, data: land });
  } catch (error) {
    console.error('獲取土地錯誤:', error);
    res.status(500).json({ success: false, message: '獲取土地失敗' });
  }
};

// 新增土地
const createLand = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: '資料驗證失敗', errors: errors.array() });
    }
    const land = await Land.create(req.body);
    res.status(201).json({ success: true, data: land });
  } catch (error) {
    console.error('新增土地錯誤:', error);
    res.status(500).json({ success: false, message: '新增土地失敗' });
  }
};

// 更新土地
const updateLand = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: '資料驗證失敗', errors: errors.array() });
    }
    const land = await Land.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!land) {
      return res.status(404).json({ success: false, message: '土地不存在' });
    }
    res.json({ success: true, data: land });
  } catch (error) {
    console.error('更新土地錯誤:', error);
    res.status(500).json({ success: false, message: '更新土地失敗' });
  }
};

// 刪除土地
const deleteLand = async (req, res) => {
  try {
    const land = await Land.findByIdAndDelete(req.params.id);
    if (!land) {
      return res.status(404).json({ success: false, message: '土地不存在' });
    }
    res.json({ success: true, message: '土地刪除成功' });
  } catch (error) {
    console.error('刪除土地錯誤:', error);
    res.status(500).json({ success: false, message: '刪除土地失敗' });
  }
};

// 批量刪除
const batchDeleteLands = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: '請提供要刪除的土地ID列表' });
    }
    const result = await Land.deleteMany({ _id: { $in: ids } });
    res.json({ success: true, message: `成功刪除 ${result.deletedCount} 筆土地`, deletedCount: result.deletedCount });
  } catch (error) {
    console.error('批量刪除土地錯誤:', error);
    res.status(500).json({ success: false, message: '批量刪除土地失敗' });
  }
};

module.exports = {
  getLandsByYfcase,
  getLand,
  createLand,
  updateLand,
  deleteLand,
  batchDeleteLands,
};


