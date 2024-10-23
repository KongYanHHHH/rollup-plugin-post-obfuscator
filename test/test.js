import test from 'ava';
import { rollup } from 'rollup';
import postObfuscator from '../src/index.js';
import { join } from 'node:path';
import { readFile, readdir, access, constants, rm } from 'node:fs/promises';

function compressString(input) {
  let withoutSpaces = input.replace(/\s+/g, '');
  let compressedString = withoutSpaces;
  return compressedString;
}

async function testMainFlow(pluginOp) {
  const inputOptions_not = {
    input: './testfiles/index.js',
  };
  const outputOptions_not = {
    dir: 'dist-not',
    format: 'es',
  };

  const inputOptions_plugin = {
    input: './testfiles/index.js',
    plugins: [postObfuscator(pluginOp)],
  };
  const outputOptions_plugin = {
    dir: pluginOp?.outDir ?? 'dist',
    format: 'es',
  };

  const bundle_not = await rollup(inputOptions_not);
  await bundle_not.write(outputOptions_not);
  await bundle_not.close();

  const bundle_plugin = await rollup(inputOptions_plugin);
  await bundle_plugin.write(outputOptions_plugin);
  await bundle_plugin.close();
}

const mapOp = {
  sourceMap: true,
  sourceMapMode: 'separate',
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 0.75,
  deadCodeInjection: true,
  deadCodeInjectionThreshold: 0.4,
  debugProtection: false,
  debugProtectionInterval: 0,
  disableConsoleOutput: true,
  identifierNamesGenerator: 'hexadecimal',
  log: false,
  numbersToExpressions: true,
  renameGlobals: false,
  selfDefending: true,
  simplify: true,
  splitStrings: true,
  splitStringsChunkLength: 10,
  stringArray: true,
  stringArrayCallsTransform: true,
  stringArrayCallsTransformThreshold: 0.75,
  stringArrayEncoding: ['base64'],
  stringArrayIndexShift: true,
  stringArrayRotate: true,
  stringArrayShuffle: true,
  stringArrayWrappersCount: 2,
  stringArrayWrappersChainedCalls: true,
  stringArrayWrappersParametersMaxCount: 4,
  stringArrayWrappersType: 'function',
  stringArrayThreshold: 0.75,
  transformObjectKeys: true,
  unicodeEscapeSequence: false,
};

test('DefaultConfiguration', async t => {
  await testMainFlow();

  const outputFilePath_not = join(process.cwd(), 'dist-not', 'index.js');
  const outputFileContent_not = await readFile(outputFilePath_not, 'utf8');

  const outputFilePath_plugin = join(process.cwd(), 'dist', 'index.js');
  const outputFileContent = await readFile(outputFilePath_plugin, 'utf8');

  t.true(
    compressString(outputFileContent) !== compressString(outputFileContent_not),
    'The same content',
  );
  t.true(
    compressString(outputFileContent).length !==
      compressString(outputFileContent_not).length,
    'Same character length',
  );
});

test('IncludeOnly', async t => {
  await testMainFlow({ include: 'index.js' });

  const outputFilePath_not = join(process.cwd(), 'dist-not', 'index.js');
  const outputFileContent_not = await readFile(outputFilePath_not, 'utf8');

  const outputFilePath_plugin = join(process.cwd(), 'dist', 'index.js');
  const outputFileContent = await readFile(outputFilePath_plugin, 'utf8');

  t.false(
    compressString(outputFileContent) === compressString(outputFileContent_not),
    'The same content',
  );
  t.false(
    compressString(outputFileContent).length ===
      compressString(outputFileContent_not).length,
    'Same character length',
  );
});

test('ExcludeOnly', async t => {
  await testMainFlow({ exclude: 'index.js' });

  const outputFilePath_not = join(process.cwd(), 'dist-not', 'index.js');
  const outputFileContent_not = await readFile(outputFilePath_not, 'utf8');

  const outputFilePath_plugin = join(process.cwd(), 'dist', 'index.js');
  const outputFileContent = await readFile(outputFilePath_plugin, 'utf8');

  t.is(
    compressString(outputFileContent),
    compressString(outputFileContent_not),
    'Different content',
  );
  t.is(
    compressString(outputFileContent).length,
    compressString(outputFileContent_not).length,
    'Different length',
  );
});

test('IncludeExclude', async t => {
  await testMainFlow({ include: '*.js', exclude: 'b*.js' });

  const outputFilePath_not = join(process.cwd(), 'dist-not', 'index.js');
  const outputFileContent_not = await readFile(outputFilePath_not, 'utf8');

  const outputFilePath_plugin = join(process.cwd(), 'dist', 'index.js');
  const outputFileContent = await readFile(outputFilePath_plugin, 'utf8');

  const dir_plugin = await readdir(join(process.cwd(), 'dist'), {
    recursive: true,
  });

  const dir_not = await readdir(join(process.cwd(), 'dist-not'), {
    recursive: true,
  });

  const outputFileContent_not_b = await readFile(
    join(
      process.cwd(),
      'dist-not',
      dir_not.find(_path => _path !== 'index.js'),
    ),
    'utf8',
  );

  const outputFileContent_b = await readFile(
    join(
      process.cwd(),
      'dist',
      dir_plugin.find(_path => _path !== 'index.js'),
    ),
    'utf8',
  );

  t.not(
    compressString(outputFileContent),
    compressString(outputFileContent_not),
    'The same content',
  );
  t.not(
    compressString(outputFileContent).length,
    compressString(outputFileContent_not).length,
    'Same character length',
  );
  t.true(
    compressString(outputFileContent_not_b) ===
      compressString(outputFileContent_b),
    'Different content',
  );
});

test('ModifyOutputFolder', async t => {
  await testMainFlow({ outDir: 'dist-modifyOutDir', include: 'index.js' });

  const outputFilePath_not = join(process.cwd(), 'dist-not', 'index.js');
  const outputFileContent_not = await readFile(outputFilePath_not, 'utf8');

  const outputFilePath_plugin = join(
    process.cwd(),
    'dist-modifyOutDir',
    'index.js',
  );
  const outputFileContent = await readFile(outputFilePath_plugin, 'utf8');

  t.not(
    compressString(outputFileContent),
    compressString(outputFileContent_not),
    'The same content',
  );
  t.not(
    compressString(outputFileContent).length,
    compressString(outputFileContent_not).length,
    'Same character length',
  );
});

test('DetectGeneratedMap', async t => {
  const inputOptions_inline = {
    input: './testfiles/index.js',
    plugins: [
      postObfuscator({
        outDir: 'dist-map-inline',
        include: 'index.js',
        JavaScriptObfuscatorOptions: { ...mapOp, sourceMapMode: 'inline' },
      }),
    ],
  };
  const outputOptions_inline = {
    dir: 'dist-map-inline',
    format: 'es',
  };

  const inputOptions_separate = {
    input: './testfiles/index.js',
    plugins: [
      postObfuscator({
        outDir: 'dist-map-separate',
        include: 'index.js',
        JavaScriptObfuscatorOptions: mapOp,
      }),
    ],
  };
  const outputOptions_separate = {
    dir: 'dist-map-separate',
    format: 'es',
  };

  const bundle_inline = await rollup(inputOptions_inline);
  await bundle_inline.write(outputOptions_inline);
  await bundle_inline.close();

  const bundle_separate = await rollup(inputOptions_separate);
  await bundle_separate.write(outputOptions_separate);
  await bundle_separate.close();

  const outputFileContent_inline = await readFile(
    join(process.cwd(), 'dist-map-inline', 'index.js'),
    'utf8',
  );

  const outputFileContent_separate = await readFile(
    join(process.cwd(), 'dist-map-separate', 'index.js'),
    'utf8',
  );

  t.regex(
    outputFileContent_inline,
    /\/\/# sourceMappingURL=+/,
    'js file not found sourceMappingURL',
  );
  t.regex(
    outputFileContent_separate,
    /\/\/# sourceMappingURL=+/,
    'js file not found sourceMappingURL',
  );

  try {
    await access(
      join(process.cwd(), 'dist-map-separate', 'index.js.map'),
      constants.F_OK,
    );
    t.pass('Pass');
  } catch {
    t.fail('separate does not generate map');
  }
});

test.after.always('Cleanup output files', async () => {
  const files = await readdir(process.cwd());

  files.forEach(_path => {
    if (/^dist*/.test(_path)) {
        rm(join(process.cwd(), _path), { recursive: true });
    }
  });
});
