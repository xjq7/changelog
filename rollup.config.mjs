import clear from 'rollup-plugin-clear';
import json from '@rollup/plugin-json';
import ts from 'rollup-plugin-ts';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      name: 'changelog',
      format: 'cjs',
      sourcemap: false,
    },
    {
      file: 'dist/index.es.js',
      name: 'changelog',
      format: 'es',
      sourcemap: false,
    },
  ],
  plugins: [
    clear({
      targets: ['dist'],
      watch: true, // default: false
    }),
    json(),
    ts(),
  ],
};
