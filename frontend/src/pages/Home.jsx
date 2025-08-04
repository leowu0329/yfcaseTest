import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Home = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
            歡迎來到用戶認證系統
          </h1>
          
          {user ? (
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
              <div className="mb-6">
                <div className="w-20 h-20 bg-indigo-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    {user.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  {user.username}
                </h2>
                <p className="text-gray-600">{user.email}</p>
                {user.bio && (
                  <p className="text-gray-500 mt-2">{user.bio}</p>
                )}
              </div>
              
              <div className="space-y-3">
                <Link
                  to="/profile"
                  className="block w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-200"
                >
                  編輯個人資料
                </Link>
                <button
                  onClick={logout}
                  className="block w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-200"
                >
                  登出
                </button>
              </div>
            </div>
          ) : (
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
          )}
        </div>
        
        <div className="mt-12 grid md:grid-cols-3 gap-8">
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
};

export default Home; 