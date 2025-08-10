import React, { useState, useEffect } from 'react';
import { surveyAPI } from '../../utils/api';
import SurveyForm from './SurveyForm';

const SurveyManagement = ({ yfcases_id }) => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSurvey, setEditingSurvey] = useState(null);
  const [selectedSurveys, setSelectedSurveys] = useState([]);

  useEffect(() => {
    if (yfcases_id) {
      fetchSurveys();
    }
  }, [yfcases_id]);

  const fetchSurveys = async () => {
    try {
      setLoading(true);
      const response = await surveyAPI.getByYfcase(yfcases_id);
      setSurveys(response.data);
    } catch (error) {
      console.error('Error fetching surveys:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSurvey = async (surveyData) => {
    try {
      await surveyAPI.create(surveyData);
      fetchSurveys();
    } catch (error) {
      console.error('Error creating survey:', error);
    }
  };

  const handleUpdateSurvey = async (surveyData) => {
    try {
      await surveyAPI.update(editingSurvey._id, surveyData);
      setEditingSurvey(null);
      fetchSurveys();
    } catch (error) {
      console.error('Error updating survey:', error);
    }
  };

  const handleDeleteSurvey = async (id) => {
    if (window.confirm('確定要刪除這筆勘查記錄嗎？')) {
      try {
        await surveyAPI.delete(id);
        fetchSurveys();
      } catch (error) {
        console.error('Error deleting survey:', error);
      }
    }
  };

  const handleBatchDelete = async () => {
    if (selectedSurveys.length === 0) {
      alert('請選擇要刪除的勘查記錄');
      return;
    }

    if (window.confirm(`確定要刪除選中的 ${selectedSurveys.length} 筆勘查記錄嗎？`)) {
      try {
        await surveyAPI.batchDelete(selectedSurveys);
        setSelectedSurveys([]);
        fetchSurveys();
      } catch (error) {
        console.error('Error batch deleting surveys:', error);
      }
    }
  };

  const handleEdit = (survey) => {
    setEditingSurvey(survey);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingSurvey(null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingSurvey(null);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedSurveys(surveys.map(survey => survey._id));
    } else {
      setSelectedSurveys([]);
    }
  };

  const handleSelectSurvey = (id) => {
    setSelectedSurveys(prev => 
      prev.includes(id) 
        ? prev.filter(surveyId => surveyId !== id)
        : [...prev, id]
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('zh-TW');
  };

  const formatLink = (link) => {
    if (!link) return '-';
    return (
      <a 
        href={link} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 underline"
      >
        查看連結
      </a>
    );
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
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">勘查記錄管理</h3>
        <div className="flex space-x-2">
          {selectedSurveys.length > 0 && (
            <button
              onClick={handleBatchDelete}
              className="px-3 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              批量刪除 ({selectedSurveys.length})
            </button>
          )}
          <button
            onClick={handleCreate}
            className="px-3 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            新增勘查記錄
          </button>
        </div>
      </div>

      {surveys.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          尚無勘查記錄，請點擊「新增勘查記錄」開始建立
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedSurveys.length === surveys.length && surveys.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  初勘日
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  會勘日
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  法拍公告
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  998連結
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  物件照片
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  法拍記錄
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  標的物
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  收發文簿
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  流水帳
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
              {surveys.map((survey) => (
                <tr key={survey._id} className="hover:bg-gray-50">
                  <td className="px-3 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedSurveys.includes(survey._id)}
                      onChange={() => handleSelectSurvey(survey._id)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(survey.surveyFirstDay)}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(survey.surveySecondDay)}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatLink(survey.surveyForeclosureAnnouncementLink)}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatLink(survey.survey988Link)}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatLink(survey.surveyObjectPhotoLink)}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatLink(survey.surveyForeclosureRecordLink)}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatLink(survey.surveyObjectViewLink)}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatLink(survey.surveyPagesViewLink)}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatLink(survey.surveyMoneytViewLink)}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(survey.createdAt)}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(survey)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      編輯
                    </button>
                    <button
                      onClick={() => handleDeleteSurvey(survey._id)}
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
      )}

      <SurveyForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={editingSurvey ? handleUpdateSurvey : handleCreateSurvey}
        editingSurvey={editingSurvey}
        yfcases_id={yfcases_id}
      />
    </div>
  );
};

export default SurveyManagement;
