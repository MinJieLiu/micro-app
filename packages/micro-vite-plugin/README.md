# @micro-web/vite-plugin

[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][downloads-url]
[![Minified size][min-size-image]][bundlephobia-url]
[![Gzip size][gzip-size-image]][bundlephobia-url]

`@micro-web/app` 微应用解决方案 **Vite 插件**

## 安装

```bash
pnpm i @micro-web/vite-plugin
```

## 特性

- 创建极小的入口文件 `main.js`，配合 `hash` 和主应用时间戳缓存处理
- 将 `CSS` 动态插入到 `<MicroApp />` 创建的节点上
- 预设微应用所需的 `Vite` 配置
- 修正图片资源使用绝对地址

## 使用

```tsx
import { microWebPlugin } from '@micro-web/vite-plugin';

export default defineConfig({
  plugins: [react(), microWebPlugin()],
});
```

[npm-image]: https://img.shields.io/npm/v/@micro-web/vite-plugin.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@micro-web/vite-plugin
[downloads-image]: http://img.shields.io/npm/dm/@micro-web/vite-plugin.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/@micro-web/vite-plugin
[min-size-image]: https://badgen.net/bundlephobia/min/@micro-web/vite-plugin?label=minified
[gzip-size-image]: https://badgen.net/bundlephobia/minzip/@micro-web/vite-plugin?label=gzip
[bundlephobia-url]: https://bundlephobia.com/result?p=@micro-web/vite-plugin
