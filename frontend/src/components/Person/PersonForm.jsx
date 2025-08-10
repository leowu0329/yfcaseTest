import React, { useState, useEffect } from 'react';

const PersonForm = ({ isOpen, onClose, onSubmit, editingPerson, yfcases_id }) => {
  const [formData, setFormData] = useState({
    personType: '債務人',
    personName: '',
    personMobile: ''
  });

  useEffect(() => {
    if (editingPerson) {
      setFormData({
        personType: editingPerson.personType || '債務人',
        personName: editingPerson.personName || '',
        personMobile: editingPerson.personMobile || ''
      });
    } else {
      setFormData({
        personType: '債務人',
        personName: '',
        personMobile: ''
      });
    }
  }, [editingPerson]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.personName.trim() || !formData.personMobile.trim()) {
      alert('請填寫所有必填欄位');
      return;
    }

    const submitData = {
      ...formData,
      yfcases_id: yfcases_id
    };

    onSubmit(submitData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {editingPerson ? '編輯人員' : '新增人員'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                身份 <span className="text-red-500">*</span>
              </label>
              <select
                name="personType"
                value={formData.personType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="債務人">債務人</option>
                <option value="債權人">債權人</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                姓名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="personName"
                value={formData.personName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="請輸入姓名"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                電話 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="personMobile"
                value={formData.personMobile}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="請輸入電話"
                required
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
                {editingPerson ? '更新' : '新增'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PersonForm; 