# 新Supabase项目设置指南

## 🚨 当前项目状态诊断
- **项目URL**: `https://xjjzgxqrxddbqsdcqeqa.supabase.co`
- **状态**: 无法连接（SSL错误）
- **可能原因**: 项目被删除、暂停或服务器问题

## 🆕 创建新Supabase项目

### 步骤1：创建新项目
1. 访问 https://supabase.com/dashboard
2. 点击 "New Project"
3. 选择组织（或创建新组织）
4. 设置项目信息：
   - **Name**: `售后决策系统`
   - **Database Password**: 设置一个强密码（请记住）
   - **Region**: 选择离你最近的区域
5. 点击 "Create new project"

### 步骤2：等待项目初始化
- 项目创建需要1-2分钟
- 等待"Setting up your project..."完成

### 步骤3：获取新的API密钥
1. 进入项目仪表板
2. 点击左侧 "Settings" → "API"
3. 复制以下信息：
   - **Project URL**: `https://xxxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 步骤4：执行数据库初始化
1. 点击左侧 "SQL Editor"
2. 点击 "New Query"
3. 复制粘贴 `database-init.sql` 文件内容
4. 点击 "Run" 执行

### 步骤5：更新应用配置
需要更新以下文件中的Supabase URL和API密钥：

#### 文件列表：
- `index.html` (第1110-1111行)
- `init-db.html` (第130-131行) 
- `quick-init.js` (第8-9行)
- `supabase_init.js` (第4-5行)

#### 更新内容：
```javascript
// 替换旧的URL和密钥
const SUPABASE_URL = 'https://新项目ID.supabase.co';
const SUPABASE_ANON_KEY = '新的API密钥';
```

## 🔧 快速验证

### 测试数据库连接
在浏览器控制台执行：
```javascript
fetch('https://新项目ID.supabase.co/rest/v1/express_compensation_records?limit=1', {
  headers: {
    'apikey': '新API密钥',
    'Authorization': 'Bearer 新API密钥'
  }
}).then(r => console.log('连接状态:', r.status));
```

### 验证Web应用
1. 刷新 http://localhost:8000
2. 查看浏览器控制台是否还有错误
3. 测试添加新记录功能

## 📋 完整文件更新示例

更新 `index.html` 中的配置：

```javascript
// 在第1110行附近找到并替换
const SUPABASE_URL = 'https://新项目ID.supabase.co';
const SUPABASE_ANON_KEY = '新API密钥';
```

## ✅ 成功标志

- ✅ Supabase Dashboard显示项目正常运行
- ✅ SQL脚本执行成功，显示6条示例记录
- ✅ 网站控制台无连接错误
- ✅ 可以正常添加、查看记录

## 🆘 如果仍有问题

1. 检查新项目的RLS策略是否正确设置
2. 确认API密钥权限为 "anon public"
3. 验证网络防火墙设置
4. 尝试在不同网络环境下测试

---
*如果按照此指南操作后仍有问题，请提供具体的错误信息。*