import requestSession from './requestSession';
import getUserInfo from './getUserInfo';
import { assert } from './utils';

export default class WxappAuth {
	constructor(appId, appSecret, options = {}) {
		this.appId = appId;
		this.appSecret = appSecret;
		this.wechatLoginURL =
			options.wechatLoginURL || 'https://api.weixin.qq.com/sns/jscode2session';

		assert(appId, '"appId" is required');
		assert(appSecret, '"appSecret" is required');
	}

	async getSession(params = {}) {
		const { appId, appSecret, wechatLoginURL } = this;
		const { code } = params;
		return requestSession(wechatLoginURL, {
			appId,
			appSecret,
			code,
		});
	}

	async getUserInfo(params = {}) {
		const { appId, appSecret, wechatLoginURL } = this;
		const { code, rawData, signature, encryptedData, iv } = params;
		let { sessionKey } = params;
		assert(
			sessionKey || code,
			'Either "code" or "sessionKey" is required to get user info',
		);

		if (!sessionKey) {
			const sessionObj = await requestSession(wechatLoginURL, {
				code,
				appId,
				appSecret,
			});
			sessionKey = sessionObj.sessionKey;
		}

		return getUserInfo({
			rawData,
			signature,
			encryptedData,
			iv,
			appId,
			sessionKey,
		});
	}
}
