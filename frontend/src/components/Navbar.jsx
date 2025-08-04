import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return null; // 如果沒有登入，不顯示導航列
  }

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">U</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">用戶認證系統</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition duration-200"
            >
              首頁
            </Link>
            <Link
              to="/profile"
              className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition duration-200"
            >
              個人資料
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* User Avatar and Name */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user.username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">{user.username}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200"
            >
              登出
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
          <Link
            to="/"
            className="text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium"
          >
            首頁
          </Link>
          <Link
            to="/profile"
            className="text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium"
          >
            個人資料
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 