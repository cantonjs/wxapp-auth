# wechat-mini-program-auth

[![CircleCI](https://circleci.com/gh/cantonjs/wechat-mini-program-auth.svg?style=shield)](https://circleci.com/gh/cantonjs/wechat-mini-program-auth)
[![Build Status](https://travis-ci.org/cantonjs/wechat-mini-program-auth.svg?branch=master)](https://travis-ci.org/cantonjs/wechat-mini-program-auth)
[![Coverage Status](https://coveralls.io/repos/github/cantonjs/wechat-mini-program-auth/badge.svg?branch=master)](https://coveralls.io/github/cantonjs/wechat-mini-program-auth?branch=master)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![License](https://img.shields.io/badge/license-MIT_License-brightgreen.svg?style=flat)](https://github.com/cantonjs/wechat-mini-program-auth/master/LICENSE.md)

Wechat mini program auth helper for Node.js.

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Installation](#installation)
- [Usage](#usage)
- [Reference](#reference)
  - [constructor(appId, appSecret)](#constructorappid-appsecret)
  - [getUserInfo(params)](#getuserinfoparams)
  - [getSession(params)](#getsessionparams)
- [License](#license)

## Installation

```bash
yarn add wechat-mini-program-auth
```

## Usage

```js
import WechatMiniProgramAuth from 'wechat-mini-program-auth';

(async function main() {
  const wechatAuth = new WechatMiniProgramAuth({
    appId: '<WECHAT_APP_ID>',
    appSecret: '<WECHAT_APP_SECRET>',
  }));

  const userInfo = await wechatAuth.getUserInfo({
    code: '<LOGIN_CODE>'
    rawData: '<RAW_DATA>',
    signature: '<SIGNATURE>',
  });
}());
```

## Reference

### constructor(appId, appSecret)

```js
new WechatMiniProgramAuth(appId, appSecret)
```

Create a `WechatMiniProgramAuth` instance.

#### Arguments

1. `appId` \<String\>: Wechat app id, required
2. `appSecret` \<String\>: Wechat app secret, required

### getUserInfo(params)

```js
wechatMiniProgramAuth.getUserInfo(params)
```

#### Arguments

1. Params \<Object\>

  - `code` \<String\>: `code` from wechat mini program `wx.login()`
  - `sessionKey` \<String\>: Session key from [getSession(params)](#getsessionparams)
  - `rawData` \<String\>: `rawData` from wechat mini program `wx.getUserInfo()`
  - `signature` \<String\>: `signature` from wechat mini program `wx.getUserInfo()`
  - `encryptedData` \<String\>: `encryptedData` from wechat mini program `wx.getUserInfo()`
  - `iv` \<String\>: `iv` from wechat mini program `wx.getUserInfo()`

##### Note

- One of `code` or `sessionKey` is required
- One of `rawData` and `signature`, or `encryptedData` and `iv` are required

#### Returns

Promise of [UserInfo](https://developers.weixin.qq.com/miniprogram/dev/api/open.html#wxgetuserinfoobject) object

### getSession(params)

```js
wechatMiniProgramAuth.getSession(params)
```

#### Arguments

1. Params \<Object\>

  - `code` \<String\>: `code` from wechat mini program `wx.login()`, required

##### Returns

Promise of object containing `sessionKey`, `openid`, and optional `unionid`

## License

MIT
