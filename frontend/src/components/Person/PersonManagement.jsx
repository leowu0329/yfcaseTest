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

  useEffect(() => {
    if (yfcases_id) {
      loadPersons();
    }
  }, [yfcases_id]);

  const loadPersons = async () => {
    try {
      setLoading(true);
      const response = await personAPI.getByYfcase(yfcases_id);
      setPersons(response.data);
    } catch (error) {
      console.error('Error loading persons:', error);
      alert('載入人員資料失敗');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingPerson(null);
    setShowForm(false);
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingPerson) {
        await personAPI.update(editingPerson._id, formData);
        alert('人員更新成功');
      } else {
        await personAPI.create(formData);
        alert('人員新增成功');
      }
      loadPersons();
      resetForm();
    } catch (error) {
      console.error('Error submitting person:', error);
      alert(editingPerson ? '更新人員失敗' : '新增人員失敗');
    }
  };

  const handleEdit = (person) => {
    setEditingPerson(person);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('確定要刪除此人員嗎？')) {
      return;
    }

    try {
      await personAPI.delete(id);
      alert('人員刪除成功');
      loadPersons();
    } catch (error) {
      console.error('Error deleting person:', error);
      alert('刪除人員失敗');
    }
  };

  const handleBatchDelete = async () => {
    if (selectedPersons.length === 0) {
      alert('請選擇要刪除的人員');
      return;
    }

    if (!window.confirm(`確定要刪除選中的 ${selectedPersons.length} 個人員嗎？`)) {
      return;
    }

    try {
      await personAPI.batchDelete(selectedPersons);
      alert('批量刪除成功');
      setSelectedPersons([]);
      loadPersons();
    } catch (error) {
      console.error('Error batch deleting persons:', error);
      alert('批量刪除失敗');
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedPersons(persons.map(person => person._id));
    } else {
      setSelectedPersons([]);
    }
  };

  const handleSelectPerson = (id) => {
    setSelectedPersons(prev => 
      prev.includes(id) 
        ? prev.filter(personId => personId !== id)
        : [...prev, id]
    );
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <p className="mt-2 text-gray-600">載入中...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">人員管理</h3>
        <div className="flex space-x-3">
          {selectedPersons.length > 0 && (
            <button
              onClick={handleBatchDelete}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              批量刪除 ({selectedPersons.length})
            </button>
          )}
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            新增人員
          </button>
        </div>
      </div>

      {/* Table */}
      <PersonTable
        persons={persons}
        selectedPersons={selectedPersons}
        handleSelectAll={handleSelectAll}
        handleSelectPerson={handleSelectPerson}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />

      {/* Form Modal */}
      <PersonForm
        isOpen={showForm}
        onClose={resetForm}
        onSubmit={handleSubmit}
        editingPerson={editingPerson}
        yfcases_id={yfcases_id}
      />
    </div>
  );
};

export default PersonManagement; 