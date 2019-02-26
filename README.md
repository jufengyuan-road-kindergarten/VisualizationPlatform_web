# coding_web

> A Vue.js project

## Before Build
```bash
# install pnpm（本项目使用pnpm作为包管理工具）
sudo npm install -g pnpm
```

## Build Setup

``` bash
# install dependencies
pnpm install

# serve with hot reload at localhost:8080
pnpm run dev

# build for production with minification
pnpm run build

# build for production and view the bundle analyzer report
pnpm run build --report
```
## 协作须知
```bash
# 使用UI库：iView
https://www.iviewui.com/

# 项目结构
group目录下分visitor和admin
assets存放公共资源，如公共css、js库
components存放公用组件
pages存放页面，下分visitor和admin
store使用vuex

# 路由结构
"/" 下为用户界面，对应group/visitor
"/admin/" 下为管理员界面，对应group/admin
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
