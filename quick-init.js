// 快速Supabase数据库初始化脚本
// 请复制下面的完整代码并在浏览器控制台中运行

const SUPABASE_URL = 'https://ktkcyuvoqbgcvszppguc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0a2N5dXZvcWJnY3ZzenBwZ3VjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1MjEzMDQsImV4cCI6MjA4MDA5NzMwNH0.j7Q136ASZe84LZR_SSSMax4n5P-YO8qeSua3BOkJInU';

async function initSupabaseDatabase() {
    console.log('🚀 开始初始化Supabase数据库...');
    
    try {
        // 检查表是否已存在
        console.log('1️⃣ 检查数据库表是否存在...');
        const checkResponse = await fetch(`${SUPABASE_URL}/rest/v1/express_compensation_records?limit=1`, {
            method: 'GET',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (checkResponse.ok) {
            console.log('✅ 数据库表已存在！');
            return true;
        } else if (checkResponse.status === 404) {
            console.log('⚠️ 表不存在，正在尝试创建...');
            
            // 尝试插入一条记录来触发表创建
            const createResponse = await fetch(`${SUPABASE_URL}/rest/v1/express_compensation_records`, {
                method: 'POST',
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify({
                    tracking_number: 'INIT_' + Date.now(),
                    amount: 0.01,
                    record_type: 'compensation',
                    is_paid: false,
                    record_date: new Date().toISOString().split('T')[0],
                    note: '初始化测试记录'
                })
            });

            if (createResponse.ok) {
                console.log('✅ 数据库初始化成功！');
                
                // 删除测试记录
                await fetch(`${SUPABASE_URL}/rest/v1/express_compensation_records?tracking_number=eq.INIT_${Date.now()}`, {
                    method: 'DELETE',
                    headers: {
                        'apikey': SUPABASE_ANON_KEY,
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                return true;
            } else {
                const errorData = await createResponse.json();
                throw new Error(errorData.message || '创建表失败');
            }
        } else {
            throw new Error(`HTTP ${checkResponse.status}: ${await checkResponse.text()}`);
        }
    } catch (error) {
        console.error('❌ 初始化失败:', error.message);
        console.log('');
        console.log('📋 手动初始化步骤：');
        console.log('1. 打开 https://supabase.com 并登录您的项目');
        console.log('2. 进入 SQL Editor');
        console.log('3. 复制并执行以下SQL：');
        console.log('');
        console.log(`CREATE TABLE IF NOT EXISTS express_compensation_records (
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

CREATE INDEX IF NOT EXISTS idx_express_compensation_records_date ON express_compensation_records(record_date);
CREATE INDEX IF NOT EXISTS idx_express_compensation_records_tracking_number ON express_compensation_records(tracking_number);
CREATE INDEX IF NOT EXISTS idx_express_compensation_records_type ON express_compensation_records(record_type);
CREATE INDEX IF NOT EXISTS idx_express_compensation_records_is_paid ON express_compensation_records(is_paid);

ALTER TABLE express_compensation_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON express_compensation_records FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON express_compensation_records FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON express_compensation_records FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON express_compensation_records FOR DELETE USING (true);`);
        console.log('');
        console.log('4. 执行完成后，刷新页面重试');
        return false;
    }
}

// 自动执行初始化
initSupabaseDatabase().then(success => {
    if (success) {
        console.log('🎉 数据库初始化完成！请刷新页面使用应用。');
        alert('✅ 数据库初始化成功！请刷新页面。');
    } else {
        console.log('❌ 请按照上述步骤手动初始化数据库');
        alert('❌ 初始化失败，请查看控制台输出并按照步骤手动创建表');
    }
});