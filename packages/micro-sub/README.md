# @micro-web/sub

[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][downloads-url]
[![Minified size][min-size-image]][bundlephobia-url]
[![Gzip size][gzip-size-image]][bundlephobia-url]

`@micro-web/app` 微应用解决方案 **子应用定义**

## 安装

```bash
pnpm i @micro-web/sub
```

## 使用

```tsx
import { defineMicroApp } from '@micro-web/sub';
import App, { AppProps } from './App';

export default defineMicroApp((container) => {
  function render(props: AppProps) {
    ReactDOM.render(<App {...props} />, container);
  }
  return {
    mount: render,
    render: render,
    unmount() {
      ReactDOM.unmountComponentAtNode(container);
    },
  };
});
```

### `defineMicroApp`

需配合插件 ` @micro-web/vite-plugin`。其主要作用将 CSS 通过 `link` 标签插入到主应用的动态节点上。

[npm-image]: https://img.shields.io/npm/v/@micro-web/sub.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@micro-web/sub
[downloads-image]: http://img.shields.io/npm/dm/@micro-web/sub.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/@micro-web/sub
[min-size-image]: https://badgen.net/bundlephobia/min/@micro-web/sub?label=minified
[gzip-size-image]: https://badgen.net/bundlephobia/minzip/@micro-web/sub?label=gzip
[bundlephobia-url]: https://bundlephobia.com/result?p=@micro-web/sub
