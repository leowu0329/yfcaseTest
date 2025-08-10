import React, { useState, useEffect } from 'react';

const FinalDecisionForm = ({ isOpen, onClose, onSubmit, editingFinalDecision, yfcases_id }) => {
  const [formData, setFormData] = useState({
    finalDecision: '',
    finalDecisionRemark: '',
    finalDecisionType: '',
    regionalHead: '',
    regionalHeadDate: '',
    regionalHeadWorkArea: ''
  });

  useEffect(() => {
    if (editingFinalDecision) {
      setFormData({
        finalDecision: editingFinalDecision.finalDecision || '',
        finalDecisionRemark: editingFinalDecision.finalDecisionRemark || '',
        finalDecisionType: editingFinalDecision.finalDecisionType || '',
        regionalHead: editingFinalDecision.regionalHead || '',
        regionalHeadDate: editingFinalDecision.regionalHeadDate ? new Date(editingFinalDecision.regionalHeadDate).toISOString().split('T')[0] : '',
        regionalHeadWorkArea: editingFinalDecision.regionalHeadWorkArea || ''
      });
    } else {
      setFormData({
        finalDecision: '',
        finalDecisionRemark: '',
        finalDecisionType: '',
        regionalHead: '',
        regionalHeadDate: new Date().toISOString().split('T')[0],
        regionalHeadWorkArea: ''
      });
    }
  }, [editingFinalDecision]);

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
      regionalHeadDate: formData.regionalHeadDate || new Date().toISOString()
    };

    console.log('Submitting final decision data:', submitData);
    onSubmit(submitData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {editingFinalDecision ? '編輯最終判定記錄' : '新增最終判定記錄'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  最終判定 <span className="text-red-500">*</span>
                </label>
                <select
                  name="finalDecision"
                  value={formData.finalDecision}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">請選擇最終判定</option>
                  <option value="1拍進場">1拍進場</option>
                  <option value="2拍進場">2拍進場</option>
                  <option value="3拍進場">3拍進場</option>
                  <option value="4拍進場">4拍進場</option>
                  <option value="放棄">放棄</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  分類 <span className="text-red-500">*</span>
                </label>
                <select
                  name="finalDecisionType"
                  value={formData.finalDecisionType}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">請選擇分類</option>
                  <option value="區域負責人">區域負責人</option>
                  <option value="副署人員A">副署人員A</option>
                  <option value="副署人員B">副署人員B</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  人員 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="regionalHead"
                  value={formData.regionalHead}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="請輸入人員姓名"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  簽核日期 <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="regionalHeadDate"
                  value={formData.regionalHeadDate}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  工作轄區 <span className="text-red-500">*</span>
                </label>
                <select
                  name="regionalHeadWorkArea"
                  value={formData.regionalHeadWorkArea}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">請選擇工作轄區</option>
                  <option value="雙北桃竹苗">雙北桃竹苗</option>
                  <option value="中彰投">中彰投</option>
                  <option value="雲嘉南">雲嘉南</option>
                  <option value="高高屏">高高屏</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  備註
                </label>
                <input
                  type="text"
                  name="finalDecisionRemark"
                  value={formData.finalDecisionRemark}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="請輸入備註"
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
                {editingFinalDecision ? '更新' : '新增'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FinalDecisionForm;
