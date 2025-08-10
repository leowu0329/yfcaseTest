import api from '../utils/api';

const resultAPI = {
  // 獲取案件的所有執行結果記錄
  getByYfcase: async (yfcases_id) => {
    const response = await api.get(`/results/yfcase/${yfcases_id}`);
    return response.data;
  },

  // 獲取單一執行結果記錄
  get: async (id) => {
    const response = await api.get(`/results/${id}`);
    return response.data;
  },

  // 創建執行結果記錄
  create: async (data) => {
    const response = await api.post('/results', data);
    return response.data;
  },

  // 更新執行結果記錄
  update: async (id, data) => {
    const response = await api.put(`/results/${id}`, data);
    return response.data;
  },

  // 刪除執行結果記錄
  delete: async (id) => {
    const response = await api.delete(`/results/${id}`);
    return response.data;
  },

  // 批量刪除執行結果記錄
  batchDelete: async (ids) => {
    const response = await api.delete('/results/batch', { data: { ids } });
    return response.data;
  }
};

export default resultAPI;
