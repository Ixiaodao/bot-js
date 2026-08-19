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

// Webhook 处理
app.post('/api/webhook', async (c) => {
	let body = await c.req.json()
	return Response.json({  })
});

export default app;
