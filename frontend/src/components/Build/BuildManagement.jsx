import React, { useState, useEffect } from 'react';
import BuildTable from './BuildTable';
import BuildForm from './BuildForm';
import { buildAPI } from '../../utils/api';

const BuildManagement = ({ yfcases_id }) => {
  const [builds, setBuilds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBuild, setEditingBuild] = useState(null);
  const [selectedBuilds, setSelectedBuilds] = useState([]);

  useEffect(() => {
    if (yfcases_id) {
      loadBuilds();
    }
  }, [yfcases_id]);

  const loadBuilds = async () => {
    try {
      setLoading(true);
      const response = await buildAPI.getByYfcase(yfcases_id);
      setBuilds(response.data);
    } catch (error) {
      console.error('Error loading builds:', error);
      alert('載入建物資料失敗');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingBuild(null);
    setShowForm(false);
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingBuild) {
        await buildAPI.update(editingBuild._id, formData);
        alert('建物更新成功');
      } else {
        await buildAPI.create(formData);
        alert('建物新增成功');
      }
      loadBuilds();
      resetForm();
    } catch (error) {
      console.error('Error submitting build:', error);
      alert(editingBuild ? '更新建物失敗' : '新增建物失敗');
    }
  };

  const handleEdit = (build) => {
    setEditingBuild(build);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('確定要刪除此建物嗎？')) {
      return;
    }
    try {
      await buildAPI.delete(id);
      alert('建物刪除成功');
      loadBuilds();
    } catch (error) {
      console.error('Error deleting build:', error);
      alert('刪除建物失敗');
    }
  };

  const handleBatchDelete = async () => {
    if (selectedBuilds.length === 0) {
      alert('請選擇要刪除的建物');
      return;
    }
    if (!window.confirm(`確定要刪除選中的 ${selectedBuilds.length} 個建物嗎？`)) {
      return;
    }
    try {
      await buildAPI.batchDelete(selectedBuilds);
      alert('批量刪除成功');
      setSelectedBuilds([]);
      loadBuilds();
    } catch (error) {
      console.error('Error batch deleting builds:', error);
      alert('批量刪除失敗');
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedBuilds(builds.map(build => build._id));
    } else {
      setSelectedBuilds([]);
    }
  };

  const handleSelectBuild = (id) => {
    setSelectedBuilds(prev =>
      prev.includes(id) ? prev.filter(buildId => buildId !== id) : [...prev, id]
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
        <h3 className="text-lg font-semibold text-gray-900">建物管理</h3>
        <div className="flex space-x-3">
          {selectedBuilds.length > 0 && (
            <button
              onClick={handleBatchDelete}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              批量刪除 ({selectedBuilds.length})
            </button>
          )}
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            新增建物
          </button>
        </div>
      </div>

      {/* Table */}
      <BuildTable
        builds={builds}
        selectedBuilds={selectedBuilds}
        handleSelectAll={handleSelectAll}
        handleSelectBuild={handleSelectBuild}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />

      {/* Form Modal */}
      <BuildForm
        isOpen={showForm}
        onClose={resetForm}
        onSubmit={handleSubmit}
        editingBuild={editingBuild}
        yfcases_id={yfcases_id}
      />
    </div>
  );
};

export default BuildManagement;
