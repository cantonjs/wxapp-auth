import crypto from 'crypto';

export default function decryptBizData({
	appId,
	sessionKey,
	encryptedData,
	iv,
}) {
	sessionKey = Buffer.from(sessionKey, 'base64');
	encryptedData = Buffer.from(encryptedData, 'base64');
	iv = Buffer.from(iv, 'base64');

	let decoded;

	try {
		const decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, iv);
		decipher.setAutoPadding(true);
		decoded = decipher.update(encryptedData, 'binary', 'utf8');
		decoded += decipher.final('utf8');
		decoded = JSON.parse(decoded);
	}
	catch (err) {
		throw new Error('Illegal Buffer');
	}

	const { watermark, ...userInfo } = decoded;

	if (watermark.appid !== appId) {
		throw new Error('Illegal Buffer');
	}

	return userInfo;
}
