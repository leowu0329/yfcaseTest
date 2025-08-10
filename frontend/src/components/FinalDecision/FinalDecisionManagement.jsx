import React, { useState, useEffect } from 'react';
import finalDecisionAPI from '../../services/finalDecisionAPI';
import FinalDecisionForm from './FinalDecisionForm';

const FinalDecisionManagement = ({ yfcases_id }) => {
  const [finalDecisions, setFinalDecisions] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFinalDecision, setEditingFinalDecision] = useState(null);
  const [selectedFinalDecisions, setSelectedFinalDecisions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (yfcases_id) {
      fetchFinalDecisions();
    }
  }, [yfcases_id]);

  const fetchFinalDecisions = async () => {
    try {
      setLoading(true);
      const data = await finalDecisionAPI.getByYfcase(yfcases_id);
      setFinalDecisions(data);
    } catch (error) {
      console.error('Error fetching final decisions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFinalDecision = async (data) => {
    try {
      await finalDecisionAPI.create(data);
      fetchFinalDecisions();
      setIsFormOpen(false);
      alert('最終判定記錄新增成功！');
    } catch (error) {
      console.error('Error creating final decision:', error);
      alert(`新增失敗：${error.response?.data?.message || error.message || '未知錯誤'}`);
    }
  };

  const handleUpdateFinalDecision = async (data) => {
    try {
      await finalDecisionAPI.update(editingFinalDecision._id, data);
      fetchFinalDecisions();
      setIsFormOpen(false);
      setEditingFinalDecision(null);
      alert('最終判定記錄更新成功！');
    } catch (error) {
      console.error('Error updating final decision:', error);
      alert(`更新失敗：${error.response?.data?.message || error.message || '未知錯誤'}`);
    }
  };

  const handleDeleteFinalDecision = async (id) => {
    if (window.confirm('確定要刪除這筆最終判定記錄嗎？')) {
      try {
        await finalDecisionAPI.delete(id);
        fetchFinalDecisions();
        alert('最終判定記錄刪除成功！');
      } catch (error) {
        console.error('Error deleting final decision:', error);
        alert(`刪除失敗：${error.response?.data?.message || error.message || '未知錯誤'}`);
      }
    }
  };

  const handleBatchDelete = async () => {
    if (selectedFinalDecisions.length === 0) {
      alert('請選擇要刪除的最終判定記錄');
      return;
    }

    if (window.confirm(`確定要刪除選中的 ${selectedFinalDecisions.length} 筆最終判定記錄嗎？`)) {
      try {
        await finalDecisionAPI.batchDelete(selectedFinalDecisions);
        setSelectedFinalDecisions([]);
        fetchFinalDecisions();
        alert('批量刪除成功！');
      } catch (error) {
        console.error('Error batch deleting final decisions:', error);
        alert(`批量刪除失敗：${error.response?.data?.message || error.message || '未知錯誤'}`);
      }
    }
  };

  const handleEdit = (finalDecision) => {
    setEditingFinalDecision(finalDecision);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingFinalDecision(null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingFinalDecision(null);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedFinalDecisions(finalDecisions.map(finalDecision => finalDecision._id));
    } else {
      setSelectedFinalDecisions([]);
    }
  };

  const handleSelectFinalDecision = (id) => {
    setSelectedFinalDecisions(prev => 
      prev.includes(id) 
        ? prev.filter(finalDecisionId => finalDecisionId !== id)
        : [...prev, id]
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('zh-TW');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 操作按鈕 */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <button
            onClick={handleCreate}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            新增最終判定記錄
          </button>
          {selectedFinalDecisions.length > 0 && (
            <button
              onClick={handleBatchDelete}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              批量刪除 ({selectedFinalDecisions.length})
            </button>
          )}
        </div>
      </div>

      {/* 最終判定記錄列表 */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={finalDecisions.length > 0 && selectedFinalDecisions.length === finalDecisions.length}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  最終判定
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  備註
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  分類
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  人員
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  簽核日期
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  工作轄區
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  建立時間
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {finalDecisions.map((finalDecision) => (
                <tr key={finalDecision._id} className="hover:bg-gray-50">
                  <td className="px-3 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedFinalDecisions.includes(finalDecision._id)}
                      onChange={() => handleSelectFinalDecision(finalDecision._id)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                    {finalDecision.finalDecision}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                    {finalDecision.finalDecisionRemark || '-'}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                    {finalDecision.finalDecisionType}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                    {finalDecision.regionalHead}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(finalDecision.regionalHeadDate)}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                    {finalDecision.regionalHeadWorkArea}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(finalDecision.createdAt)}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(finalDecision)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      編輯
                    </button>
                    <button
                      onClick={() => handleDeleteFinalDecision(finalDecision._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      刪除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {finalDecisions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            暫無最終判定記錄
          </div>
        )}
      </div>

      {/* 表單彈窗 */}
      <FinalDecisionForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={editingFinalDecision ? handleUpdateFinalDecision : handleCreateFinalDecision}
        editingFinalDecision={editingFinalDecision}
        yfcases_id={yfcases_id}
      />
    </div>
  );
};

export default FinalDecisionManagement;
