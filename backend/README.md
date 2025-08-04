# 用戶認證系統後端

這是一個基於 Node.js、Express 和 MongoDB 的用戶認證系統後端 API。

## 功能特性

- 用戶註冊和登入
- JWT 身份驗證
- 密碼加密
- 用戶資料管理
- 密碼修改
- 帳戶刪除

## 安裝和設置

1. 安裝依賴：
```bash
npm install
```

2. 創建 `.env` 文件並配置環境變數：
```env
PORT=5000
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/user_auth_db?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=24h
```

3. 運行開發服務器：
```bash
npm run dev
```

4. 運行生產服務器：
```bash
npm start
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

## 數據庫設置

1. 在 MongoDB Cloud 創建一個新的集群
2. 創建數據庫用戶
3. 獲取連接字串
4. 將連接字串添加到 `.env` 文件中的 `MONGODB_URI`

## 安全特性

- 密碼使用 bcrypt 加密
- JWT 令牌驗證
- 輸入驗證和清理
- CORS 配置
- 錯誤處理 