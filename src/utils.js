import crypto from 'crypto';
import nativeAssert from 'assert';
import { name } from '../package.json';

export const assert = (val, msg) => nativeAssert(val, `[${name}] ${msg}`);

export const sha1 = (str) =>
	crypto
		.createHash('sha1')
		.update(str)
		.digest('hex');
