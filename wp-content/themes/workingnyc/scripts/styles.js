/**
 * Styles
 */

const chokidar = require('chokidar');
const sass = require('sass');
const postcss = require('postcss');
const fs = require('fs');
const glob = require('glob');
const crypto = require('crypto');

// PostCSS Plugins
const autoprefixer = require('autoprefixer'); // Adds vendor specific prefixes. Ships with NYCO Pttrn Framework
const cssnano = require('cssnano');           // CSS compression. Ships with NYCO Pttrn Framework
const mqpacker = require('css-mqpacker');     // Packs media queries together (TODO: Package is deprecated but it works so nicely)

/**
 * Evaluate arguments
 */
const argvs = process.argv.slice(2);
const args = {
  watch: (argvs.includes('-w') || argvs.includes('--watch')),
};

/**
 * Initialize watcher
 */
const watcher = chokidar.watch(`${process.env.PWD}/src/scss`, {
  usePolling: false,
  awaitWriteFinish: {
    stabilityThreshold: 750
  }
});

/**
 * Emojis
 */
const emojiWatch = '\u{1F440}';
const emojiBuild = '\u{1F6E0} ';
const emojiStyles = '\u{1F5D1}';
const emojiClean = '\u{1F5D1} ';
const emojiCompile = '\u{2728}';

/**
 * Config - Sass
 */
const stylesDir = `${process.env.PWD}/src/scss/`;
const outputDir = `${process.env.PWD}/assets/styles/`;


const config = {
  sourceMapEmbed: true,
  includePaths: [
    'src/',
    'node_modules/',
    'node_modules/@nycopportunity/working-patterns/src/',
  ],
};

/**
 * Process Sass
 * @param {string} filename
 */
async function styles(style) {
  try {
    let filename = style.substring(style.lastIndexOf("/") + 1, style.indexOf("."));
    let sassConfig = {
      file: style,
      outFile: `${filename}.css`,
      sourceMapEmbed: config.sourceMapEmbed,
      includePaths: config.includePaths,
      devModule: true
    };

    let css = await sass.renderSync(sassConfig);

    let result = await postcss([
        autoprefixer('last 4 version'),
        mqpacker({sort: true}),
        cssnano()
      ]).process(css.css, {
        from: sassConfig.outFile,
        to: sassConfig.outFile
      });

    let hash = crypto.createHash('md5').update(result.css).digest('hex').substring(0, 7);
    let filenameExport = `${outputDir}${filename}-${hash}.css`;

    await fs.writeFileSync(filenameExport, result.css);

    console.log(`\n${emojiCompile} Stylesheet created: ${filename}-${hash}.css`)

  } catch (err) {
    console.log('Error! ' + err);
  }
}

/**
 * Remove previous files
 */
async function clean() {
  console.log(`\n${emojiClean} Removing existing files`);

  fs.readdir(`${outputDir}`, (err, files) => {
    if (err) console.log(err);
    for (const file of files) {
      fs.unlink(`${outputDir}${file}`, err => {
        if (err) console.log(err);
      })
    }
  });
}

/**
 * Execute - cleans and compiles stylesheets
 */
async function compile() {
  await clean();

  glob(`${stylesDir}style-*`, {}, (err, files) => {
    files.forEach(file =>{
      styles(file);
    })
  });
}

/**
 * Execute Styles
 */
if (args.watch) {
  console.log(`\n${emojiWatch} Watching styles begins`);

  watcher.on('change', (changed) => {
    console.log(`\n${emojiStyles}  Change detected in ` + changed.replace(`${process.env.PWD}`, ''));
    compile();
  });
} else {
  console.log(`\n${emojiBuild} Building styles begins`);

  compile();
  watcher.close();
}

