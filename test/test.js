import WxappAuth from '../src/WxappAuth';
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

describe('WxappAuth', () => {
	afterEach(stopServer);

	test('should getSession() work', async () => {
		const wechatLoginURL = await startServer();
		const wxappAuth = new WxappAuth(appId, appSecret, {
			wechatLoginURL,
		});
		const res = await wxappAuth.getSession({
			code: 'fake',
		});
		expect(Object.keys(res)).toEqual(['openid', 'sessionKey']);
	});

	test('should getUserInfo() work by code', async () => {
		const json = { hello: 'world' };
		const rawData = JSON.stringify(json);
		const wechatLoginURL = await startServer();
		const wxappAuth = new WxappAuth(appId, appSecret, {
			wechatLoginURL,
		});
		const res = await wxappAuth.getUserInfo({
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
		const wxappAuth = new WxappAuth(appId, appSecret, {
			wechatLoginURL,
		});
		const res = await wxappAuth.getUserInfo({
			rawData,
			signature: sha1(rawData + sessionKey),
			sessionKey,
		});
		expect(res).toEqual(json);
	});

	test('should getUserInfo() with encryptedData work', async () => {
		const { watermark, ...expectedUserInfo } = decoded;
		const wechatLoginURL = await startServer();
		const wxappAuth = new WxappAuth(appId, appSecret, {
			wechatLoginURL,
		});
		const res = await wxappAuth.getUserInfo({
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
		expect(() => new WxappAuth()).toThrow();
	});

	test('should throw error if missing `appSecret`', async () => {
		expect(() => new WxappAuth(appId)).toThrow();
	});

	test('should throw error if missing getSession() params', async () => {
		const wxappAuth = new WxappAuth(appId, appSecret);
		await expect(wxappAuth.getSession()).rejects.toThrow();
	});

	test('should throw error if missing getUserInfo() params', async () => {
		const wxappAuth = new WxappAuth(appId, appSecret);
		await expect(wxappAuth.getUserInfo()).rejects.toThrow();
	});

	test('should throw error if getUserInfo() missing rawData and encryptedData', async () => {
		const wxappAuth = new WxappAuth(appId, appSecret);
		await expect(
			wxappAuth.getUserInfo({ sessionKey }),
		).rejects.toThrow();
	});

	test('should throw error if getUserInfo() encryptedData illegal', async () => {
		const wxappAuth = new WxappAuth(appId, appSecret);
		await expect(
			wxappAuth.getUserInfo({
				sessionKey,
				iv,
				encryptedData: 'illegal',
				appId,
			}),
		).rejects.toThrow();
	});

	test('should throw error if getUserInfo() watermark illegal', async () => {
		const wxappAuth = new WxappAuth(
			'illegal app id',
			appSecret,
		);
		await expect(
			wxappAuth.getUserInfo({
				sessionKey,
				iv,
				encryptedData,
			}),
		).rejects.toThrow();
	});

	test('should throw error if getUserInfo() signature illegal', async () => {
		const rawData = JSON.stringify({ hello: 'world' });
		const wxappAuth = new WxappAuth(appId, appSecret);
		await expect(
			wxappAuth.getUserInfo({
				sessionKey,
				rawData,
				signature: 'Illegal',
			}),
		).rejects.toThrow();
	});

	test('should throw error if getSession() illegal', async () => {
		const wxappAuth = new WxappAuth(appId, appSecret);
		await expect(
			wxappAuth.getSession({ code: 'Illegal' }),
		).rejects.toThrow();
	});
});
