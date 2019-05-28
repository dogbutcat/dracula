# Dracula

🧛Comes from 🏰 and 👿, it work as basic dev structure & simple api proxy.

## CHANGELOG

> 2019/05

- ADD MIT license
- UPDATE bundler version to `webpack 4.x`, `babel 7.x`
- UPDATE install package process check function to `npm search`
- UPDATE server side rendering
- UPDATE default babel loader support `.babelrc`

> 2019/04

- ADD auto install package webpack plugin
- UPDATE webpack bundler from main to child process
- UPDATE auto refresh server config under dev mode

## Getting Started

1. 新建一个git空项目
1. 执行命令 ```git submodule add [git-http/ssh] lib```
1. 运行```git submodule init && git submodule update```
1. 执行```cp -rf ./lib/example/* .```
1. 生成的lib目录请勿随意更改，如果需要更新库代码请执行以下代码```npm run lib```或```git submodule update -f && git submodule foreach git pull origin [branch]```
1. 更新后的lib引用切记同步到git
1. 执行```npm install```
1. 请进入```src```目录开发
1. 启动开发模式```npm start```
1. 启动上线模式```npm run build``` 默认输出目录为 ./public/project/, 如需更改请修改dracula.config.js中的output

<details>
<h2>内置工具引用方法</h2>

<summary>Deprecated</summary>

```js
import { HttpTool } from './lib/utils'
```

或者

```js
import { utils } from './lib';

let HttpTool = utils.HttpTool
```

### ~~HttpTool API~~

- ~~`typeEnum`~~

    ~~Enum object, current is `{ POST: 'post', GET: 'get', PUT: 'put', DELETE: 'delete' }`~~

- ~~`request`~~

    ~~Function`(type, api_type, successCallback, failCallback, param, reqOptions)`, `type` is value lists in typeEnum.~~
  - ~~`reqOption` is extra options pass to backend server, current support {isFormData,isRefer,ipKey}~~
    - ~~`isFormData`(boolean) param need to construct to meet `application/x-www-form-urlencoded` requirment~~
    - ~~`isRefer`(boolean) api_type arg can contain 'http(s)://' to request~~
    - ~~`ipKey`(string) use value with target key lists in server config of dracula.config.js, value format refers to [serviceIP](#serviceip-string)~~

#### ~~Attention~~

    if you don't want to define request `type` in request, you can use `HttpTool.post` or `HttpTool.get`...with same arguments follow which list in typeEnum object.

### ~~CookieHelp API~~

- ~~`saveUserInfo`~~

  ~~Function(userinfo, save, keyName), set `userinfo` according to `keyName`, if not given use default user key 'DEMON_USER' in helper, `save` means cookie expired in how many days.~~

- ~~`getUserInfo`~~

   ~~Function(keyName?), get user info according to `keyName` from cookie, if not given `keyName` in first time, use default user key 'DEMON_USER' in helper or it will use the value when call `saveUserInfo` above.~~

- ~~`cleareUserInfo`~~

    ~~Function(), clear user info in cookie, no matter it exists or not.~~

- ~~`getCookieInfo`~~

    ~~Function(cookieKey), get cookie value according to cookie key, return `null` if not exists, or return string or JSON data.~~

- ~~`saveCookieInfo`~~

    ~~Function(key, value, time), save cookie value with `key`, `value` and expire `time`.~~

- ~~`clearCookie`~~

    ~~Function(), clear all cookie.~~

</details>

## dracula.config.js Config File Keywords

- [server](#server)
  - [DEV](#dev-boolean)
  - [ipPass](#ipPass-object)
    - [type](#type-string)
    - [queryKey](#querykey-string)
  - [serviceIP](#serviceip-string)
  - ~~*[addrMap](#addr-object)*~~
  - [browserSupport](#browsersupport-number)
  - [blockPageName](#blockpagename-string)
  - [port](#port-number)
  - [restfulSupport](#restfulsupport-arraystring)
  - [viewPath](#viewpath-string)
  - [assetPath](#assetpath-string)
  - [transferHeader](#transferheader-string)
  - [acceptHeaders](#acceptHeaders-arraystring)
  - [contentEncoding](#contentencoding-string)
  - [custom](#custom-object)
    - [serverRoutes](#serverRoutes-function)
- [webpack](#webpack)
  - [useBundle](#usebundle-boolean)
  - [dev](#dev-object)
    - [useAnalyzer](#useanalyzer-boolean)
    - [config](#config-object)
  - [release](#release-object)
    - [useAnalyzer](#useanalyzer-boolean)
    - [config](#config-object)

## `server`

  express config options

### `DEV` (__Boolean__)

  `DEV` property is set server whether running under DEV mode, `true` means dev mode, default: true

### `ipPass` (__Object__)

  set debug ip pass configuration

#### `type` (__String__)

  `type` property is used to set ip pass type, `query` and `path`
- `query` means debug ip passed through url parameters, eg. `http://localhost:3000/?ip=192.168.1.1:8008`
- `path` means debug ip passed through path, eg. `http://localhost:3000/192.168.1.1:8008/`

#### `queryKey` (__String__)

  `queryKey` property is to set what key value to parse the debug ip, default is `ip`, eg. `http://localhost:3000/?ip=192.168.1.1:8008`, it will not work with `type` above with value 'path'

### `serviceIP` (__String__)

  `serviceIP` property is set target server, can be changed when in dev mode and address followed with `address[:port]`, default: 10.0.0.182:9092

### ~~`addrMap` (__Object__)~~

  `addrMap` property is the object with `key: [...]` to set address mapping for visiting address directly, and `key` value MUST start with type of `http` or `https` eg.

  when you visiting the website, its address is `http://www.example.com/visit`, and set `addrMap` property with object like this: `{"http://127.0.0.1":["http://www.example.com", "http://localhost:3000"]}`, then transfer Host will set to its key [in this example is `http://127.0.0.1`], but when you visit the site of `http://www.example2.com/search`, it still transfer to default setting of [serviceIP](#serviceip-string).

#### CAUSIONS

  Addresses set need to include PORT and HTTP type, eg. if your object like `{"http://127.0.0.1":["http://localhost"]}`, it mean all visits from address of `http://localhost` like: `http://localhost:3000`, `http://localhost:3001` will transfer to `http://127.0.0.1`, but `https://localhost` or `http://127.0.0.1:3000` will not work

### `browserSupport` (__Number__)

  `browserSupport` property is used for set browser support with default IE version in number type, default: 8

### `blockPageName` (__String__)

  `blockPageName` property is set page path showing for [browserSupport](#browserSupport) not passed, best for absolute path, default: hintPage.html

### `port` (__Number__)

  `port` property means port to run server, default: 3001

### `restfulSupport` (__Array__[_String_])

  `restfulSupport` property restrict which type of request type support by this server, if type not in array, use type index 0 of the array, default: `['post', 'get', 'put', 'delete']`

### `viewPath` (__String__)

  `viewPath` property set the `view` path of express server

### `assetPath` (__String__)

  `assetPath` property set the `static resources` path of express server

### `acceptHeaders` (__Array__[_String_])

  `acceptHeaders` property is used to transfer the specific headers from client to back end server

### `contentEncoding` (__String__)

  `contentEncoding` property is used to set `accept-encoding` with target value,default is `gzip, deflate, br`, if don't need content compress set value to `none` to close it

### `custom` (__Object__)

`custom` setting for server config include custom routes

### `serverRoutes` (__Function__)

- @prams: app
- @returns: void

`serverRoutes` is the function for custom express routes injection.

## `webpack`

  webpack config options

### `useBundle` (__Boolean__)

  which webpack version to use if install different versions in lib folder and outside, `true` means use inner webpack, default: true

### `dev` (__Object__)

  dev mode webpack options

#### `useAnalyzer` (__Boolean__)

  enable `webpack-bundle-analyzer` in dev/release webpack config

#### `config` (__Object__)

  assign this to replace partitial/total dev/release webpack config of preset webpack config

### `release` (__Object__)

  release mode webpack options

## TODO

- [X] ~~**Loader and Plugin extraction**~~ [2018-01-08]
- [X] ~~**Pack up**~~ [2018-01-08]
- [X] ~~**Auto install missing package under dev mode**~~ [2019-04-25]
- [X] ~~**Auto reload server setting under dev mode**~~ [2019-04-23]