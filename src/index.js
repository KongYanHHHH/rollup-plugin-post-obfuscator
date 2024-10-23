import JavaScriptObfuscator from 'javascript-obfuscator';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, extname, basename } from 'node:path';
import { cwd } from 'node:process';
import micromatch from 'micromatch';

/**
 *  obfuscator after file generation
 *  @param op Configuration object
 *  @property {string} outDir - Package output folder, default `dist`
 *  @property {string | string[]} include - Matching rule, default undefined
 *  @property {string | string[]} exclude - Exclusion rule, default undefined
 *  @property {ObfuscatorOptions} JavaScriptObfuscatorOptions - javascript-obfuscator options, default HighPerformance
 *  @see postObfuscator
 */
function postObfuscator(op) {
  const PluginName = 'rollup-plugin-post-obfuscator';

  const printSuccessfulList = _list => {
    if (!_list.length) return;

    const maxLength = Math.max(..._list.map(_str => _str.length)) + 4;
    const boxWidth = maxLength + 5;
    const topBottomBorder = '═'.repeat(boxWidth);

    _list.forEach((_str, index) => {
      const spaces = ' '.repeat(maxLength - _str.length);

      if (index === 0) {
        console.log(topBottomBorder);
      }

      console.log('║' + ' ' + _str + spaces + '✓' + ' ' + '║');

      if (index === _list.length - 1) {
        console.log(topBottomBorder);
      }
    });
  };

  return {
    name: PluginName,
    version: '1.0.0',
    closeBundle: {
      order: 'post',
      sequential: true,
      async handler() {
        const outPath = op?.outDir ?? 'dist';
        const include = op?.include ?? [];
        const exclude = op?.exclude ?? [];
        const JavaScriptObfuscatorOptions =
          op?.JavaScriptObfuscatorOptions ?? undefined;

        const successfulList = [];

        try {
          // Read all filenames in the 'outPath' folder
          const outFullPath = join(cwd(), outPath);
          const outDirFiles = await readdir(outFullPath, {
            // withFileTypes: true,
            recursive: true,
          });

          const jsFiles = outDirFiles.filter(_path => extname(_path) === '.js');

          const resultFiles = [];

          const includeCondition =
            (Array.isArray(include) && include.length) ||
            (!Array.isArray(include) && include);

          for (const _path of jsFiles) {
            let _isIncluded = false;
            let _isExcluded = false;

            // include filter
            if (includeCondition) {
              if (micromatch.isMatch(_path, include)) {
                _isIncluded = true;
              }
            } else {
              _isIncluded = true;
            }

            // exclude filter
            if (micromatch.isMatch(_path, exclude)) {
              _isExcluded = true;
            }

            if (_isIncluded && !_isExcluded) {
              resultFiles.push(_path);
            }
          }

          let _idx = 1;
          for (const filePath of resultFiles) {
            console.log(`Processing progress: ${_idx++}/${resultFiles.length} ...`);

            const fileFullPath = join(outFullPath, filePath);

            let fileContent = await readFile(fileFullPath, 'utf-8');

            if (!fileContent) continue;

            // delect original map
            const jsMapRegExp = /\/\/# sourceMappingURL=.*\n/g;
            if (jsMapRegExp.test(fileContent)) {
              fileContent = fileContent.replace(jsMapRegExp, '\n');
            }

            const result = JavaScriptObfuscator.obfuscate(
              fileContent,
              JavaScriptObfuscatorOptions,
            );

            let code = result.getObfuscatedCode();

            if (
              JavaScriptObfuscatorOptions?.sourceMap &&
              JavaScriptObfuscatorOptions.sourceMapMode !== 'inline'
            ) {
              const mapCode = result.getSourceMap();

              await writeFile(fileFullPath + '.map', mapCode, 'utf8');

              code += `\n//# sourceMappingURL=${basename(fileFullPath)}.map\n`;
            }

            await writeFile(fileFullPath, code, 'utf8');

            successfulList.push(filePath);
          }

          printSuccessfulList(successfulList);
        } catch (error) {
          console.error(PluginName + ': ', error);
        }
      },
    },
  };
}

export default postObfuscator;
