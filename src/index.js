import { Hono } from 'hono';
import { Bot } from 'grammy';
const app = new Hono();
const getBot = (token) => {
	return new Bot(token, {
		client: {
			apiRoot: "https://proxycf.cc.cd/https://api.telegram.org",
		},
	}).api;
};

// 健康检查
app.get('/', async (c) => {
	return c.text('ok...');
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


app.get('/api/getMe', async (c) => {
	let bot = getBot(c.env.TEST1_TOKEN);
	let json = await bot.getMe()
	console.log('test日志是否打印')
	return Response.json(json)
});

// Webhook 处理
app.post('/api/webhook', async (c) => {
	let body = await c.req.json()
	return Response.json({  })
});

export default app;
