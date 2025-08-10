import api from '../utils/api';

const finalDecisionAPI = {
  // 獲取案件的所有最終判定記錄
  getByYfcase: async (yfcases_id) => {
    const response = await api.get(`/finalDecisions/yfcase/${yfcases_id}`);
    return response.data;
  },

  // 獲取單一最終判定記錄
  get: async (id) => {
    const response = await api.get(`/finalDecisions/${id}`);
    return response.data;
  },

  // 創建最終判定記錄
  create: async (data) => {
    const response = await api.post('/finalDecisions', data);
    return response.data;
  },

  // 更新最終判定記錄
  update: async (id, data) => {
    const response = await api.put(`/finalDecisions/${id}`, data);
    return response.data;
  },

  // 刪除最終判定記錄
  delete: async (id) => {
    const response = await api.delete(`/finalDecisions/${id}`);
    return response.data;
  },

  // 批量刪除最終判定記錄
  batchDelete: async (ids) => {
    const response = await api.delete('/finalDecisions/batch', { data: { ids } });
    return response.data;
  }
};

export default finalDecisionAPI;
