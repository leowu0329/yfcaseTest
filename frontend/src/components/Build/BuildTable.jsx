import React from 'react';

const BuildTable = ({
  builds,
  selectedBuilds,
  handleSelectAll,
  handleSelectBuild,
  handleEdit,
  handleDelete
}) => {
  if (!builds || builds.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        尚無建物資料
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <input
                type="checkbox"
                checked={selectedBuilds.length === builds.length && builds.length > 0}
                onChange={handleSelectAll}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              建號
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              建坪
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              個人持分
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              所有持分
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              計算後建坪
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              建物型
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              使用分區
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              備註
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              操作
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {builds.map((build) => (
            <tr key={build._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={selectedBuilds.includes(build._id)}
                  onChange={() => handleSelectBuild(build._id)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {build.buildNumber}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {build.buildArea} 坪
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {build.buildHoldingPointPersonal}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {build.buildHoldingPointAll}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-indigo-600">
                {build.buildCalculatedArea} 坪
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  {build.buildTypeUse}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  {build.buildUsePartition}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                {build.buildRemark || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => handleEdit(build)}
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  編輯
                </button>
                <button
                  onClick={() => handleDelete(build._id)}
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
  );
};

export default BuildTable;
