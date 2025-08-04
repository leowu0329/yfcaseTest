const Yfcase = require('../models/Yfcase');
const { validationResult } = require('express-validator');

// @desc    獲取所有案件
// @route   GET /api/yfcases
// @access  Private
const getYfcases = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // 搜尋條件
    const searchQuery = {};
    
    if (req.query.caseNumber) {
      searchQuery.caseNumber = { $regex: req.query.caseNumber, $options: 'i' };
    }
    
    if (req.query.company) {
      searchQuery.company = req.query.company;
    }
    
    if (req.query.status) {
      searchQuery.status = req.query.status;
    }
    
    if (req.query.city) {
      searchQuery.city = { $regex: req.query.city, $options: 'i' };
    }
    
    if (req.query.responsiblePerson) {
      searchQuery.responsiblePerson = { $regex: req.query.responsiblePerson, $options: 'i' };
    }

    // 排序
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const sort = { [sortBy]: sortOrder };

    const yfcases = await Yfcase.find(searchQuery)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Yfcase.countDocuments(searchQuery);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: yfcases,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error('獲取案件列表錯誤:', error);
    res.status(500).json({ 
      success: false, 
      message: '獲取案件列表失敗' 
    });
  }
};

// @desc    獲取單一案件
// @route   GET /api/yfcases/:id
// @access  Private
const getYfcase = async (req, res) => {
  try {
    const yfcase = await Yfcase.findById(req.params.id);
    
    if (!yfcase) {
      return res.status(404).json({ 
        success: false, 
        message: '案件不存在' 
      });
    }

    res.json({
      success: true,
      data: yfcase
    });
  } catch (error) {
    console.error('獲取案件錯誤:', error);
    res.status(500).json({ 
      success: false, 
      message: '獲取案件失敗' 
    });
  }
};

// @desc    創建新案件
// @route   POST /api/yfcases
// @access  Private
const createYfcase = async (req, res) => {
  try {
    // 檢查驗證錯誤
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        message: '驗證失敗',
        errors: errors.array() 
      });
    }

    const {
      caseNumber,
      company,
      status,
      city,
      district,
      sectionNumber,
      subsection,
      village,
      neighborhood,
      street,
      section,
      lane,
      alley,
      number,
      floor,
      responsiblePerson
    } = req.body;

    // 檢查案號是否已存在
    const existingCase = await Yfcase.findOne({ caseNumber });
    if (existingCase) {
      return res.status(400).json({ 
        success: false,
        message: '案號已存在' 
      });
    }

    // 創建案件
    const yfcase = await Yfcase.create({
      caseNumber,
      company,
      status,
      city,
      district,
      sectionNumber,
      subsection,
      village,
      neighborhood,
      street,
      section,
      lane,
      alley,
      number,
      floor,
      responsiblePerson: responsiblePerson || req.user.username // 如果沒有提供，使用當前登入用戶
    });

    res.status(201).json({
      success: true,
      message: '案件創建成功',
      data: yfcase
    });
  } catch (error) {
    console.error('創建案件錯誤:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false,
        message: '案號已存在' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: '創建案件失敗' 
    });
  }
};

// @desc    更新案件
// @route   PUT /api/yfcases/:id
// @access  Private
const updateYfcase = async (req, res) => {
  try {
    // 檢查驗證錯誤
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        message: '驗證失敗',
        errors: errors.array() 
      });
    }

    const yfcase = await Yfcase.findById(req.params.id);
    
    if (!yfcase) {
      return res.status(404).json({ 
        success: false, 
        message: '案件不存在' 
      });
    }

    // 如果更新案號，檢查是否與其他案件重複
    if (req.body.caseNumber && req.body.caseNumber !== yfcase.caseNumber) {
      const existingCase = await Yfcase.findOne({ 
        caseNumber: req.body.caseNumber,
        _id: { $ne: req.params.id }
      });
      
      if (existingCase) {
        return res.status(400).json({ 
          success: false,
          message: '案號已存在' 
        });
      }
    }

    // 更新案件
    const updatedYfcase = await Yfcase.findByIdAndUpdate(
      req.params.id,
      req.body,
      { 
        new: true, 
        runValidators: true 
      }
    );

    res.json({
      success: true,
      message: '案件更新成功',
      data: updatedYfcase
    });
  } catch (error) {
    console.error('更新案件錯誤:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false,
        message: '案號已存在' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: '更新案件失敗' 
    });
  }
};

// @desc    刪除案件
// @route   DELETE /api/yfcases/:id
// @access  Private
const deleteYfcase = async (req, res) => {
  try {
    const yfcase = await Yfcase.findById(req.params.id);
    
    if (!yfcase) {
      return res.status(404).json({ 
        success: false, 
        message: '案件不存在' 
      });
    }

    await Yfcase.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: '案件刪除成功'
    });
  } catch (error) {
    console.error('刪除案件錯誤:', error);
    res.status(500).json({ 
      success: false, 
      message: '刪除案件失敗' 
    });
  }
};

// @desc    批量刪除案件
// @route   DELETE /api/yfcases/batch
// @access  Private
const batchDeleteYfcases = async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: '請提供要刪除的案件ID列表' 
      });
    }

    const result = await Yfcase.deleteMany({ _id: { $in: ids } });

    res.json({
      success: true,
      message: `成功刪除 ${result.deletedCount} 個案件`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('批量刪除案件錯誤:', error);
    res.status(500).json({ 
      success: false, 
      message: '批量刪除案件失敗' 
    });
  }
};

// @desc    獲取案件統計
// @route   GET /api/yfcases/stats
// @access  Private
const getYfcaseStats = async (req, res) => {
  try {
    const stats = await Yfcase.aggregate([
      {
        $group: {
          _id: null,
          totalCases: { $sum: 1 },
          inProgressCases: {
            $sum: { $cond: [{ $eq: ['$status', '在途'] }, 1, 0] }
          },
          completedCases: {
            $sum: { $cond: [{ $eq: ['$status', '結案'] }, 1, 0] }
          }
        }
      }
    ]);

    const companyStats = await Yfcase.aggregate([
      {
        $group: {
          _id: '$company',
          count: { $sum: 1 }
        }
      }
    ]);

    const cityStats = await Yfcase.aggregate([
      {
        $group: {
          _id: '$city',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || { totalCases: 0, inProgressCases: 0, completedCases: 0 },
        byCompany: companyStats,
        byCity: cityStats
      }
    });
  } catch (error) {
    console.error('獲取案件統計錯誤:', error);
    res.status(500).json({ 
      success: false, 
      message: '獲取案件統計失敗' 
    });
  }
};

module.exports = {
  getYfcases,
  getYfcase,
  createYfcase,
  updateYfcase,
  deleteYfcase,
  batchDeleteYfcases,
  getYfcaseStats
}; 