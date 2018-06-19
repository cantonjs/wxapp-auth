let asyncawait = true;
try {
	// eslint-disable-next-line
	new Function('async function test(){await 1}');
}
catch (error) {
	asyncawait = false;
}

// If node does not support async await, use the compiled version.
if (asyncawait) module.exports = require('./lib/WechatMiniProgramAuth');
else module.exports = require('./node4/WechatMiniProgramAuth');
