import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { landAPI } from '../../utils/api'
import LandTable from './LandTable'
import LandForm from './LandForm'

const LandManagement = ({ yfcases_id }) => {
  const [lands, setLands] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingLand, setEditingLand] = useState(null)

  const loadLands = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await landAPI.getByYfcase(yfcases_id)
      setLands(res.data.data)
    } catch (e) {
      console.error('載入土地失敗', e)
      setError('載入土地失敗')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (yfcases_id) {
      loadLands()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yfcases_id])

  if (loading) {
    return (
      <div className="py-10 text-center text-gray-600">載入中...</div>
    )
  }

  if (error) {
    return (
      <div className="py-10 text-center text-red-600">{error}</div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">土地資訊</h3>
        <button
          onClick={() => {
            setEditingLand(null)
            setIsFormOpen(true)
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          新增地號
        </button>
      </div>

      <LandTable
        lands={lands}
        onEdit={(land) => {
          setEditingLand(land)
          setIsFormOpen(true)
        }}
        onDelete={async (land) => {
          if (!land?._id) return
          if (!window.confirm(`確定要刪除地號「${land.landNumber}」嗎？`)) return
          try {
            await landAPI.delete(land._id)
            await loadLands()
          } catch (e) {
            // 簡單提示即可
            alert('刪除失敗')
          }
        }}
      />

      <LandForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={loadLands}
        yfcases_id={yfcases_id}
        initialLand={editingLand}
      />
    </div>
  )
}

LandManagement.propTypes = {
  yfcases_id: PropTypes.string.isRequired,
}

export default LandManagement
