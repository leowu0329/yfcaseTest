const FinalDecision = require('../models/FinalDecision');
const { validationResult } = require('express-validator');

// 獲取案件的所有最終判定記錄
const getFinalDecisionsByYfcase = async (req, res) => {
  try {
    const finalDecisions = await FinalDecision.find({ yfcases_id: req.params.yfcases_id })
      .sort({ createdAt: -1 });
    res.json(finalDecisions);
  } catch (error) {
    console.error('Error getting final decisions:', error);
    res.status(500).json({ message: '獲取最終判定記錄失敗' });
  }
};

// 獲取單一最終判定記錄
const getFinalDecision = async (req, res) => {
  try {
    const finalDecision = await FinalDecision.findById(req.params.id);
    if (!finalDecision) {
      return res.status(404).json({ message: '找不到該最終判定記錄' });
    }
    res.json(finalDecision);
  } catch (error) {
    console.error('Error getting final decision:', error);
    res.status(500).json({ message: '獲取最終判定記錄失敗' });
  }
};

// 創建最終判定記錄
const createFinalDecision = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error('Final decision creation validation errors:', errors.array());
    return res.status(400).json({ 
      message: '資料驗證失敗',
      errors: errors.array() 
    });
  }

  try {
    const { 
      yfcases_id, finalDecision, finalDecisionRemark,
      finalDecisionType, regionalHead, regionalHeadDate,
      regionalHeadWorkArea
    } = req.body;

    console.log('Creating final decision with data:', {
      yfcases_id, finalDecision, finalDecisionRemark,
      finalDecisionType, regionalHead, regionalHeadDate,
      regionalHeadWorkArea
    });

    const finalDecisionRecord = new FinalDecision({
      yfcases_id,
      finalDecision,
      finalDecisionRemark,
      finalDecisionType,
      regionalHead,
      regionalHeadDate: regionalHeadDate || new Date(),
      regionalHeadWorkArea
    });

    console.log('Final decision instance created:', finalDecisionRecord);
    const savedFinalDecision = await finalDecisionRecord.save();
    console.log('Final decision saved successfully:', savedFinalDecision);
    res.status(201).json(savedFinalDecision);
  } catch (error) {
    console.error('Error creating final decision:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      errors: error.errors
    });
    res.status(500).json({ 
      message: '創建最終判定記錄時發生錯誤',
      error: error.message,
      details: error.errors
    });
  }
};

// 更新最終判定記錄
const updateFinalDecision = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error('Final decision update validation errors:', errors.array());
    console.error('Request body:', req.body);
    console.error('Request params:', req.params);
    return res.status(400).json({ 
      message: '資料驗證失敗',
      errors: errors.array() 
    });
  }

  try {
    const { 
      finalDecision, finalDecisionRemark, finalDecisionType,
      regionalHead, regionalHeadDate, regionalHeadWorkArea
    } = req.body;

    const finalDecisionRecord = await FinalDecision.findById(req.params.id);
    if (!finalDecisionRecord) {
      return res.status(404).json({ message: '找不到該最終判定記錄' });
    }

    // 更新欄位
    if (finalDecision !== undefined) {
      finalDecisionRecord.finalDecision = finalDecision;
    }
    if (finalDecisionRemark !== undefined) {
      finalDecisionRecord.finalDecisionRemark = finalDecisionRemark;
    }
    if (finalDecisionType !== undefined) {
      finalDecisionRecord.finalDecisionType = finalDecisionType;
    }
    if (regionalHead !== undefined) {
      finalDecisionRecord.regionalHead = regionalHead;
    }
    if (regionalHeadDate !== undefined) {
      finalDecisionRecord.regionalHeadDate = regionalHeadDate;
    }
    if (regionalHeadWorkArea !== undefined) {
      finalDecisionRecord.regionalHeadWorkArea = regionalHeadWorkArea;
    }

    const updatedFinalDecision = await finalDecisionRecord.save();
    console.log('Final decision updated successfully:', updatedFinalDecision);
    res.json(updatedFinalDecision);
  } catch (error) {
    console.error('Error updating final decision:', error);
    res.status(500).json({ message: '更新最終判定記錄時發生錯誤' });
  }
};

// 刪除最終判定記錄
const deleteFinalDecision = async (req, res) => {
  try {
    const finalDecision = await FinalDecision.findById(req.params.id);
    if (!finalDecision) {
      return res.status(404).json({ message: '找不到該最終判定記錄' });
    }

    await FinalDecision.findByIdAndDelete(req.params.id);
    res.json({ message: '最終判定記錄刪除成功' });
  } catch (error) {
    console.error('Error deleting final decision:', error);
    res.status(500).json({ message: '刪除最終判定記錄時發生錯誤' });
  }
};

// 批量刪除最終判定記錄
const batchDeleteFinalDecisions = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: '請提供要刪除的最終判定記錄ID' });
    }

    const result = await FinalDecision.deleteMany({ _id: { $in: ids } });
    res.json({ 
      message: `成功刪除 ${result.deletedCount} 筆最終判定記錄`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error batch deleting final decisions:', error);
    res.status(500).json({ message: '批量刪除最終判定記錄時發生錯誤' });
  }
};

module.exports = {
  getFinalDecisionsByYfcase,
  getFinalDecision,
  createFinalDecision,
  updateFinalDecision,
  deleteFinalDecision,
  batchDeleteFinalDecisions
};
