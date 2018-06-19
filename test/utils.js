import Koa from 'koa';
import getPort from 'get-port';
import { sessionKey } from './fixtures';

let server;

const fakeWechatLoginMiddleware = async (ctx, next) => {
	if (ctx.request.path === '/wechat') {
		ctx.body = {
			session_key: sessionKey,
			openid: 'FAKE_OPEN_ID',
		};
		return;
	}
	await next();
};

export async function startServer() {
	const port = await getPort();
	const app = new Koa().use(fakeWechatLoginMiddleware);
	server = app.listen(port);
	return `http://127.0.0.1:${port}/wechat`;
}

export async function stopServer() {
	if (server) {
		return new Promise((resolve) => {
			server.close(resolve);
			server = null;
		});
	}
}
