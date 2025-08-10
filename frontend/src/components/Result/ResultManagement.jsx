import React, { useState, useEffect } from 'react';
import ResultForm from './ResultForm';
import resultAPI from '../../services/resultAPI';

const ResultManagement = ({ yfcases_id }) => {
  const [results, setResults] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingResult, setEditingResult] = useState(null);
  const [selectedResults, setSelectedResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchResults();
  }, [yfcases_id]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const data = await resultAPI.getByYfcase(yfcases_id);
      setResults(data);
    } catch (error) {
      console.error('獲取執行結果記錄失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateResult = async (resultData) => {
    try {
      await resultAPI.create({ ...resultData, yfcases_id });
      fetchResults();
      setIsFormOpen(false);
    } catch (error) {
      console.error('創建執行結果記錄失敗:', error);
    }
  };

  const handleUpdateResult = async (id, resultData) => {
    try {
      await resultAPI.update(id, resultData);
      fetchResults();
      setIsFormOpen(false);
      setEditingResult(null);
    } catch (error) {
      console.error('更新執行結果記錄失敗:', error);
    }
  };

  const handleDeleteResult = async (id) => {
    if (window.confirm('確定要刪除這筆執行結果記錄嗎？')) {
      try {
        await resultAPI.delete(id);
        fetchResults();
      } catch (error) {
        console.error('刪除執行結果記錄失敗:', error);
      }
    }
  };

  const handleBatchDelete = async () => {
    if (selectedResults.length === 0) {
      alert('請選擇要刪除的記錄');
      return;
    }

    if (window.confirm(`確定要刪除選中的 ${selectedResults.length} 筆執行結果記錄嗎？`)) {
      try {
        await resultAPI.batchDelete(selectedResults);
        setSelectedResults([]);
        fetchResults();
      } catch (error) {
        console.error('批量刪除執行結果記錄失敗:', error);
      }
    }
  };

  const handleEdit = (result) => {
    setEditingResult(result);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingResult(null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingResult(null);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedResults(results.map(result => result._id));
    } else {
      setSelectedResults([]);
    }
  };

  const handleSelectResult = (id) => {
    if (selectedResults.includes(id)) {
      setSelectedResults(selectedResults.filter(resultId => resultId !== id));
    } else {
      setSelectedResults([...selectedResults, id]);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('zh-TW');
  };

  const formatMoney = (amount) => {
    if (!amount) return '-';
    return amount.toLocaleString('zh-TW');
  };

  if (loading) {
    return <div className="text-center py-4">載入中...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">執行結果管理</h2>
        <div className="space-x-2">
          {selectedResults.length > 0 && (
            <button
              onClick={handleBatchDelete}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              批量刪除 ({selectedResults.length})
            </button>
          )}
          <button
            onClick={handleCreate}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            新增執行結果
          </button>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  checked={selectedResults.length === results.length && results.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                應買止日
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                執行結果
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                搶標拍別
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                搶標金額
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                標的編號
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                建立時間
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {results.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                  暫無執行結果記錄
                </td>
              </tr>
            ) : (
              results.map((result) => (
                <tr key={result._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedResults.includes(result._id)}
                      onChange={() => handleSelectResult(result._id)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(result.stopBuyDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {result.actionResult || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {result.bidAuctionTime || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatMoney(result.bidMoney)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {result.objectNumber || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(result.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEdit(result)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      編輯
                    </button>
                    <button
                      onClick={() => handleDeleteResult(result._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      刪除
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isFormOpen && (
        <ResultForm
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          onSubmit={editingResult ? 
            (data) => handleUpdateResult(editingResult._id, data) : 
            handleCreateResult
          }
          editingResult={editingResult}
          yfcases_id={yfcases_id}
        />
      )}
    </div>
  );
};

export default ResultManagement;
