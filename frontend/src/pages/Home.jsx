import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { yfcaseAPI } from '../utils/api';

const Home = () => {
  const { user, logout } = useAuth();
  const [yfcases, setYfcases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCase, setEditingCase] = useState(null);
  const [selectedCases, setSelectedCases] = useState([]);
  const [searchParams, setSearchParams] = useState({
    caseNumber: '',
    company: '',
    status: '',
    city: '',
    responsiblePerson: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });

  // 表單狀態
  const [formData, setFormData] = useState({
    caseNumber: '',
    company: '揚富開發有限公司',
    status: '在途',
    city: '',
    district: '',
    sectionNumber: '',
    subsection: '',
    village: '',
    neighborhood: '',
    street: '',
    section: '',
    lane: '',
    alley: '',
    number: '',
    floor: '',
    responsiblePerson: user?.username || ''
  });

  // 載入案件列表
  const loadYfcases = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
        ...searchParams
      };
      
      const response = await yfcaseAPI.getAll(params);
      setYfcases(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('載入案件失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  // 載入統計資料
  const loadStats = async () => {
    try {
      const response = await yfcaseAPI.getStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('載入統計失敗:', error);
    }
  };

  // 搜尋和篩選
  const handleSearch = () => {
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    loadYfcases();
  };

  // 重置搜尋
  const resetSearch = () => {
    setSearchParams({
      caseNumber: '',
      company: '',
      status: '',
      city: '',
      responsiblePerson: ''
    });
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  // 處理表單輸入
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 提交表單
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCase) {
        await yfcaseAPI.update(editingCase._id, formData);
      } else {
        await yfcaseAPI.create(formData);
      }
      setShowForm(false);
      setEditingCase(null);
      resetForm();
      loadYfcases();
      loadStats();
    } catch (error) {
      console.error('保存案件失敗:', error);
    }
  };

  // 編輯案件
  const handleEdit = (yfcase) => {
    setEditingCase(yfcase);
    setFormData({
      caseNumber: yfcase.caseNumber,
      company: yfcase.company,
      status: yfcase.status,
      city: yfcase.city,
      district: yfcase.district,
      sectionNumber: yfcase.sectionNumber || '',
      subsection: yfcase.subsection || '',
      village: yfcase.village || '',
      neighborhood: yfcase.neighborhood || '',
      street: yfcase.street || '',
      section: yfcase.section || '',
      lane: yfcase.lane || '',
      alley: yfcase.alley || '',
      number: yfcase.number,
      floor: yfcase.floor || '',
      responsiblePerson: yfcase.responsiblePerson
    });
    setShowForm(true);
  };

  // 刪除案件
  const handleDelete = async (id) => {
    if (window.confirm('確定要刪除這個案件嗎？')) {
      try {
        await yfcaseAPI.delete(id);
        loadYfcases();
        loadStats();
      } catch (error) {
        console.error('刪除案件失敗:', error);
      }
    }
  };

  // 批量刪除
  const handleBatchDelete = async () => {
    if (selectedCases.length === 0) {
      alert('請選擇要刪除的案件');
      return;
    }
    
    if (window.confirm(`確定要刪除選中的 ${selectedCases.length} 個案件嗎？`)) {
      try {
        await yfcaseAPI.batchDelete(selectedCases);
        setSelectedCases([]);
        loadYfcases();
        loadStats();
      } catch (error) {
        console.error('批量刪除失敗:', error);
      }
    }
  };

  // 重置表單
  const resetForm = () => {
    setFormData({
      caseNumber: '',
      company: '揚富開發有限公司',
      status: '在途',
      city: '',
      district: '',
      sectionNumber: '',
      subsection: '',
      village: '',
      neighborhood: '',
      street: '',
      section: '',
      lane: '',
      alley: '',
      number: '',
      floor: '',
      responsiblePerson: user?.username || ''
    });
  };

  // 選擇案件
  const handleSelectCase = (id) => {
    setSelectedCases(prev => 
      prev.includes(id) 
        ? prev.filter(caseId => caseId !== id)
        : [...prev, id]
    );
  };

  // 全選/取消全選
  const handleSelectAll = () => {
    if (selectedCases.length === yfcases.length) {
      setSelectedCases([]);
    } else {
      setSelectedCases(yfcases.map(yfcase => yfcase._id));
    }
  };

  useEffect(() => {
    if (user) {
      loadYfcases();
      loadStats();
    }
  }, [user, pagination.currentPage]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-8">
              歡迎來到用戶認證系統
            </h1>
            
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
              <p className="text-gray-600 mb-6">
                請登入或註冊以開始使用系統
              </p>
              
              <div className="space-y-3">
                <Link
                  to="/login"
                  className="block w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-200"
                >
                  登入
                </Link>
                <Link
                  to="/register"
                  className="block w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200"
                >
                  註冊
                </Link>
              </div>
            </div>
          </div>
          
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-indigo-600 text-3xl mb-4">🔐</div>
              <h3 className="text-xl font-semibold mb-2">安全認證</h3>
              <p className="text-gray-600">
                使用 JWT 令牌和密碼加密確保您的帳戶安全
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-indigo-600 text-3xl mb-4">👤</div>
              <h3 className="text-xl font-semibold mb-2">個人資料</h3>
              <p className="text-gray-600">
                管理您的個人資料、頭像和個人簡介
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-indigo-600 text-3xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2">快速響應</h3>
              <p className="text-gray-600">
                基於 React 和 Node.js 的現代化應用架構
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading && yfcases.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">載入中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 頁面標題 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">案件管理系統</h1>
          <p className="mt-2 text-gray-600">管理所有案件資料</p>
        </div>

        {/* 統計卡片 */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">總案件數</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.overview.totalCases}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">在途案件</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.overview.inProgressCases}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">結案案件</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.overview.completedCases}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">負責人</p>
                  <p className="text-2xl font-bold text-gray-900">{user.username}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 搜尋和篩選 */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <input
                type="text"
                placeholder="案號"
                value={searchParams.caseNumber}
                onChange={(e) => setSearchParams(prev => ({ ...prev, caseNumber: e.target.value }))}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              
              <select
                value={searchParams.company}
                onChange={(e) => setSearchParams(prev => ({ ...prev, company: e.target.value }))}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">所有公司</option>
                <option value="揚富開發有限公司">揚富開發有限公司</option>
                <option value="鉅汰開發有限公司">鉅汰開發有限公司</option>
              </select>
              
              <select
                value={searchParams.status}
                onChange={(e) => setSearchParams(prev => ({ ...prev, status: e.target.value }))}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">所有狀態</option>
                <option value="在途">在途</option>
                <option value="結案">結案</option>
              </select>
              
              <input
                type="text"
                placeholder="縣市"
                value={searchParams.city}
                onChange={(e) => setSearchParams(prev => ({ ...prev, city: e.target.value }))}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              
              <input
                type="text"
                placeholder="負責人"
                value={searchParams.responsiblePerson}
                onChange={(e) => setSearchParams(prev => ({ ...prev, responsiblePerson: e.target.value }))}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <div className="flex space-x-2">
                <button
                  onClick={handleSearch}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-200"
                >
                  搜尋
                </button>
                <button
                  onClick={resetSearch}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-200"
                >
                  重置
                </button>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setShowForm(true);
                    setEditingCase(null);
                    resetForm();
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200"
                >
                  新增案件
                </button>
                {selectedCases.length > 0 && (
                  <button
                    onClick={handleBatchDelete}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-200"
                  >
                    批量刪除 ({selectedCases.length})
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 案件列表 */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedCases.length === yfcases.length && yfcases.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">案號</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">公司</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">狀態</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">地址</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">負責人</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">建立時間</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {yfcases.map((yfcase) => (
                  <tr key={yfcase._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedCases.includes(yfcase._id)}
                        onChange={() => handleSelectCase(yfcase._id)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {yfcase.caseNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {yfcase.company}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        yfcase.status === '在途' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {yfcase.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div>
                        <div>{yfcase.city} {yfcase.district}</div>
                        <div className="text-xs text-gray-400">
                          {[yfcase.street, yfcase.section, yfcase.lane, yfcase.alley, yfcase.number, yfcase.floor]
                            .filter(Boolean)
                            .join('')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {yfcase.responsiblePerson}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(yfcase.createdAt).toLocaleDateString('zh-TW')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(yfcase)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        編輯
                      </button>
                      <button
                        onClick={() => handleDelete(yfcase._id)}
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
          
          {/* 分頁 */}
          {pagination.totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                  disabled={pagination.currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  上一頁
                </button>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  下一頁
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    顯示第 <span className="font-medium">{((pagination.currentPage - 1) * pagination.itemsPerPage) + 1}</span> 到{' '}
                    <span className="font-medium">
                      {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}
                    </span> 筆，
                    共 <span className="font-medium">{pagination.totalItems}</span> 筆結果
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setPagination(prev => ({ ...prev, currentPage: page }))}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          page === pagination.currentPage
                            ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 新增/編輯表單 Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingCase ? '編輯案件' : '新增案件'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setEditingCase(null);
                      resetForm();
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* 基本資訊 */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">案號 *</label>
                      <input
                        type="text"
                        name="caseNumber"
                        value={formData.caseNumber}
                        onChange={handleFormChange}
                        required
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">所屬公司 *</label>
                      <select
                        name="company"
                        value={formData.company}
                        onChange={handleFormChange}
                        required
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="揚富開發有限公司">揚富開發有限公司</option>
                        <option value="鉅汰開發有限公司">鉅汰開發有限公司</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">案件狀態 *</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleFormChange}
                        required
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="在途">在途</option>
                        <option value="結案">結案</option>
                      </select>
                    </div>
                  </div>

                  {/* 地址資訊 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">縣市 *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleFormChange}
                        required
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">鄉鎮區里 *</label>
                      <input
                        type="text"
                        name="district"
                        value={formData.district}
                        onChange={handleFormChange}
                        required
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">段號</label>
                      <input
                        type="text"
                        name="sectionNumber"
                        value={formData.sectionNumber}
                        onChange={handleFormChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">小段</label>
                      <input
                        type="text"
                        name="subsection"
                        value={formData.subsection}
                        onChange={handleFormChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">村里</label>
                      <input
                        type="text"
                        name="village"
                        value={formData.village}
                        onChange={handleFormChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">鄰</label>
                      <input
                        type="text"
                        name="neighborhood"
                        value={formData.neighborhood}
                        onChange={handleFormChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">街路</label>
                      <input
                        type="text"
                        name="street"
                        value={formData.street}
                        onChange={handleFormChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">段</label>
                      <input
                        type="text"
                        name="section"
                        value={formData.section}
                        onChange={handleFormChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">巷</label>
                      <input
                        type="text"
                        name="lane"
                        value={formData.lane}
                        onChange={handleFormChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">弄</label>
                      <input
                        type="text"
                        name="alley"
                        value={formData.alley}
                        onChange={handleFormChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">號 *</label>
                      <input
                        type="text"
                        name="number"
                        value={formData.number}
                        onChange={handleFormChange}
                        required
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">樓(含之幾)</label>
                      <input
                        type="text"
                        name="floor"
                        value={formData.floor}
                        onChange={handleFormChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">區域負責人 *</label>
                      <input
                        type="text"
                        name="responsiblePerson"
                        value={formData.responsiblePerson}
                        onChange={handleFormChange}
                        required
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setEditingCase(null);
                        resetForm();
                      }}
                      className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-200"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-200"
                    >
                      {editingCase ? '更新' : '創建'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home; 