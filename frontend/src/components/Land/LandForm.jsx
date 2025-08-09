import { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { landAPI } from '../../utils/api'

const initialForm = {
  地號: '',
  連結: '',
  地坪: '',
  個人持分: '',
  所有持分: '',
  備註: '',
}

const LandForm = ({ isOpen, onClose, onSuccess, yfcases_id, initialLand }) => {
  const [form, setForm] = useState(() => initialForm)

  useEffect(() => {
    if (!isOpen) return
    if (initialLand?._id) {
      setForm({
        地號: initialLand['地號'] ?? '',
        連結: initialLand['連結'] ?? '',
        地坪: initialLand['地坪'] ?? '',
        個人持分: initialLand['個人持分'] ?? '',
        所有持分: initialLand['所有持分'] ?? '',
        備註: initialLand['備註'] ?? '',
      })
    } else {
      setForm(initialForm)
    }
  }, [isOpen, initialLand])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const computedArea = useMemo(() => {
    const area = parseFloat(form['地坪'])
    const personal = parseInt(form['個人持分'], 10)
    const total = parseInt(form['所有持分'], 10)
    if (!isFinite(area) || !isFinite(personal) || !isFinite(total) || total <= 0) return null
    const result = (personal / total) * area
    return isFinite(result) ? result.toFixed(2) : null
  }, [form])

  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const payload = {
        yfcases_id,
        地號: form['地號'].trim(),
        連結: form['連結'] ? form['連結'].trim() : undefined,
        地坪: form['地坪'] === '' ? undefined : parseFloat(form['地坪']),
        個人持分: form['個人持分'] === '' ? undefined : parseInt(form['個人持分'], 10),
        所有持分: form['所有持分'] === '' ? undefined : parseInt(form['所有持分'], 10),
        備註: form['備註'] ? form['備註'].trim() : undefined,
      }

      if (initialLand?._id) {
        await landAPI.update(initialLand._id, payload)
      } else {
        await landAPI.create(payload)
      }
      setForm(initialForm)
      onSuccess?.()
      onClose?.()
    } catch (err) {
      console.error(err)
      setError(err?.response?.data?.message || '儲存失敗')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">{initialLand?._id ? '編輯地號' : '新增地號'}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="mb-4 text-red-600 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">地號 *</label>
                <input
                  type="text"
                  name="地號"
                  value={form['地號']}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">連結</label>
                <input
                  type="url"
                  name="連結"
                  value={form['連結']}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">地坪 (坪) *</label>
                <input
                  type="number"
                  name="地坪"
                  step="0.01"
                  value={form['地坪']}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">個人持分 *</label>
                <input
                  type="number"
                  name="個人持分"
                  min="1"
                  step="1"
                  value={form['個人持分']}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">所有持分 *</label>
                <input
                  type="number"
                  name="所有持分"
                  min="1"
                  step="1"
                  value={form['所有持分']}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">計算後坪數</label>
                <input
                  type="text"
                  value={computedArea ?? '-'}
                  readOnly
                  className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-gray-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">備註</label>
              <textarea
                name="備註"
                value={form['備註']}
                onChange={handleChange}
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                disabled={submitting}
              >
                取消
              </button>
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-60"
                disabled={submitting}
              >
                {submitting ? '送出中...' : '新增'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

LandForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  onSuccess: PropTypes.func,
  yfcases_id: PropTypes.string.isRequired,
  initialLand: PropTypes.object,
}

export default LandForm


