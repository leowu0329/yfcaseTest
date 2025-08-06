import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// 創建 axios 實例
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 請求攔截器 - 添加 token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 響應攔截器 - 處理錯誤
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 認證相關 API
export const authAPI = {
  // 註冊
  register: (userData) => api.post('/auth/register', userData),
  
  // 登入
  login: (credentials) => api.post('/auth/login', credentials),
  
  // 獲取當前用戶信息
  getMe: () => api.get('/auth/me'),
};

// 用戶相關 API
export const userAPI = {
  // 更新用戶資料
  updateProfile: (userData) => api.put('/users/profile', userData),
  
  // 修改密碼
  changePassword: (passwordData) => api.put('/users/password', passwordData),
  
  // 刪除帳戶
  deleteAccount: () => api.delete('/users/profile'),
};

// 案件相關 API
export const yfcaseAPI = {
  // 獲取所有案件
  getAll: (params = {}) => api.get('/yfcases', { params }),
  
  // 獲取單一案件
  getOne: (id) => api.get(`/yfcases/${id}`),
  
  // 創建案件
  create: (caseData) => api.post('/yfcases', caseData),
  
  // 更新案件
  update: (id, caseData) => api.put(`/yfcases/${id}`, caseData),
  
  // 刪除案件
  delete: (id) => api.delete(`/yfcases/${id}`),
  
  // 批量刪除案件
  batchDelete: (ids) => api.delete('/yfcases/batch', { data: { ids } }),
  
  // 獲取案件統計
  getStats: () => api.get('/yfcases/stats'),
};

// 人員相關 API
export const personAPI = {
  // 獲取案件的所有人員
  getByYfcase: (yfcases_id) => api.get(`/persons/yfcase/${yfcases_id}`),
  
  // 獲取單一人員
  getOne: (id) => api.get(`/persons/${id}`),
  
  // 創建人員
  create: (personData) => api.post('/persons', personData),
  
  // 更新人員
  update: (id, personData) => api.put(`/persons/${id}`, personData),
  
  // 刪除人員
  delete: (id) => api.delete(`/persons/${id}`),
  
  // 批量刪除人員
  batchDelete: (ids) => api.delete('/persons/batch', { data: { ids } }),
};

export default api; 