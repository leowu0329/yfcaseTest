const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// 載入環境變數
dotenv.config();

// 連接數據庫
connectDB();

const app = express();

// 中間件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 路由
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/yfcases', require('./routes/yfcases'));
app.use('/api/persons', require('./routes/persons'));

// 首頁路由
app.get('/', (req, res) => {
  res.json({ 
    message: '用戶認證系統 API',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me'
      },
      users: {
        updateProfile: 'PUT /api/users/profile',
        changePassword: 'PUT /api/users/password',
        deleteAccount: 'DELETE /api/users/profile'
      },
      yfcases: {
        getAll: 'GET /api/yfcases',
        getOne: 'GET /api/yfcases/:id',
        create: 'POST /api/yfcases',
        update: 'PUT /api/yfcases/:id',
        delete: 'DELETE /api/yfcases/:id',
        batchDelete: 'DELETE /api/yfcases/batch',
        stats: 'GET /api/yfcases/stats'
      },
      persons: {
        getByYfcase: 'GET /api/persons/yfcase/:yfcases_id',
        getOne: 'GET /api/persons/:id',
        create: 'POST /api/persons',
        update: 'PUT /api/persons/:id',
        delete: 'DELETE /api/persons/:id',
        batchDelete: 'DELETE /api/persons/batch'
      }
    }
  });
});

// 錯誤處理中間件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: '服務器內部錯誤' });
});

// 404 處理
app.use('/*', (req, res) => {
  res.status(404).json({ message: '路由不存在' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`服務器運行在端口 ${PORT}`);
}); 