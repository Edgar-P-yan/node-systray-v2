// @ts-check

import { readFile } from 'node:fs/promises';

import typescript2 from 'rollup-plugin-typescript2';
import json from '@rollup/plugin-json';

const packageJSON = JSON.parse(await readFile('./package.json', 'utf-8'));

/**
 * Comment with library information to be appended in the generated bundles.
 */
const banner = `/*!
 * ${packageJSON.name} v${packageJSON.version}
 * (c) ${packageJSON.author.name}
 * Released under the ${packageJSON.license} License.
 */
`;

/**
 * Creates an output options object for Rollup.js.
 * @param {import('rollup').OutputOptions} options
 * @returns {import('rollup').OutputOptions}
 */
function createOutputOptions(options) {
  return {
    banner,
    name: 'node-systray-v2',
    exports: 'named',
    sourcemap: true,
    ...options,
  };
}

/**
 * @type {import('rollup').RollupOptions}
 */
const options = {
  input: './src/index.ts',
  output: [
    createOutputOptions({
      file: './dist/index.js',
      format: 'commonjs',
    }),
    createOutputOptions({
      file: './dist/index.cjs',
      format: 'commonjs',
    }),
    createOutputOptions({
      file: './dist/index.mjs',
      format: 'esm',
      plugins: [esmShimCustom()],
    }),
    createOutputOptions({
      file: './dist/index.esm.js',
      format: 'esm',
      plugins: [esmShimCustom()],
    }),
  ],
  plugins: [
    typescript2({
      clean: true,
      useTsconfigDeclarationDir: true,
      tsconfig: './tsconfig.bundle.json',
    }),
    json(),
  ],
};

export default options;

/**
 * The original ESM shim plugin is broken, it inserts the shims
 * in wrong places causing syntax errors. This is a very simple
 * solution, which is not better, but at list does not brake for
 * this specific code.
 *
 * @todo post the improvement to the issue https://github.com/rollup/plugins/issues/1709
 * @todo use magic-string to also generate mappings. Right now this plugin removes mappings for esm builds.
 */
function esmShimCustom() {
  const ESMShim = `
// -- Shims --
import cjsUrl from 'node:url';
import cjsPath from 'node:path';
import cjsModule from 'node:module';
const __filename = cjsUrl.fileURLToPath(import.meta.url);
const __dirname = cjsPath.dirname(__filename);
const require = cjsModule.createRequire(import.meta.url);
`;

  return {
    name: 'esm-shim-custom',

    renderChunk(/** @type {string} */ code, _chunk, opts) {
      if (opts.format === 'es') {
        let endIndexOfLastImport = -1;
        for (let match of code.matchAll(/^import\s.*';$/gm)) {
          if (match.length === 0 || typeof match.index !== 'number') {
            continue;
          }

          endIndexOfLastImport = match.index + match[0].length;
        }

        if (endIndexOfLastImport > -1) {
          code =
            code.slice(0, endIndexOfLastImport) +
            ESMShim +
            code.slice(endIndexOfLastImport);
        }

        return code;
      }

      return null;
    },
  };
}
