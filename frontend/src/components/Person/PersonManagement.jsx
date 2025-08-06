import React, { useState, useEffect } from 'react';
import { personAPI } from '../../utils/api';
import PersonTable from './PersonTable';
import PersonForm from './PersonForm';

const PersonManagement = ({ yfcases_id }) => {
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPerson, setEditingPerson] = useState(null);
  const [selectedPersons, setSelectedPersons] = useState([]);
  const [formData, setFormData] = useState({
    yfcases_id: yfcases_id,
    身份: '債務人',
    姓名: '',
    電話: ''
  });

  // 載入人員列表
  const loadPersons = async () => {
    try {
      setLoading(true);
      const response = await personAPI.getByYfcase(yfcases_id);
      setPersons(response.data.data);
    } catch (error) {
      console.error('載入人員失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  // 重置表單
  const resetForm = () => {
    setFormData({
      yfcases_id: yfcases_id,
      身份: '債務人',
      姓名: '',
      電話: ''
    });
  };

  // 提交表單
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPerson) {
        await personAPI.update(editingPerson._id, formData);
      } else {
        await personAPI.create(formData);
      }
      setShowForm(false);
      setEditingPerson(null);
      resetForm();
      loadPersons();
    } catch (error) {
      console.error('保存人員失敗:', error);
    }
  };

  // 編輯人員
  const handleEdit = (person) => {
    setEditingPerson(person);
    setFormData({
      yfcases_id: yfcases_id,
      身份: person.身份,
      姓名: person.姓名,
      電話: person.電話
    });
    setShowForm(true);
  };

  // 刪除人員
  const handleDelete = async (id) => {
    if (window.confirm('確定要刪除這個人員嗎？')) {
      try {
        await personAPI.delete(id);
        loadPersons();
      } catch (error) {
        console.error('刪除人員失敗:', error);
      }
    }
  };

  // 批量刪除
  const handleBatchDelete = async () => {
    if (selectedPersons.length === 0) {
      alert('請選擇要刪除的人員');
      return;
    }
    
    if (window.confirm(`確定要刪除選中的 ${selectedPersons.length} 個人員嗎？`)) {
      try {
        await personAPI.batchDelete(selectedPersons);
        setSelectedPersons([]);
        loadPersons();
      } catch (error) {
        console.error('批量刪除失敗:', error);
      }
    }
  };

  // 選擇人員
  const handleSelectPerson = (id) => {
    setSelectedPersons(prev => 
      prev.includes(id) 
        ? prev.filter(personId => personId !== id)
        : [...prev, id]
    );
  };

  // 全選/取消全選
  const handleSelectAll = () => {
    if (selectedPersons.length === persons.length) {
      setSelectedPersons([]);
    } else {
      setSelectedPersons(persons.map(person => person._id));
    }
  };

  useEffect(() => {
    if (yfcases_id) {
      loadPersons();
    }
  }, [yfcases_id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">載入中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 操作按鈕 */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">人員管理</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setShowForm(true);
              setEditingPerson(null);
              resetForm();
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200"
          >
            新增人員
          </button>
          {selectedPersons.length > 0 && (
            <button
              onClick={handleBatchDelete}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-200"
            >
              批量刪除 ({selectedPersons.length})
            </button>
          )}
        </div>
      </div>

      {/* 人員表格 */}
      <PersonTable
        persons={persons}
        selectedPersons={selectedPersons}
        handleSelectAll={handleSelectAll}
        handleSelectPerson={handleSelectPerson}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />

      {/* 人員表單 */}
      <PersonForm
        showForm={showForm}
        setShowForm={setShowForm}
        editingPerson={editingPerson}
        setEditingPerson={setEditingPerson}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        resetForm={resetForm}
      />
    </div>
  );
};

export default PersonManagement; 