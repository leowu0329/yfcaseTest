import React, { useState, useEffect } from 'react';

const ResultForm = ({ isOpen, onClose, onSubmit, editingResult, yfcases_id }) => {
  const [formData, setFormData] = useState({
    stopBuyDate: '',
    actionResult: '',
    bidAuctionTime: '',
    bidMoney: '',
    objectNumber: ''
  });

  useEffect(() => {
    if (editingResult) {
      setFormData({
        stopBuyDate: editingResult.stopBuyDate ? new Date(editingResult.stopBuyDate).toISOString().split('T')[0] : '',
        actionResult: editingResult.actionResult || '',
        bidAuctionTime: editingResult.bidAuctionTime || '',
        bidMoney: editingResult.bidMoney || '',
        objectNumber: editingResult.objectNumber || ''
      });
    } else {
      setFormData({
        stopBuyDate: new Date().toISOString().split('T')[0],
        actionResult: '',
        bidAuctionTime: '',
        bidMoney: '',
        objectNumber: ''
      });
    }
  }, [editingResult]);

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
      stopBuyDate: formData.stopBuyDate ? new Date(formData.stopBuyDate) : new Date(),
      bidMoney: formData.bidMoney ? parseInt(formData.bidMoney) : undefined
    };

    onSubmit(submitData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {editingResult ? '編輯執行結果記錄' : '新增執行結果記錄'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  應買止日
                </label>
                <input
                  type="date"
                  name="stopBuyDate"
                  value={formData.stopBuyDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  執行結果
                </label>
                <select
                  name="actionResult"
                  value={formData.actionResult}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">請選擇執行結果</option>
                  <option value="撤回">撤回</option>
                  <option value="第三人搶標">第三人搶標</option>
                  <option value="等待優購">等待優購</option>
                  <option value="遭優購">遭優購</option>
                  <option value="無人優購">無人優購</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  搶標拍別
                </label>
                <select
                  name="bidAuctionTime"
                  value={formData.bidAuctionTime}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">請選擇搶標拍別</option>
                  <option value="1拍">1拍</option>
                  <option value="2拍">2拍</option>
                  <option value="3拍">3拍</option>
                  <option value="4拍">4拍</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  搶標金額
                </label>
                <input
                  type="number"
                  name="bidMoney"
                  value={formData.bidMoney}
                  onChange={handleChange}
                  min="0"
                  step="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="請輸入搶標金額"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  標的編號
                </label>
                <input
                  type="text"
                  name="objectNumber"
                  value={formData.objectNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="請輸入標的編號"
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
                {editingResult ? '更新' : '新增'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResultForm;
