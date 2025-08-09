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
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">所有持分</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">計算後坪數</th>
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
                  <div className="text-sm font-medium text-gray-900">{land['地號']}</div>
                  {land['連結'] && (
                    <a href={land['連結']} target="_blank" rel="noreferrer" className="text-xs text-indigo-600 hover:underline">查看連結</a>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{Number(land['地坪']).toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{land['個人持分']}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{land['所有持分']}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {(() => {
                    const area = Number(land['地坪'])
                    const personal = Number(land['個人持分'])
                    const total = Number(land['所有持分'])
                    if (!isFinite(area) || !isFinite(personal) || !isFinite(total) || total <= 0) return '-'
                    const result = (personal / total) * area
                    return isFinite(result) ? result.toFixed(2) : '-'
                  })()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{land['備註'] || '-'}</td>
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


