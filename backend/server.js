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
app.use('/api/builds', require('./routes/builds'));
app.use('/api/lands', require('./routes/lands'));
app.use('/api/surveys', require('./routes/surveys'));
app.use('/api/finalDecisions', require('./routes/finalDecisions'));

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
      },
      builds: {
        getByYfcase: 'GET /api/builds/yfcase/:yfcases_id',
        getOne: 'GET /api/builds/:id',
        create: 'POST /api/builds',
        update: 'PUT /api/builds/:id',
        delete: 'DELETE /api/builds/:id',
        batchDelete: 'DELETE /api/builds/batch'
      },
      lands: {
        getByYfcase: 'GET /api/lands/yfcase/:yfcases_id',
        getOne: 'GET /api/lands/:id',
        create: 'POST /api/lands',
        update: 'PUT /api/lands/:id',
        delete: 'DELETE /api/lands/:id',
        batchDelete: 'DELETE /api/lands/batch'
      },
      surveys: {
        getByYfcase: 'GET /api/surveys/yfcase/:yfcases_id',
        getOne: 'GET /api/surveys/:id',
        create: 'POST /api/surveys',
        update: 'PUT /api/surveys/:id',
        delete: 'DELETE /api/surveys/:id',
        batchDelete: 'DELETE /api/surveys/batch'
      },
      finalDecisions: {
        getByYfcase: 'GET /api/finalDecisions/yfcase/:yfcases_id',
        getOne: 'GET /api/finalDecisions/:id',
        create: 'POST /api/finalDecisions',
        update: 'PUT /api/finalDecisions/:id',
        delete: 'DELETE /api/finalDecisions/:id',
        batchDelete: 'DELETE /api/finalDecisions/batch'
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