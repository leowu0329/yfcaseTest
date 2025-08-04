# 用戶認證系統

一個完整的用戶認證系統，包含前端 React 應用和後端 Node.js API，使用 MongoDB Cloud 作為數據庫。

## 系統架構

```
yfcaseTest/
├── frontend/          # React 前端應用
│   ├── src/
│   │   ├── components/    # 可重用組件
│   │   ├── context/       # React Context
│   │   ├── pages/         # 頁面組件
│   │   └── utils/         # 工具函數
│   └── package.json
├── backend/           # Node.js 後端 API
│   ├── config/        # 配置文件
│   ├── middleware/    # 中間件
│   ├── models/        # 數據模型
│   ├── routes/        # API 路由
│   └── package.json
└── README.md
```

## 功能特性

### 後端功能
- 用戶註冊和登入
- JWT 身份驗證
- 密碼加密（bcrypt）
- 用戶資料管理
- 密碼修改
- 帳戶刪除
- 輸入驗證
- 錯誤處理

### 前端功能
- 響應式設計
- 用戶註冊/登入表單
- 個人資料編輯
- 密碼修改
- 受保護的路由
- 自動登出處理

## 快速開始

### 1. 設置 MongoDB Cloud

1. 前往 [MongoDB Cloud](https://cloud.mongodb.com/)
2. 創建一個免費集群
3. 創建數據庫用戶
4. 獲取連接字串

### 2. 設置後端

```bash
cd backend
npm install
```

創建 `.env` 文件：
```env
PORT=5000
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/user_auth_db?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=24h
```

啟動後端服務器：
```bash
npm run dev
```

### 3. 設置前端

```bash
cd frontend
npm install
```

啟動前端開發服務器：
```bash
npm run dev
```

## API 端點

### 認證相關
- `POST /api/auth/register` - 用戶註冊
- `POST /api/auth/login` - 用戶登入
- `GET /api/auth/me` - 獲取當前用戶信息

### 用戶管理
- `PUT /api/users/profile` - 更新用戶資料
- `PUT /api/users/password` - 修改密碼
- `DELETE /api/users/profile` - 刪除帳戶

## 技術棧

### 後端
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT
- bcryptjs
- express-validator
- CORS

### 前端
- React 19
- React Router DOM
- Tailwind CSS v4
- Axios
- Headless UI
- Heroicons

## 安全特性

- 密碼使用 bcrypt 加密
- JWT 令牌驗證
- 輸入驗證和清理
- CORS 配置
- 錯誤處理
- 受保護的路由

## 開發指南

### 後端開發
1. 確保 MongoDB 連接正常
2. 檢查環境變數設置
3. 使用 `npm run dev` 啟動開發服務器

### 前端開發
1. 確保後端 API 正在運行
2. 檢查 API 端點配置
3. 使用 `npm run dev` 啟動開發服務器

## 部署

### 後端部署
1. 設置生產環境變數
2. 使用 `npm start` 啟動生產服務器
3. 配置反向代理（如 Nginx）

### 前端部署
1. 運行 `npm run build`
2. 部署 `dist` 目錄到靜態文件服務器
3. 配置路由重定向

## 故障排除

### 常見問題

1. **MongoDB 連接失敗**
   - 檢查連接字串
   - 確認網絡連接
   - 驗證用戶權限

2. **JWT 令牌無效**
   - 檢查 JWT_SECRET 設置
   - 確認令牌格式
   - 檢查過期時間

3. **CORS 錯誤**
   - 檢查後端 CORS 配置
   - 確認前端 API 端點

## 貢獻

歡迎提交 Issue 和 Pull Request！

## 許可證

MIT License 