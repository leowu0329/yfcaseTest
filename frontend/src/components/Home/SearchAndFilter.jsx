import React from 'react';

const SearchAndFilter = ({ 
  searchParams, 
  setSearchParams, 
  handleSearch, 
  resetSearch, 
  onAddCase, 
  selectedCases, 
  onBatchDelete 
}) => {
  return (
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
              onClick={onAddCase}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200"
            >
              新增案件
            </button>
            {selectedCases.length > 0 && (
              <button
                onClick={onBatchDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-200"
              >
                批量刪除 ({selectedCases.length})
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilter;
