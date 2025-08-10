const Build = require('../models/Build');
const { validationResult } = require('express-validator');

// @desc    獲取案件的所有建物
// @route   GET /api/builds/yfcase/:yfcases_id
// @access  Private
const getBuildsByYfcase = async (req, res) => {
  try {
    const builds = await Build.find({ yfcases_id: req.params.yfcases_id })
      .sort({ createdAt: -1 });
    
    res.json(builds);
  } catch (error) {
    console.error('Error fetching builds by yfcase:', error);
    res.status(500).json({ message: '獲取建物資料時發生錯誤' });
  }
};

// @desc    獲取單一建物
// @route   GET /api/builds/:id
// @access  Private
const getBuild = async (req, res) => {
  try {
    const build = await Build.findById(req.params.id);
    
    if (!build) {
      return res.status(404).json({ message: '找不到該建物' });
    }
    
    res.json(build);
  } catch (error) {
    console.error('Error fetching build:', error);
    res.status(500).json({ message: '獲取建物資料時發生錯誤' });
  }
};

// @desc    創建新建物
// @route   POST /api/builds
// @access  Private
const createBuild = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { 
      yfcases_id, 
      buildNumber, 
      buildUrl, 
      buildArea, 
      buildHoldingPointPersonal, 
      buildHoldingPointAll, 
      buildTypeUse, 
      buildUsePartition, 
      buildRemark 
    } = req.body;
    
    console.log('Creating build with data:', {
      yfcases_id, 
      buildNumber, 
      buildUrl, 
      buildArea, 
      buildHoldingPointPersonal, 
      buildHoldingPointAll, 
      buildTypeUse, 
      buildUsePartition, 
      buildRemark 
    });
    
    // 手動計算計算後建坪
    let buildCalculatedArea = 0;
    if (buildArea && buildHoldingPointPersonal && buildHoldingPointAll && buildHoldingPointAll > 0) {
      if (buildTypeUse === '增建-持分後坪數打對折') {
        buildCalculatedArea = Math.round((buildHoldingPointPersonal / buildHoldingPointAll) * buildArea * 0.5 * 100) / 100;
      } else {
        buildCalculatedArea = Math.round((buildHoldingPointPersonal / buildHoldingPointAll) * buildArea * 100) / 100;
      }
    }
    
    console.log('Calculated buildCalculatedArea:', buildCalculatedArea);
    
    const build = new Build({
      yfcases_id,
      buildNumber,
      buildUrl,
      buildArea,
      buildHoldingPointPersonal,
      buildHoldingPointAll,
      buildTypeUse,
      buildUsePartition,
      buildRemark,
      buildCalculatedArea
    });
    
    console.log('Build instance created:', build);
    
    const savedBuild = await build.save();
    console.log('Build saved successfully:', savedBuild);
    
    res.status(201).json(savedBuild);
  } catch (error) {
    console.error('Error creating build:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      errors: error.errors
    });
    res.status(500).json({ 
      message: '創建建物時發生錯誤',
      error: error.message,
      details: error.errors
    });
  }
};

// @desc    更新建物
// @route   PUT /api/builds/:id
// @access  Private
const updateBuild = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { 
      buildNumber, 
      buildUrl, 
      buildArea, 
      buildHoldingPointPersonal, 
      buildHoldingPointAll, 
      buildTypeUse, 
      buildUsePartition, 
      buildRemark 
    } = req.body;
    
    const build = await Build.findById(req.params.id);
    if (!build) {
      return res.status(404).json({ message: '找不到該建物' });
    }
    
    // 手動計算計算後建坪
    let buildCalculatedArea = 0;
    if (buildArea && buildHoldingPointPersonal && buildHoldingPointAll && buildHoldingPointAll > 0) {
      if (buildTypeUse === '增建-持分後坪數打對折') {
        buildCalculatedArea = Math.round((buildHoldingPointPersonal / buildHoldingPointAll) * buildArea * 0.5 * 100) / 100;
      } else {
        buildCalculatedArea = Math.round((buildHoldingPointPersonal / buildHoldingPointAll) * buildArea * 100) / 100;
      }
    }
    
    build.buildNumber = buildNumber;
    build.buildUrl = buildUrl;
    build.buildArea = buildArea;
    build.buildHoldingPointPersonal = buildHoldingPointPersonal;
    build.buildHoldingPointAll = buildHoldingPointAll;
    build.buildTypeUse = buildTypeUse;
    build.buildUsePartition = buildUsePartition;
    build.buildRemark = buildRemark;
    build.buildCalculatedArea = buildCalculatedArea;
    
    const updatedBuild = await build.save();
    res.json(updatedBuild);
  } catch (error) {
    console.error('Error updating build:', error);
    res.status(500).json({ message: '更新建物時發生錯誤' });
  }
};

// @desc    刪除建物
// @route   DELETE /api/builds/:id
// @access  Private
const deleteBuild = async (req, res) => {
  try {
    const build = await Build.findById(req.params.id);
    
    if (!build) {
      return res.status(404).json({ message: '找不到該建物' });
    }
    
    await build.deleteOne();
    res.json({ message: '建物已成功刪除' });
  } catch (error) {
    console.error('Error deleting build:', error);
    res.status(500).json({ message: '刪除建物時發生錯誤' });
  }
};

// @desc    批量刪除建物
// @route   DELETE /api/builds/batch
// @access  Private
const batchDeleteBuilds = async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: '請提供要刪除的建物ID列表' });
    }
    
    const result = await Build.deleteMany({ _id: { $in: ids } });
    
    res.json({ 
      message: `成功刪除 ${result.deletedCount} 個建物`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error batch deleting builds:', error);
    res.status(500).json({ message: '批量刪除建物時發生錯誤' });
  }
};

module.exports = {
  getBuildsByYfcase,
  getBuild,
  createBuild,
  updateBuild,
  deleteBuild,
  batchDeleteBuilds
};
