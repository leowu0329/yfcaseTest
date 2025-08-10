import React, { useState, useEffect } from 'react';

const BuildForm = ({ isOpen, onClose, onSubmit, editingBuild, yfcases_id }) => {
  const [formData, setFormData] = useState({
    buildNumber: '',
    buildUrl: '',
    buildArea: '',
    buildHoldingPointPersonal: '',
    buildHoldingPointAll: '',
    buildTypeUse: '透天厝',
    buildUsePartition: '第一種住宅區',
    buildRemark: ''
  });

  useEffect(() => {
    if (editingBuild) {
      setFormData({
        buildNumber: editingBuild.buildNumber || '',
        buildUrl: editingBuild.buildUrl || '',
        buildArea: editingBuild.buildArea || '',
        buildHoldingPointPersonal: editingBuild.buildHoldingPointPersonal || '',
        buildHoldingPointAll: editingBuild.buildHoldingPointAll || '',
        buildTypeUse: editingBuild.buildTypeUse || '透天厝',
        buildUsePartition: editingBuild.buildUsePartition || '第一種住宅區',
        buildRemark: editingBuild.buildRemark || ''
      });
    } else {
      setFormData({
        buildNumber: '',
        buildUrl: '',
        buildArea: '',
        buildHoldingPointPersonal: '',
        buildHoldingPointAll: '',
        buildTypeUse: '透天厝',
        buildUsePartition: '第一種住宅區',
        buildRemark: ''
      });
    }
  }, [editingBuild]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.buildNumber.trim() || !formData.buildArea || !formData.buildHoldingPointPersonal || !formData.buildHoldingPointAll) {
      alert('請填寫所有必填欄位');
      return;
    }

    if (parseFloat(formData.buildArea) <= 0) {
      alert('建坪必須大於0');
      return;
    }

    if (parseInt(formData.buildHoldingPointPersonal) <= 0 || parseInt(formData.buildHoldingPointAll) <= 0) {
      alert('持分必須為正整數');
      return;
    }

    if (parseInt(formData.buildHoldingPointPersonal) > parseInt(formData.buildHoldingPointAll)) {
      alert('個人持分不能大於所有持分');
      return;
    }

    const submitData = {
      ...formData,
      yfcases_id: yfcases_id,
      buildArea: parseFloat(formData.buildArea),
      buildHoldingPointPersonal: parseInt(formData.buildHoldingPointPersonal),
      buildHoldingPointAll: parseInt(formData.buildHoldingPointAll)
    };

    onSubmit(submitData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {editingBuild ? '編輯建物' : '新增建物'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  建號 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="buildNumber"
                  value={formData.buildNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="請輸入建號"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  連結
                </label>
                <input
                  type="url"
                  name="buildUrl"
                  value={formData.buildUrl}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="請輸入連結 (選填)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  建坪 <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="buildArea"
                  value={formData.buildArea}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="請輸入建坪"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  個人持分 <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="buildHoldingPointPersonal"
                  value={formData.buildHoldingPointPersonal}
                  onChange={handleChange}
                  min="1"
                  step="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="請輸入個人持分"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  所有持分 <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="buildHoldingPointAll"
                  value={formData.buildHoldingPointAll}
                  onChange={handleChange}
                  min="1"
                  step="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="請輸入所有持分"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  建物型 <span className="text-red-500">*</span>
                </label>
                <select
                  name="buildTypeUse"
                  value={formData.buildTypeUse}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="公設">公設</option>
                  <option value="公寓-5樓含以下無電梯">公寓-5樓含以下無電梯</option>
                  <option value="透天厝">透天厝</option>
                  <option value="店面-店舖">店面-店舖</option>
                  <option value="辦公商業大樓">辦公商業大樓</option>
                  <option value="住宅大樓-11層含以上有電梯">住宅大樓-11層含以上有電梯</option>
                  <option value="華廈-10層含以下有電梯">華廈-10層含以下有電梯</option>
                  <option value="套房">套房</option>
                  <option value="農舍">農舍</option>
                  <option value="增建-持分後坪數打對折">增建-持分後坪數打對折</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  使用分區 <span className="text-red-500">*</span>
                </label>
                <select
                  name="buildUsePartition"
                  value={formData.buildUsePartition}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="第一種住宅區">第一種住宅區</option>
                  <option value="第二種住宅區">第二種住宅區</option>
                  <option value="第三種住宅區">第三種住宅區</option>
                  <option value="第四種住宅區">第四種住宅區</option>
                  <option value="第五種住宅區">第五種住宅區</option>
                  <option value="第一種商業區">第一種商業區</option>
                  <option value="第二種商業區">第二種商業區</option>
                  <option value="第三種商業區">第三種商業區</option>
                  <option value="第四種商業區">第四種商業區</option>
                  <option value="第二種工業區">第二種工業區</option>
                  <option value="第三種工業區">第三種工業區</option>
                  <option value="行政區">行政區</option>
                  <option value="文教區">文教區</option>
                  <option value="倉庫區">倉庫區</option>
                  <option value="風景區">風景區</option>
                  <option value="農業區">農業區</option>
                  <option value="保護區">保護區</option>
                  <option value="行水區">行水區</option>
                  <option value="保存區">保存區</option>
                  <option value="特定專用區">特定專用區</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                備註
              </label>
              <textarea
                name="buildRemark"
                value={formData.buildRemark}
                onChange={handleChange}
                rows="3"
                maxLength="500"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="請輸入備註 (選填，最多500字)"
              />
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
                {editingBuild ? '更新' : '新增'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BuildForm;
