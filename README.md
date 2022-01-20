<div align=center>
<h1>🎉 ViewUI 离线文档生成器 🎉</h1>

![Language](https://img.shields.io/github/languages/top/0604hx/ViewUI-doc-offline?logo=javascript&color=blue)
![License](https://img.shields.io/badge/License-MIT-green)
![LastCommit](https://img.shields.io/github/last-commit/0604hx/ViewUI-doc-offline?color=blue&logo=github)

</div>

> [View UI®](https://www.iviewui.com)，即原先的 iView，是一套基于 Vue.js 的开源 UI 组件库，主要服务于 PC 界面的中后台产品。

本工具旨在生成 ViewUI 官网文档离线版，方便内网查阅。在最新官网版本 `4.7.0` 测试通过。

<div align=center>

## 功能 / FEATURE 🎉

</div>

- ✅ 支持下载 JS、CSS、字体、图片等资源。
- ✅ 支持 `baseUrl` 替换。
- ⭕ 敬请期待……

<div align=center>

## 使用方法 / HOW-TO-USE 📖

</div>

### 1. 配置参数
> 根据实际情况进行填写

```javascript
let PATH        = "/docs/iview/"                                    //本地浏览的子路径
let HOST        = "https://file.iviewui.com/dist/"                  //iview 资源地址
let DIR         = "dist"                                            //下载内容保存目录
let CHUNK_REG   = /n.e\((\d+)\)/g                                   //子模块匹配正则表达式
let MEDIA       = true                                              //是否下载多媒体资源
let MEDIA_REG   = /\w{32}\.(png|svg|jpg|jpeg|gif|woff|woff2|ttf)/g  //图片、字体匹配正则表达式
```

### 2. 执行 index.js

```shell
node index.js

# 结果请在 dist 目录查看
```

### 3. `[可选]`删除多余信息

`index.html` 文件包含`iframe`及百度、googble 统计代码，建议删除。

### 4. 将下载内容部署到内网，Enjoy! 😄 
