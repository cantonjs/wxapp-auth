import { sha1 } from './utils';

export default function parseRawData({ rawData, signature, sessionKey }) {
	const target = sha1(rawData + sessionKey);
	if (signature !== target) {
		throw new Error('Illegal Signature');
	}
	return JSON.parse(rawData);
}
