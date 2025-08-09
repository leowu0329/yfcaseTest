import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { yfcaseAPI } from '../utils/api';
import StatisticalData from '../components/Home/StatisticalData';
import SearchAndFilter from '../components/Home/SearchAndFilter';
import Table from '../components/Home/Table';
import Pagination from '../components/Home/Pagination';

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
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
    } else {
      // 未登入時自動跳轉到登入頁面
      navigate('/login');
    }
  }, [user, pagination.currentPage, pagination.itemsPerPage, navigate]);

  if (!user) {
    return null; // 未登入時不顯示任何內容，會自動跳轉到登入頁面
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

        {/* 統計資料 */}
        <StatisticalData stats={stats} user={user} />

        {/* 搜尋和篩選 */}
        <SearchAndFilter
          searchParams={searchParams}
          setSearchParams={setSearchParams}
          handleSearch={handleSearch}
          resetSearch={resetSearch}
          onAddCase={() => {
                    setShowForm(true);
                    setEditingCase(null);
                    resetForm();
                  }}
          selectedCases={selectedCases}
          onBatchDelete={handleBatchDelete}
        />

        {/* 案件列表 */}
        <Table
          yfcases={yfcases}
          selectedCases={selectedCases}
          handleSelectAll={handleSelectAll}
          handleSelectCase={handleSelectCase}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
          
          {/* 分頁 */}
        <Pagination
          pagination={pagination}
          setPagination={setPagination}
          onPageChange={() => loadYfcases()}
        />

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