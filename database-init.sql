-- =========================================
-- 售后决策系统数据库初始化脚本
-- 适用于Supabase数据库直接执行
-- =========================================

-- 删除已存在的表（如果存在）
DROP TABLE IF EXISTS express_compensation_records CASCADE;

-- 创建快递赔偿记录表
CREATE TABLE express_compensation_records (
    id BIGSERIAL PRIMARY KEY,
    tracking_number VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    record_type VARCHAR(50) NOT NULL CHECK (record_type IN ('compensation', 'advance')),
    is_paid BOOLEAN DEFAULT FALSE,
    record_date DATE NOT NULL,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引提高查询性能
CREATE INDEX IF NOT EXISTS idx_express_compensation_records_date ON express_compensation_records(record_date);
CREATE INDEX IF NOT EXISTS idx_express_compensation_records_tracking_number ON express_compensation_records(tracking_number);
CREATE INDEX IF NOT EXISTS idx_express_compensation_records_type ON express_compensation_records(record_type);
CREATE INDEX IF NOT EXISTS idx_express_compensation_records_is_paid ON express_compensation_records(is_paid);

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 删除已存在的触发器（如果存在）
DROP TRIGGER IF EXISTS update_express_compensation_records_updated_at ON express_compensation_records;

-- 创建更新时间触发器
CREATE TRIGGER update_express_compensation_records_updated_at
    BEFORE UPDATE ON express_compensation_records
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 插入示例数据
INSERT INTO express_compensation_records (tracking_number, amount, record_type, is_paid, record_date, note) VALUES
('SF1234567890', 15.50, 'compensation', false, CURRENT_DATE, '包裹破损赔偿'),
('YT9876543210', -3.00, 'advance', true, CURRENT_DATE - INTERVAL '5 days', '提前揽收费用'),
('ST5555666677', 25.00, 'compensation', false, CURRENT_DATE - INTERVAL '7 days', '丢失包裹赔偿'),
('SF5555666677', 8.80, 'compensation', true, CURRENT_DATE - INTERVAL '3 days', '延误赔偿'),
('YT7777888899', -3.00, 'advance', false, CURRENT_DATE - INTERVAL '1 days', '提前揽收费用'),
('ST9999000000', 35.20, 'compensation', false, CURRENT_DATE - INTERVAL '2 days', '物品损坏赔偿');

-- 启用Row Level Security (RLS)
ALTER TABLE express_compensation_records ENABLE ROW LEVEL SECURITY;

-- 删除已存在的策略（如果存在）
DROP POLICY IF EXISTS "Allow public read access" ON express_compensation_records;
DROP POLICY IF EXISTS "Allow public insert access" ON express_compensation_records;
DROP POLICY IF EXISTS "Allow public update access" ON express_compensation_records;
DROP POLICY IF EXISTS "Allow public delete access" ON express_compensation_records;

-- 创建公共访问策略
CREATE POLICY "Allow public read access" ON express_compensation_records
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert access" ON express_compensation_records
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access" ON express_compensation_records
    FOR UPDATE USING (true);

CREATE POLICY "Allow public delete access" ON express_compensation_records
    FOR DELETE USING (true);

-- 验证表创建成功
SELECT 
    'express_compensation_records' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN record_type = 'compensation' THEN 1 END) as compensation_count,
    COUNT(CASE WHEN record_type = 'advance' THEN 1 END) as advance_count,
    COUNT(CASE WHEN is_paid = true THEN 1 END) as paid_count,
    COUNT(CASE WHEN is_paid = false THEN 1 END) as unpaid_count
FROM express_compensation_records;

-- 显示表结构
\d express_compensation_records;

-- 完成提示
SELECT 
    '🎉 数据库初始化完成！' as message,
    '表结构已创建，示例数据已插入，RLS策略已配置' as details,
    CURRENT_TIMESTAMP as completed_at;