<div align="center">

# Rollup plugin JavaScript后置混淆

<a href="LICENSE">
  <img src="https://img.shields.io/badge/license-MIT-brightgreen.svg" alt="Software License" />
</a>
<a href="https://github.com/KongYanHHHH/rollup-plugin-post-obfuscator/issues">
  <img src="https://img.shields.io/github/issues/KongYanHHHH/rollup-plugin-post-obfuscator.svg" alt="Issues" />
</a>
<a href="https://npmjs.org/package/rollup-plugin-post-obfuscator">
  <img src="https://img.shields.io/npm/v/rollup-plugin-post-obfuscator.svg?style=flat-squar" alt="NPM" />
</a>
<a href="https://github.com/KongYanHHHH/rollup-plugin-post-obfuscator/releases">
  <img src="https://img.shields.io/github/release/KongYanHHHH/rollup-plugin-post-obfuscator.svg" alt="Latest Version" />
</a>

<p align="center">
  <strong>中文</strong> | <a href="./README.md">English</a>
</p>

</div>

## ⭐️ 功能

- js代码混淆
- 在生成文件后混淆
- 支持包含、排除规则
- 支持map文件
- 支持异步导入的模块混淆
- 支持ts

## 📦 安装

```
# npm
npm install --save-dev rollup-plugin-post-obfuscator
# or yarn
yarn add rollup-plugin-post-obfuscator --dev
```

## 👨‍💻 使用

```js
// rollup.config.js
import obfuscator from 'rollup-plugin-post-obfuscator';

export default {
  input: 'input.js',
  output: {
    file: 'output.js',
    format: 'es',
    assetFileNames: 'assets/[name]-[hash][extname]',
  },
  plugins: [obfuscator()],
};
```

### 🛠️ 配置

#### `outDir`

type: string
default: 'dist'
打包产物的文件夹

```js
{
  output: {
    dir: 'dist-test';
  },
  obfuscator({
    outDir: 'dist-test',
  });
}
```

#### `include`

type: string | string[]
default: []
需要混淆文件的规则

```js
obfuscator({
  include: 'index.js',
});
// or
obfuscator({
  include: ['b*.js','assets/*'],
});
```

#### `exclude`

type: string | string[]
default: []
需要排除的文件

```js
obfuscator({
  exclude: 'index.js',
});
// or
obfuscator({
  exclude: ['b*.js','assets/*'],
});
```

#### `JavaScriptObfuscatorOptions`

type: ObfuscatorOptions
default: HighPerformance
javascript-obfuscator 配置
详细配置看这里 [options](https://github.com/javascript-obfuscator/javascript-obfuscator?tab=readme-ov-file#javascript-obfuscator-options)


## 🤝 贡献

非常欢迎贡献和反馈。

To get it running:

1. Clone the project.
2. `npm install`
3. `npm run build`

## 📄 License

The MIT License (MIT). Please see [License File](LICENSE) for more information.

[link-author]: https://github.com/KongYanHHHH