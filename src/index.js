import { Hono } from 'hono';
import { Telegraf } from 'telegraf';

const app = new Hono();

let api = null;
function getBot(token) {
	if (!api) {
		api = new Telegraf(token);
	}
	return api;
}

// 健康检查
app.get('/', async (c) => {
	return c.text('ok.....');
});

app.get('/api/getMe', async (c) => {
	try {
		const start = performance.now();
		const api = getBot(c.env.TEST1_TOKEN);
		let me = await api.telegram.getMe();
		const end = performance.now();
		const duration = (end - start).toFixed(2); // 毫秒
		return c.json({
			'me': me,
			'time': duration,
		});
	} catch (e) {
		console.error('异常', e)
	}
	return c.text('ok')
});

app.get('/api/testInsert', async (c) => {
	try {
		const logContent = "这是一条测试日志";

		let startTime = new Date().getTime()
		const info = await c.env.DB.prepare(
			"INSERT INTO log (log, create_time) VALUES (?, datetime('now'))"
		)
			.bind(logContent)
			.run();

		let endTime = new Date().getTime()
		return c.json({
			success: true,
			message: "插入成功,耗时=" + (endTime - startTime),
			info: info
		});
	} catch (e) {
		return c.text("插入失败: " + e.message, 500);
	}
});

app.get('/api/logs', async (c) => {
	try {
		const startTime = new Date().getTime();

		// 使用 all() 获取所有行
		// 建议加上 LIMIT 防止数据量过大时崩溃，并按时间倒序排列
		const { results } = await c.env.DB.prepare(
			"SELECT * FROM log ORDER BY create_time DESC LIMIT 100"
		).all();

		const endTime = new Date().getTime();

		return c.json({
			success: true,
			count: results.length,
			duration: `${endTime - startTime}ms`,
			data: results
		});
	} catch (e) {
		console.error("查询失败:", e.message);
		return c.json({ success: false, error: e.message }, 500);
	}
});

// Webhook 处理
app.post('/api/webhook', async (c) => {
	let body = await c.req.json()
	return Response.json({  })
});

export default app;
