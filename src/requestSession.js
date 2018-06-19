import qs from 'querystring';
import fetch from 'node-fetch';
import { assert } from './utils';

export default async function requestSession(url, { appId, appSecret, code }) {
	assert(code, 'Missing "code"');

	const query = qs.stringify({
		appid: appId,
		secret: appSecret,
		js_code: code,
		grant_type: 'authorization_code',
	});
	const fullUrl = `${url}?${query}`;
	const res = await fetch(fullUrl);
	const { errcode, errmsg, session_key, ...rest } = await res.json();
	if (errcode) {
		const err = new Error(errmsg);
		err.code = errcode;
		throw err;
	}
	rest.sessionKey = session_key;
	return rest;
}
