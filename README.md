# micro-app

[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][downloads-url]
[![Minified size][min-size-image]][bundlephobia-url]
[![Gzip size][gzip-size-image]][bundlephobia-url]

极致**简单**、**灵活**、**灵活**和**组件化**的微应用解决方案

## 安装

```bash
pnpm i @micro-web/app
```

## 使用

```tsx
<MicroApp
  className="micro-app"
  entry="//localhost:3002/src/main.tsx"
  fallback={<Spinner />}
  forwardProps={{ history }}
/>
```

[npm-image]: https://img.shields.io/npm/v/@micro-web/app.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@micro-web/app
[downloads-image]: http://img.shields.io/npm/dm/@micro-web/app.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/@micro-web/app
[min-size-image]: https://badgen.net/bundlephobia/min/@micro-web/app?label=minified
[gzip-size-image]: https://badgen.net/bundlephobia/minzip/@micro-web/app?label=gzip
[bundlephobia-url]: https://bundlephobia.com/result?p=@micro-web/app
