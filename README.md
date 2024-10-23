<div align="center">

# The Rollup plugin post obfuscates JavaScript

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
  <strong>English</strong> | <a href="./README.zh-CN.md">中文</a>
</p>

</div>

## ⭐️ Features

- javaScript obfuscates
- obfuscate the code after the file is generated
- include and exclude are supported
- map support
- asynchronous support
- Typescript types

## 📦 Installation

```
# npm
npm install --save-dev rollup-plugin-post-obfuscator
# or yarn
yarn add rollup-plugin-post-obfuscator --dev
```

## 👨‍💻 Usage

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

### 🛠️ Options

#### `outDir`

type: string
default: 'dist'
Product output folder, Modify rollup dir This item must be modified together

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
Included files, using the micromatch.isMatch method, support file names, regular strings, and so on

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
For excluded files, use the micromatch.isMatch method, which supports file names, regular strings, and so on

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
javascript-obfuscator options
See the detailed configuration here [options](https://github.com/javascript-obfuscator/javascript-obfuscator?tab=readme-ov-file#javascript-obfuscator-options)


## 🤝 Contributing

Contributions and feedback are very welcome.

To get it running:

1. Clone the project.
2. `npm install`
3. `npm run build`

## 📄 License

The MIT License (MIT). Please see [License File](LICENSE) for more information.

[link-author]: https://github.com/KongYanHHHH