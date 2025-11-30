-- 快递赔偿记录表
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
CREATE INDEX idx_express_compensation_records_date ON express_compensation_records(record_date);
CREATE INDEX idx_express_compensation_records_tracking_number ON express_compensation_records(tracking_number);
CREATE INDEX idx_express_compensation_records_type ON express_compensation_records(record_type);
CREATE INDEX idx_express_compensation_records_is_paid ON express_compensation_records(is_paid);

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_express_compensation_records_updated_at
    BEFORE UPDATE ON express_compensation_records
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 插入一些示例数据（可选）
INSERT INTO express_compensation_records (tracking_number, amount, record_type, is_paid, record_date, note) VALUES
('SF1234567890', 15.50, 'compensation', false, '2024-01-15', '包裹破损赔偿'),
('YT9876543210', -3.00, 'advance', true, '2024-01-10', '提前揽收费用'),
('ST5555666677', 25.00, 'compensation', false, '2024-01-08', '丢失包裹赔偿');

-- 启用Row Level Security (RLS)
ALTER TABLE express_compensation_records ENABLE ROW LEVEL SECURITY;

-- 创建公共读取策略（允许所有用户读取数据）
CREATE POLICY "Allow public read access" ON express_compensation_records
    FOR SELECT USING (true);

-- 创建公共插入策略（允许所有用户插入数据）
CREATE POLICY "Allow public insert access" ON express_compensation_records
    FOR INSERT WITH CHECK (true);

-- 创建公共更新策略（允许所有用户更新数据）
CREATE POLICY "Allow public update access" ON express_compensation_records
    FOR UPDATE USING (true);

-- 创建公共删除策略（允许所有用户删除数据）
CREATE POLICY "Allow public delete access" ON express_compensation_records
    FOR DELETE USING (true);