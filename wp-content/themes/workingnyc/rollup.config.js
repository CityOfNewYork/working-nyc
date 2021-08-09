// import includePaths from 'rollup-plugin-includepaths';
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace';
import babel from '@rollup/plugin-babel';
import vue from 'rollup-plugin-vue';

const env = process.env.NODE_ENV;

export default [
  {
    input: './src/js/main.js',
    output: {
      dir: './assets/js',
      entryFileNames: 'source-[hash].js',
      chunkFileNames: 'source-[hash].js',
      format: 'iife',
      sourcemap: (env === 'development') ? 'inline' : false
    },
    watch: {
      include: [
        'src/js/**'
      ]
    },
    plugins: [
      // includePaths({
      //   paths: [
      //     'node_modules',
      //     // 'node_modules/@nycopportunity/patterns-framework/dist',
      //     // 'node_modules/@nycopportunity/patterns-framework/src',
      //     // 'node_modules/@nycopportunity/working-patterns/src',
      //     // 'node_modules/@nycopportunity/working-patterns/dist',
      //     // 'node_modules/@nycopportunity/access-patterns/src/utilities/element',
      //     // 'node_modules/@nycopportunity/access-patterns/src/utilities/nodelist',
      //   ],
      // }),
      nodeResolve(),
      commonjs(),
      replace({
        'process.env.NODE_ENV': JSON.stringify(env),
        preventAssignment: true
      }),
      babel({
        exclude: 'node_modules/**'// ,
        // presets: ["@babel/preset-env"]
      }),
      vue()
    ],
  }
];
