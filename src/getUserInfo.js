import { assert } from './utils';
import decryptAESData from './decryptAESData';
import parseRawData from './parseRawData';

export default function getUserInfo(params) {
	const { sessionKey, appId, rawData, signature, encryptedData, iv } = params;
	assert(sessionKey, 'Missing "sessionKey"');

	if (encryptedData && iv) {
		return decryptAESData({ ...params, appId });
	}
	if (rawData && signature) {
		return parseRawData(params);
	}
	assert(
		false,
		'Either "rawData" and "signature", or "encryptedData" and "iv" is required to get user info',
	);
}
