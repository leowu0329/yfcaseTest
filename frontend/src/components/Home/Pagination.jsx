import React from 'react';

const Pagination = ({ 
  pagination, 
  setPagination, 
  onPageChange 
}) => {

  
  const handleItemsPerPageChange = (newItemsPerPage) => {
    setPagination(prev => ({
      ...prev,
      itemsPerPage: newItemsPerPage,
      currentPage: 1 // 重置到第一頁
    }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({
      ...prev,
      currentPage: newPage
    }));
    if (onPageChange) {
      onPageChange(newPage);
    }
  };

    // 確保分頁數據存在
  if (!pagination) {
    console.log('Pagination: No pagination data');
    return null;
  }

  console.log('Pagination: Rendering with data:', pagination);

  return (
    <div className="bg-blue-50 rounded-lg shadow mt-6 px-4 py-3 border-2 border-blue-200 sm:px-6">
      <h3 className="text-lg font-semibold text-blue-900 mb-3">分頁控制</h3>
      
      {/* 移動端分頁 */}
      <div className="flex-1 flex justify-between sm:hidden">
        <button
          onClick={() => handlePageChange(pagination.currentPage - 1)}
          disabled={pagination.currentPage === 1}
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          上一頁
        </button>
        <button
          onClick={() => handlePageChange(pagination.currentPage + 1)}
          disabled={pagination.currentPage === pagination.totalPages}
          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          下一頁
        </button>
      </div>

      {/* 桌面端分頁 */}
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div className="flex items-center space-x-4">
          {/* 每頁顯示筆數選擇 */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">每頁顯示：</span>
            <select
              value={pagination.itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span className="text-sm text-gray-700">筆</span>
          </div>

          {/* 顯示資訊 */}
          <div>
            <p className="text-sm text-gray-700">
              顯示第 <span className="font-medium">{((pagination.currentPage - 1) * pagination.itemsPerPage) + 1}</span> 到{' '}
              <span className="font-medium">
                {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}
              </span> 筆，
              共 <span className="font-medium">{pagination.totalItems}</span> 筆結果
            </p>
          </div>
        </div>

        {/* 頁數導航 */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">
            第 {pagination.currentPage} 頁 / 共 {pagination.totalPages} 頁
          </span>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            {/* 上一頁按鈕 */}
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>

            {/* 頁數按鈕 */}
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                  page === pagination.currentPage
                    ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}

            {/* 下一頁按鈕 */}
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
