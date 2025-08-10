import PropTypes from 'prop-types'

const LandTable = ({ lands = [], onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">地號</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">地坪</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">個人持分</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">計算後地坪</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">備註</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {lands.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-4 text-center text-gray-500">目前沒有土地資料</td>
            </tr>
          ) : (
            lands.map(land => (
              <tr key={land._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{land.landNumber}</div>
                  {land.landUrl && (
                    <a href={land.landUrl} target="_blank" rel="noreferrer" className="text-xs text-indigo-600 hover:underline">查看連結</a>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{Number(land.landArea).toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{land.landHoldingPointPersonal}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{land.landHoldingPointAll}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {land.landCalculatedArea ? Number(land.landCalculatedArea).toFixed(2) : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{land.landRemark || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <div className="inline-flex items-center space-x-2">
                    <button
                      onClick={() => onEdit?.(land)}
                      className="px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      編輯
                    </button>
                    <button
                      onClick={() => onDelete?.(land)}
                      className="px-3 py-1 rounded-md border border-red-300 text-red-600 hover:bg-red-50"
                    >
                      刪除
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

LandTable.propTypes = {
  lands: PropTypes.array,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
}

export default LandTable

