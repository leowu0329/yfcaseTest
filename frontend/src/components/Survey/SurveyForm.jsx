import React, { useState, useEffect } from 'react';

const SurveyForm = ({ isOpen, onClose, onSubmit, editingSurvey, yfcases_id }) => {
  const [formData, setFormData] = useState({
    surveyFirstDay: '',
    surveySecondDay: '',
    surveyForeclosureAnnouncementLink: '',
    survey988Link: '',
    surveyObjectPhotoLink: '',
    surveyForeclosureRecordLink: '',
    surveyObjectViewLink: '',
    surveyPagesViewLink: '',
    surveyMoneytViewLink: ''
  });

  useEffect(() => {
    if (editingSurvey) {
      setFormData({
        surveyFirstDay: editingSurvey.surveyFirstDay ? new Date(editingSurvey.surveyFirstDay).toISOString().split('T')[0] : '',
        surveySecondDay: editingSurvey.surveySecondDay ? new Date(editingSurvey.surveySecondDay).toISOString().split('T')[0] : '',
        surveyForeclosureAnnouncementLink: editingSurvey.surveyForeclosureAnnouncementLink || '',
        survey988Link: editingSurvey.survey988Link || '',
        surveyObjectPhotoLink: editingSurvey.surveyObjectPhotoLink || '',
        surveyForeclosureRecordLink: editingSurvey.surveyForeclosureRecordLink || '',
        surveyObjectViewLink: editingSurvey.surveyObjectViewLink || '',
        surveyPagesViewLink: editingSurvey.surveyPagesViewLink || '',
        surveyMoneytViewLink: editingSurvey.surveyMoneytViewLink || ''
      });
    } else {
      setFormData({
        surveyFirstDay: '',
        surveySecondDay: '',
        surveyForeclosureAnnouncementLink: '',
        survey988Link: '',
        surveyObjectPhotoLink: '',
        surveyForeclosureRecordLink: '',
        surveyObjectViewLink: '',
        surveyPagesViewLink: '',
        surveyMoneytViewLink: ''
      });
    }
  }, [editingSurvey]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      yfcases_id: yfcases_id,
      // 在編輯模式下，允許空值；在新增模式下，如果沒有值則使用當前時間
      surveyFirstDay: editingSurvey 
        ? (formData.surveyFirstDay === '' ? null : formData.surveyFirstDay)
        : (formData.surveyFirstDay || new Date().toISOString()),
      surveySecondDay: editingSurvey 
        ? (formData.surveySecondDay === '' ? null : formData.surveySecondDay)
        : (formData.surveySecondDay || new Date().toISOString())
    };

    console.log('Submitting survey data:', submitData);
    // 不直接調用onClose，讓父組件處理成功後的關閉邏輯
    onSubmit(submitData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {editingSurvey ? '編輯勘查記錄' : '新增勘查記錄'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  初勘日
                </label>
                <input
                  type="date"
                  name="surveyFirstDay"
                  value={formData.surveyFirstDay}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  會勘日
                </label>
                <input
                  type="date"
                  name="surveySecondDay"
                  value={formData.surveySecondDay}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  法拍公告(證物三)
                </label>
                <input
                  type="url"
                  name="surveyForeclosureAnnouncementLink"
                  value={formData.surveyForeclosureAnnouncementLink}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="請輸入法拍公告連結"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  998連結
                </label>
                <input
                  type="url"
                  name="survey988Link"
                  value={formData.survey988Link}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="請輸入998連結"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  物件照片(證物四)
                </label>
                <input
                  type="url"
                  name="surveyObjectPhotoLink"
                  value={formData.surveyObjectPhotoLink}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="請輸入物件照片連結"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  法拍記錄(證物七)
                </label>
                <input
                  type="url"
                  name="surveyForeclosureRecordLink"
                  value={formData.surveyForeclosureRecordLink}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="請輸入法拍記錄連結"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  標的物(現場勘查)
                </label>
                <input
                  type="url"
                  name="surveyObjectViewLink"
                  value={formData.surveyObjectViewLink}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="請輸入標的物連結"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  收發文簿
                </label>
                <input
                  type="url"
                  name="surveyPagesViewLink"
                  value={formData.surveyPagesViewLink}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="請輸入收發文簿連結"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  流水帳
                </label>
                <input
                  type="url"
                  name="surveyMoneytViewLink"
                  value={formData.surveyMoneytViewLink}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="請輸入流水帳連結"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {editingSurvey ? '更新' : '新增'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SurveyForm;
