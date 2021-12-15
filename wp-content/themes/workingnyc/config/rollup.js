/**
 * Dependencies
 */

const nodeResolve = require('@rollup/plugin-node-resolve'); // Locate modules using the Node resolution algorithm, for using third party modules in node_modules
const commonjs = require('@rollup/plugin-commonjs');        // Include CommonJS packages in Rollup bundles
const replace = require('@rollup/plugin-replace');          // Replace content while bundling
const vue = require('rollup-plugin-vue');                   // Roll up Vue single file components (SFCs)

// import babel from '@rollup/plugin-babel';
// import vue from 'rollup-plugin-vue';
// const env = process.env.NODE_ENV;

/**
 * General ES module configuration
 *
 * @type {Object}
 */
let rollup = {
  sourcemap: (process.env.NODE_ENV === 'production') ? false : 'inline',
  format: 'iife',
  strict: true
};

/**
 * Plugins
 */

const plugins = [
  nodeResolve.nodeResolve({
    browser: true,
    moduleDirectories: [
      'node_modules'
    ]
  }),
  commonjs(),
  replace({
    'preventAssignment': true,
    'process.env.NODE_ENV': `'${process.env.NODE_ENV}'`,
    // 'SCREEN_DESKTOP': 960,
    // 'SCREEN_TABLET': 768,
    // 'SCREEN_MOBILE': 480,
    // 'SCREEM_SM_MOBILE': 400
  }),
  // babel({
  //   exclude: 'node_modules/**'// ,
  //   // presets: ["@babel/preset-env"]
  // }),
  vue()
];

/**
 * Modules
 */

module.exports = [
  {
    input: './src/js/global.js',
    output: [{
      file: './assets/js/global-development.js',
      format: rollup.format,
      sourcemap: rollup.sourcemap,
      strict: rollup.strict
    }],
    plugins: plugins,
    cache: true,
    devModule: true
  },
  {
    input: './src/js/archive.js',
    output: [{
      file: './assets/js/archive-development.js',
      format: rollup.format,
      sourcemap: rollup.sourcemap,
      strict: rollup.strict
    }],
    plugins: plugins,
    cache: true,
    devModule: true
  },
  {
    input: './src/js/newsletter.js',
    output: [{
      file: './assets/js/newsletter-development.js',
      format: rollup.format,
      sourcemap: rollup.sourcemap,
      strict: rollup.strict
    }],
    plugins: plugins,
    cache: true,
    devModule: true
  },
  {
    input: './src/js/template-generic-page.js',
    output: [{
      file: './assets/js/template-generic-page-development.js',
      format: rollup.format,
      sourcemap: rollup.sourcemap,
      strict: rollup.strict
    }],
    plugins: plugins,
    cache: true,
    devModule: true
  },
  {
    input: './src/js/template-home-page.js',
    output: [{
      file: './assets/js/template-home-page-development.js',
      format: rollup.format,
      sourcemap: rollup.sourcemap,
      strict: rollup.strict
    }],
    plugins: plugins,
    cache: true,
    devModule: true
  },
  {
    input: './src/js/polyfills.js',
    output: [{
      file: './assets/js/polyfills-development.js',
      format: rollup.format,
      sourcemap: rollup.sourcemap,
      strict: rollup.strict
    }],
    plugins: plugins,
    cache: true
  }
];
