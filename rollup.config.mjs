import clear from 'rollup-plugin-clear';
import json from '@rollup/plugin-json';
import ts from 'rollup-plugin-ts';
import copy from 'rollup-plugin-copy';

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
    copy({
      targets: [
        { src: 'src/*.hbs', dest: 'dist' }, // 指定要复制的 .hbs 文件路径和目标输出目录
      ],
    }),
    json(),
    ts(),
  ],
};
