// Type definitions for rollup-plugin-post-obfuscator 1.0
// Project: https://github.com/KongYanHHHH/rollup-plugin-post-obfuscator
// Definitions by: huangkongyan <https://github.com/KongYanHHHH>
import type { Plugin } from 'rollup';
import type { ObfuscatorOptions } from 'javascript-obfuscator';

export interface Options {
  /**
   *  Output Directory
   *  @default `dist`
   */
  outDir: string;

  /**
   *  include rule - Rules are validated using micromatch.isMatch
   *  @default []
   *  @see https://github.com/micromatch/micromatch?tab=readme-ov-file#ismatch
   */
  include: string | string[];

  /**
   *  exclude rule - Rules are validated using micromatch.isMatch
   *  @default []
   *  @see https://github.com/micromatch/micromatch?tab=readme-ov-file#ismatch
   */
  exclude: string | string[];

  /**
   *  Output Directory
   *  @default HighPerformance
   *  @see https://github.com/javascript-obfuscator/javascript-obfuscator
   */
  JavaScriptObfuscatorOptions: ObfuscatorOptions;
}

declare function postObfuscator(op?: Partial<Options>): Plugin;
export default postObfuscator
