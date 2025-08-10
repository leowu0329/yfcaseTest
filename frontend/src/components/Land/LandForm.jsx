import { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { landAPI } from '../../utils/api'

const initialForm = {
  landNumber: '',
  landUrl: '',
  landArea: '',
  landHoldingPointPersonal: '',
  landHoldingPointAll: '',
  landRemark: '',
}

const LandForm = ({ isOpen, onClose, onSuccess, yfcases_id, initialLand }) => {
  const [form, setForm] = useState(() => initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const computedArea = useMemo(() => {
    const area = parseFloat(form.landArea)
    const personal = parseInt(form.landHoldingPointPersonal, 10)
    const total = parseInt(form.landHoldingPointAll, 10)
    if (!isFinite(area) || !isFinite(personal) || !isFinite(total) || total <= 0) return null
    const result = Math.round((personal / total) * area * 100) / 100
    return isFinite(result) ? result.toFixed(2) : null
  }, [form])

  useEffect(() => {
    if (!isOpen) return
    if (initialLand?._id) {
      setForm({
        landNumber: initialLand.landNumber ?? '',
        landUrl: initialLand.landUrl ?? '',
        landArea: initialLand.landArea ?? '',
        landHoldingPointPersonal: initialLand.landHoldingPointPersonal ?? '',
        landHoldingPointAll: initialLand.landHoldingPointAll ?? '',
        landRemark: initialLand.landRemark ?? '',
      })
    } else {
      setForm(initialForm)
    }
  }, [isOpen, initialLand])

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
      // 檢查必填欄位
      if (!form.landNumber.trim()) {
        setError('地號為必填欄位')
        return
      }
      if (!form.landArea || isNaN(parseFloat(form.landArea))) {
        setError('地坪為必填欄位且需為數字')
        return
      }
      if (!form.landHoldingPointPersonal || isNaN(parseInt(form.landHoldingPointPersonal, 10))) {
        setError('個人持分為必填欄位且需為正整數')
        return
      }
      if (!form.landHoldingPointAll || isNaN(parseInt(form.landHoldingPointAll, 10))) {
        setError('所有持分為必填欄位且需為正整數')
        return
      }

      const payload = {
        yfcases_id,
        landNumber: form.landNumber.trim(),
        landUrl: form.landUrl ? form.landUrl.trim() : '',
        landArea: parseFloat(form.landArea),
        landHoldingPointPersonal: parseInt(form.landHoldingPointPersonal, 10),
        landHoldingPointAll: parseInt(form.landHoldingPointAll, 10),
        landRemark: form.landRemark ? form.landRemark.trim() : '',
        // landCalculatedArea 由後端自動計算
      }

      console.log('Sending payload:', payload)
      if (initialLand?._id) {
        await landAPI.update(initialLand._id, payload)
      } else {
        await landAPI.create(payload)
      }
      setForm(initialForm)
      onSuccess?.()
      onClose?.()
    } catch (err) {
      console.error('LandForm error:', err)
      console.error('Response data:', err?.response?.data)
      
      if (err?.response?.status === 401) {
        setError('請先登入系統，即將跳轉到登入頁面')
        setTimeout(() => {
          window.location.href = '/login'
        }, 2000)
        return
      }
      
      const errorMessage = err?.response?.data?.message || '儲存失敗'
      const validationErrors = err?.response?.data?.errors
      if (validationErrors && Array.isArray(validationErrors)) {
        const errorDetails = validationErrors.map(e => `${e.param}: ${e.msg}`).join(', ')
        setError(`${errorMessage}: ${errorDetails}`)
      } else {
        setError(errorMessage)
      }
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
                  name="landNumber"
                  value={form.landNumber}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">連結</label>
                <input
                  type="url"
                  name="landUrl"
                  value={form.landUrl}
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
                  name="landArea"
                  step="0.01"
                  value={form.landArea}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">個人持分 *</label>
                <input
                  type="number"
                  name="landHoldingPointPersonal"
                  min="1"
                  step="1"
                  value={form.landHoldingPointPersonal}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">所有持分 *</label>
                <input
                  type="number"
                  name="landHoldingPointAll"
                  min="1"
                  step="1"
                  value={form.landHoldingPointAll}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">計算後地坪 (預覽)</label>
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
                name="landRemark"
                value={form.landRemark}
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
                {submitting ? '送出中...' : (initialLand?._id ? '更新' : '新增')}
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
