/**
 * Sass Modules
 *
 * @var {Array}
 */
module.exports = [
  {
    file: './src/scss/site-default.scss',
    outDir: './assets/styles/',
    outFile: 'site-default-development.css',
    precision: 2,
    includePaths: [
      './src/',
      './node_modules/',
      './node_modules/@nycopportunity/working-patterns/src/',
    ],
    devModule: true
  }
];