const Person = require('../models/Person');
const { validationResult } = require('express-validator');

// @desc    獲取案件的所有人員
// @route   GET /api/persons/yfcase/:yfcases_id
// @access  Private
const getPersonsByYfcase = async (req, res) => {
  try {
    const persons = await Person.find({ yfcases_id: req.params.yfcases_id })
      .sort({ createdAt: -1 });
    
    res.json(persons);
  } catch (error) {
    console.error('Error fetching persons by yfcase:', error);
    res.status(500).json({ message: '獲取人員資料時發生錯誤' });
  }
};

// @desc    獲取單一人員
// @route   GET /api/persons/:id
// @access  Private
const getPerson = async (req, res) => {
  try {
    const person = await Person.findById(req.params.id);
    
    if (!person) {
      return res.status(404).json({ message: '找不到該人員' });
    }
    
    res.json(person);
  } catch (error) {
    console.error('Error fetching person:', error);
    res.status(500).json({ message: '獲取人員資料時發生錯誤' });
  }
};

// @desc    創建新人員
// @route   POST /api/persons
// @access  Private
const createPerson = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { yfcases_id, personType, personName, personMobile } = req.body;
    
    const person = new Person({
      yfcases_id,
      personType,
      personName,
      personMobile
    });
    
    const savedPerson = await person.save();
    res.status(201).json(savedPerson);
  } catch (error) {
    console.error('Error creating person:', error);
    res.status(500).json({ message: '創建人員時發生錯誤' });
  }
};

// @desc    更新人員
// @route   PUT /api/persons/:id
// @access  Private
const updatePerson = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { personType, personName, personMobile } = req.body;
    
    const person = await Person.findById(req.params.id);
    if (!person) {
      return res.status(404).json({ message: '找不到該人員' });
    }
    
    person.personType = personType;
    person.personName = personName;
    person.personMobile = personMobile;
    
    const updatedPerson = await person.save();
    res.json(updatedPerson);
  } catch (error) {
    console.error('Error updating person:', error);
    res.status(500).json({ message: '更新人員時發生錯誤' });
  }
};

// @desc    刪除人員
// @route   DELETE /api/persons/:id
// @access  Private
const deletePerson = async (req, res) => {
  try {
    const person = await Person.findById(req.params.id);
    
    if (!person) {
      return res.status(404).json({ message: '找不到該人員' });
    }
    
    await person.deleteOne();
    res.json({ message: '人員已成功刪除' });
  } catch (error) {
    console.error('Error deleting person:', error);
    res.status(500).json({ message: '刪除人員時發生錯誤' });
  }
};

// @desc    批量刪除人員
// @route   DELETE /api/persons/batch
// @access  Private
const batchDeletePersons = async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: '請提供要刪除的人員ID列表' });
    }
    
    const result = await Person.deleteMany({ _id: { $in: ids } });
    
    res.json({ 
      message: `成功刪除 ${result.deletedCount} 個人員`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error batch deleting persons:', error);
    res.status(500).json({ message: '批量刪除人員時發生錯誤' });
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