# micro-app

[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][downloads-url]
[![Minified size][min-size-image]][bundlephobia-url]
[![Gzip size][gzip-size-image]][bundlephobia-url]

**English** | [中文](./README.zh-CN.md)

**simplest**、**flexible** and **componentized** micro frontend solutions

## Setup

```bash
pnpm i @micro-web/app
```

## Usage

```tsx
<MicroApp
  className="micro-app"
  entry="//localhost:3002/src/main.tsx"
  fallback={<Spinner />}
  forwardProps={{ history }}
/>
```

or

```tsx
<MicroApp
  className="micro-app"
  entry="()=>import('your-sub-app')"
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
