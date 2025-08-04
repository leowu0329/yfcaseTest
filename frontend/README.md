# 用戶認證系統前端

這是一個基於 React 和 Tailwind CSS 的用戶認證系統前端應用。

## 功能特性

- 用戶註冊和登入
- 個人資料管理
- 密碼修改
- 響應式設計
- JWT 身份驗證
- 受保護的路由

## 安裝和設置

1. 安裝依賴：
```bash
npm install
```

2. 啟動開發服務器：
```bash
npm run dev
```

3. 構建生產版本：
```bash
npm run build
```

## 技術棧

- React 19
- React Router DOM
- Tailwind CSS v4
- Axios
- Headless UI
- Heroicons

## 頁面結構

- `/` - 首頁（歡迎頁面）
- `/login` - 登入頁面
- `/register` - 註冊頁面
- `/profile` - 個人資料頁面（需要登入）

## 組件結構

```
src/
├── components/     # 可重用組件
├── context/       # React Context
├── hooks/         # 自定義 Hooks
├── pages/         # 頁面組件
└── utils/         # 工具函數
```

## API 集成

前端通過 `src/utils/api.js` 與後端 API 通信，支持：

- 自動添加 JWT 令牌
- 錯誤處理
- 401 自動登出

## 狀態管理

使用 React Context API 管理用戶認證狀態，包括：

- 用戶信息
- 登入狀態
- 認證方法
