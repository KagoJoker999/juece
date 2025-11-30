# 数据库初始化指南

## 📋 问题说明
一键初始化数据库功能可能因为网络、权限或其他原因无法正常工作。本指南提供手动初始化数据库的完整解决方案。

## 🚀 快速解决方案（推荐）

### 方案一：Supabase Dashboard直接执行（最简单）

1. **访问Supabase Dashboard**
   - 打开: https://supabase.com/dashboard/project/xjjzgxqrxddbqsdcqeqa

2. **进入SQL Editor**
   - 点击左侧菜单的 "SQL Editor"
   - 点击 "New Query"

3. **复制并执行SQL脚本**
   - 复制 `database-init.sql` 文件中的全部内容
   - 粘贴到SQL Editor中
   - 点击 "Run" 按钮执行

4. **验证创建成功**
   - 执行完成后，会显示验证信息
   - 包含表记录数、类型统计等

### 方案二：浏览器控制台执行（备用）

如果数据库表已存在但缺少数据：

1. **打开网站**
   - 访问: http://localhost:8000

2. **打开浏览器开发者工具**
   - 按 F12 或右键 → 检查

3. **在控制台执行**
   ```javascript
   // 加载初始化脚本
   fetch('quick-init.js').then(r => r.text()).then(code => eval(code));
   
   // 或者直接调用初始化函数
   initSupabaseDatabase();
   ```

## 📊 数据库结构说明

### 表名: `express_compensation_records`

| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| id | BIGSERIAL | 主键，自增ID | 1, 2, 3... |
| tracking_number | VARCHAR(255) | 快递单号 | 'SF1234567890' |
| amount | DECIMAL(10,2) | 金额（元） | 15.50（赔偿）/-3.00（垫付） |
| record_type | VARCHAR(50) | 记录类型 | 'compensation'（赔偿）/'advance'（垫付） |
| is_paid | BOOLEAN | 是否已支付 | true/false |
| record_date | DATE | 记录日期 | '2024-01-15' |
| note | TEXT | 备注信息 | '包裹破损赔偿' |
| created_at | TIMESTAMP | 创建时间 | 自动生成 |
| updated_at | TIMESTAMP | 更新时间 | 自动更新 |

## 🔧 故障排除

### 如果遇到权限错误
- 检查Supabase项目的API密钥是否正确
- 确认RLS（行级安全）策略已正确设置

### 如果表已存在
- `database-init.sql` 脚本会先删除现有表
- 如果想保留现有数据，请手动修改SQL脚本

### 如果网络连接问题
- 检查防火墙设置
- 确认Supabase服务状态
- 尝试使用VPN

## 📈 示例数据

脚本会自动创建6条示例记录：
- 3条赔偿记录（compensation）
- 3条垫付记录（advance）
- 包含已支付和未支付的混合数据

## ✅ 验证成功

执行成功后，请访问 http://localhost:8000 检查：
- [ ] 页面正常加载
- [ ] 可以看到"一键初始化数据库"按钮
- [ ] 可以正常添加新记录
- [ ] 记录列表正常显示

如果仍有问题，请检查浏览器控制台是否有错误信息。

## 🆘 获取帮助

如果按照本指南操作后仍有问题：
1. 截取错误信息截图
2. 记录具体的操作步骤
3. 提供浏览器控制台输出信息

---
*最后更新: 2024年*