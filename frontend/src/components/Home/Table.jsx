import React from 'react';
import { useNavigate } from 'react-router-dom';

const Table = ({ 
  yfcases, 
  selectedCases, 
  handleSelectAll, 
  handleSelectCase, 
  handleEdit, 
  handleDelete 
}) => {
  const navigate = useNavigate();
  return (
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
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => navigate(`/detail/${yfcase._id}`)}
                        className="text-indigo-600 hover:text-indigo-900 hover:underline cursor-pointer"
                      >
                        {yfcase.caseNumber}
                      </button>
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
    </div>
  );
};

export default Table;
