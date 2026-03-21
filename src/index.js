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
