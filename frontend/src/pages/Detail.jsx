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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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

        {/* 案件資訊卡片 */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* 基本資訊 */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">基本資訊</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">案號</label>
                <p className="mt-1 text-sm text-gray-900 font-medium">{yfcase.caseNumber}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">所屬公司</label>
                <p className="mt-1 text-sm text-gray-900">{yfcase.company}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">案件狀態</label>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${
                  yfcase.status === '在途' 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {yfcase.status}
                </span>
              </div>
            </div>
          </div>

          {/* 地址資訊 */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">地址資訊</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">縣市</label>
                <p className="mt-1 text-sm text-gray-900">{yfcase.city}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">鄉鎮區里</label>
                <p className="mt-1 text-sm text-gray-900">{yfcase.district}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">段號</label>
                <p className="mt-1 text-sm text-gray-900">{yfcase.sectionNumber || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">小段</label>
                <p className="mt-1 text-sm text-gray-900">{yfcase.subsection || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">村里</label>
                <p className="mt-1 text-sm text-gray-900">{yfcase.village || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">鄰</label>
                <p className="mt-1 text-sm text-gray-900">{yfcase.neighborhood || '-'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">街路</label>
                <p className="mt-1 text-sm text-gray-900">{yfcase.street || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">段</label>
                <p className="mt-1 text-sm text-gray-900">{yfcase.section || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">巷</label>
                <p className="mt-1 text-sm text-gray-900">{yfcase.lane || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">弄</label>
                <p className="mt-1 text-sm text-gray-900">{yfcase.alley || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">號</label>
                <p className="mt-1 text-sm text-gray-900">{yfcase.number}</p>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-500">樓(含之幾)</label>
              <p className="mt-1 text-sm text-gray-900">{yfcase.floor || '-'}</p>
            </div>
          </div>

          {/* 負責人資訊 */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">負責人資訊</h2>
            <div>
              <label className="block text-sm font-medium text-gray-500">區域負責人</label>
              <p className="mt-1 text-sm text-gray-900">{yfcase.responsiblePerson}</p>
            </div>
          </div>

          {/* 時間資訊 */}
          <div className="px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">時間資訊</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">建立時間</label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(yfcase.createdAt).toLocaleString('zh-TW')}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">更新時間</label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(yfcase.updatedAt).toLocaleString('zh-TW')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
