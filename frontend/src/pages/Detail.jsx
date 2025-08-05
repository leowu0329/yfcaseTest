import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { yfcaseAPI } from '../utils/api';

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [yfcase, setYfcase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const loadYfcase = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await yfcaseAPI.getOne(id);
        setYfcase(response.data.data);
      } catch (error) {
        console.error('載入案件詳情失敗:', error);
        setError('載入案件詳情失敗');
      } finally {
        setLoading(false);
      }
    };

    loadYfcase();
  }, [id, user, navigate]);

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">載入中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">{error}</div>
          <button
            onClick={() => navigate('/')}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            返回首頁
          </button>
        </div>
      </div>
    );
  }

  if (!yfcase) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-600 text-xl mb-4">案件不存在</div>
          <button
            onClick={() => navigate('/')}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            返回首頁
          </button>
        </div>
      </div>
    );
  }

  // Tab 配置
  const tabs = [
    { id: 'basic', name: '基本資料', icon: '📋' }
  ];

  // 渲染基本資料 Tab
  const renderBasicInfo = () => (
    <div className="space-y-8">
      {/* 基本資訊區塊 */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="mr-2">📋</span>
          基本資訊
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-500 mb-2">案號</label>
            <p className="text-lg font-semibold text-gray-900">{yfcase.caseNumber}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-500 mb-2">所屬公司</label>
            <p className="text-lg font-semibold text-gray-900">{yfcase.company}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-500 mb-2">案件狀態</label>
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
              yfcase.status === '在途' 
                ? 'bg-yellow-100 text-yellow-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {yfcase.status}
            </span>
          </div>
        </div>
      </div>

      {/* 地址資訊區塊 */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="mr-2">📍</span>
          地址資訊
        </h3>
        <div className="bg-gray-50 p-6 rounded-lg">
          <label className="block text-sm font-medium text-gray-500 mb-3">完整地址</label>
          <p className="text-lg font-semibold text-gray-900 leading-relaxed">
            {[
              yfcase.city,
              yfcase.district,
              yfcase.sectionNumber,
              yfcase.subsection,
              yfcase.village,
              yfcase.neighborhood,
              yfcase.street,
              yfcase.section,
              yfcase.lane,
              yfcase.alley,
              yfcase.number,
              yfcase.floor
            ]
              .filter(Boolean)
              .join('')}
          </p>
        </div>
      </div>

      {/* 負責人資訊區塊 */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="mr-2">👤</span>
          負責人資訊
        </h3>
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">區域負責人</label>
              <p className="text-xl font-semibold text-gray-900">{yfcase.responsiblePerson}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 時間資訊區塊 */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="mr-2">⏰</span>
          時間資訊
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">建立時間</label>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(yfcase.createdAt).toLocaleString('zh-TW')}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">更新時間</label>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(yfcase.updatedAt).toLocaleString('zh-TW')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );



  // 渲染對應的 Tab 內容
  const renderTabContent = () => {
    return renderBasicInfo();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 頁面標題 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">案件詳情</h1>
              <p className="mt-2 text-gray-600">查看案件完整資訊</p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-200"
            >
              返回首頁
            </button>
          </div>
        </div>

        {/* Tab 導航 */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab 內容 */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
