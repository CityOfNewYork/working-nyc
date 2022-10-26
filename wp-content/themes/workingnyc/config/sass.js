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
      `${process.env.PWD}/node_modules/@nycopportunity/standard/src`,
      `${process.env.PWD}/node_modules/@nycopportunity/standard/dist`,
      `${process.env.PWD}/node_modules/@nycopportunity/pattern-application-header/src`,
      `${process.env.PWD}/node_modules/@nycopportunity/pattern-attribution/src`,
      `${process.env.PWD}/node_modules/@nycopportunity/pattern-elements/src`,
      `${process.env.PWD}/node_modules/@nycopportunity/pattern-menu/src`,
      `${process.env.PWD}/node_modules/@nycopportunity/pattern-navigation/src`,
      `${process.env.PWD}/node_modules/@nycopportunity/pattern-typography/src`
    ],
    devModule: true
  }
];