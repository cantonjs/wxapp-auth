import WechatMiniProgramAuth from '../src';
import { sha1 } from '../src/utils';
import { startServer, stopServer } from './utils';
import {
	appId,
	appSecret,
	sessionKey,
	iv,
	encryptedData,
	decoded,
} from './fixtures';

describe('WechatMiniProgramAuth', () => {
	afterEach(stopServer);

	test('should getSession() work', async () => {
		const wechatLoginURL = await startServer();
		const wechatMiniProgramAuth = new WechatMiniProgramAuth(appId, appSecret, {
			wechatLoginURL,
		});
		const res = await wechatMiniProgramAuth.getSession({
			code: 'fake',
		});
		expect(Object.keys(res)).toEqual(['openid', 'sessionKey']);
	});

	test('should getUserInfo() work by code', async () => {
		const json = { hello: 'world' };
		const rawData = JSON.stringify(json);
		const wechatLoginURL = await startServer();
		const wechatMiniProgramAuth = new WechatMiniProgramAuth(appId, appSecret, {
			wechatLoginURL,
		});
		const res = await wechatMiniProgramAuth.getUserInfo({
			rawData,
			signature: sha1(rawData + sessionKey),
			code: 'fake',
		});
		expect(res).toEqual(json);
	});

	test('should getUserInfo() with rawData work', async () => {
		const json = { hello: 'world' };
		const rawData = JSON.stringify(json);
		const wechatLoginURL = await startServer();
		const wechatMiniProgramAuth = new WechatMiniProgramAuth(appId, appSecret, {
			wechatLoginURL,
		});
		const res = await wechatMiniProgramAuth.getUserInfo({
			rawData,
			signature: sha1(rawData + sessionKey),
			sessionKey,
		});
		expect(res).toEqual(json);
	});

	test('should getUserInfo() with encryptedData work', async () => {
		const { watermark, ...expectedUserInfo } = decoded;
		const wechatLoginURL = await startServer();
		const wechatMiniProgramAuth = new WechatMiniProgramAuth(appId, appSecret, {
			wechatLoginURL,
		});
		const res = await wechatMiniProgramAuth.getUserInfo({
			iv,
			encryptedData,
			appId,
			sessionKey,
		});
		expect(res).toEqual(expectedUserInfo);
	});
});

describe('error', () => {
	test('should throw error if missing `appId`', async () => {
		expect(() => new WechatMiniProgramAuth()).toThrow();
	});

	test('should throw error if missing `appSecret`', async () => {
		expect(() => new WechatMiniProgramAuth(appId)).toThrow();
	});

	test('should throw error if missing getSession() params', async () => {
		const wechatMiniProgramAuth = new WechatMiniProgramAuth(appId, appSecret);
		await expect(wechatMiniProgramAuth.getSession()).rejects.toThrow();
	});

	test('should throw error if missing getUserInfo() params', async () => {
		const wechatMiniProgramAuth = new WechatMiniProgramAuth(appId, appSecret);
		await expect(wechatMiniProgramAuth.getUserInfo()).rejects.toThrow();
	});

	test('should throw error if getUserInfo() missing rawData and encryptedData', async () => {
		const wechatMiniProgramAuth = new WechatMiniProgramAuth(appId, appSecret);
		await expect(
			wechatMiniProgramAuth.getUserInfo({ sessionKey }),
		).rejects.toThrow();
	});

	test('should throw error if getUserInfo() encryptedData illegal', async () => {
		const wechatMiniProgramAuth = new WechatMiniProgramAuth(appId, appSecret);
		await expect(
			wechatMiniProgramAuth.getUserInfo({
				sessionKey,
				iv,
				encryptedData: 'illegal',
				appId,
			}),
		).rejects.toThrow();
	});

	test('should throw error if getUserInfo() watermark illegal', async () => {
		const wechatMiniProgramAuth = new WechatMiniProgramAuth(
			'illegal app id',
			appSecret,
		);
		await expect(
			wechatMiniProgramAuth.getUserInfo({
				sessionKey,
				iv,
				encryptedData,
			}),
		).rejects.toThrow();
	});

	test('should throw error if getUserInfo() signature illegal', async () => {
		const rawData = JSON.stringify({ hello: 'world' });
		const wechatMiniProgramAuth = new WechatMiniProgramAuth(appId, appSecret);
		await expect(
			wechatMiniProgramAuth.getUserInfo({
				sessionKey,
				rawData,
				signature: 'Illegal',
			}),
		).rejects.toThrow();
	});

	test('should throw error if getSession() illegal', async () => {
		const wechatMiniProgramAuth = new WechatMiniProgramAuth(appId, appSecret);
		await expect(
			wechatMiniProgramAuth.getSession({ code: 'Illegal' }),
		).rejects.toThrow();
	});
});
