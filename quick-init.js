// 快速初始化数据库脚本
// 在浏览器控制台运行以下代码：
// fetch('quick-init.js').then(r => r.text()).then(code => eval(code));

async function initSupabaseDatabase() {
    console.log('🔄 开始初始化数据库...');

    const SUPABASE_URL = 'https://ugadhdhwixrejzfcwugj.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVnYWRoZGh3aXhyZWp6ZmN3dWdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyMzU3NTgsImV4cCI6MjA4MTgxMTc1OH0.XQp5pvoM-nSGfLZB9ZGfxJCkU3GbeiWrBohA_XchS54';

    const headers = {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
    };

    try {
        // 获取北京时间 (UTC+8)
        const now = new Date();
        const beijingTime = new Date(now.getTime() + 8 * 60 * 60 * 1000);

        // 尝试创建一条测试记录来触发表创建
        const testData = {
            tracking_number: 'TEST' + Date.now(),
            amount: 1.00,
            record_type: 'compensation',
            record_date: beijingTime.toISOString().split('T')[0],
            note: '初始化测试记录'
        };

        console.log('📝 尝试创建测试记录...');
        const response = await fetch(`${SUPABASE_URL}/rest/v1/express_compensation_records`, {
            method: 'POST',
            headers: {
                ...headers,
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify(testData)
        });

        if (response.ok) {
            // 获取刚创建的记录的ID，然后删除它
            console.log('✅ 测试记录创建成功，正在清理...');
            const id = response.headers.get('content-location')?.split('/').pop();

            if (id) {
                await fetch(`${SUPABASE_URL}/rest/v1/express_compensation_records?id=eq.${id}`, {
                    method: 'DELETE',
                    headers: headers
                });
                console.log('✅ 清理完成');
            }

            console.log('🎉 数据库表已创建！请刷新页面重试。');
            return true;
        } else {
            throw new Error(`创建失败: ${response.status}`);
        }

    } catch (error) {
        console.error('❌ 自动创建失败:', error.message);

        if (error.message.includes('Could not find the table')) {
            console.log('\n🔧 手动初始化步骤:');
            console.log('1. 访问 Supabase Dashboard: https://supabase.com/dashboard/project/ugadhdhwixrejzfcwugj');
            console.log('2. 进入 SQL Editor');
            console.log('3. 复制以下 SQL 并执行:');
            console.log('');
            console.log('```sql');
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
        }
        return false;
    }
}

// 导出函数供外部调用
window.initSupabaseDatabase = initSupabaseDatabase;
console.log('📋 数据库初始化脚本已加载');
console.log('🚀 运行 initSupabaseDatabase() 开始初始化，或运行以下代码:');
console.log('fetch(\'quick-init.js\').then(r => r.text()).then(code => eval(code));');