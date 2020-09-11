const fs = require('fs');
const glob = require('glob');
const svgstore = require('svgstore');
const crypto = require('crypto');

/**
 * Config
 */
const iconsDir = [
  'node_modules/@nycopportunity/patterns-framework/dist/svg/',
  'node_modules/@nycopportunity/working-patterns/dist/svg/'
];

const matches = [
  'icon-',
  'logo-',
  'option-',
  'shape-',
  'select-',
];

const outputDir = `${process.env.PWD}/assets/svg/`;

/**
 * Emojis
 */
const buildEmoji = '\u{1f6e0}';
const cleanEmoji = '\u{267b}';
const compileEmoji = '\u{2728}';

/**
 * Remove previous files
 */
async function clean() {
  console.log(`\n${cleanEmoji}  Removing existing files`);

  fs.readdir(`${outputDir}`, (err, files) => {
    if (err) console.log(err);
    for (const file of files) {
      fs.unlink(`${outputDir}${file}`, err => {
        if (err) console.log('error' + err);
      })
    }
  });
}

/**
 * Copy svgs and generate store
 */
async function compile() {
  await clean()
  console.log(`\n${buildEmoji}  Compiling icons`);

  try {
    let icons = svgstore();
    for await (const path of iconsDir) {
      for await (const s of matches) {
        glob(`${path}${s}*`, {}, (err, files) => {
          files.forEach(file => {
            let filename = file.replace(`${path}`, '');

            fs.copyFile(file, `${outputDir}${filename}`, (err) => {
              if (err) throw err;

              // Add icon to store
              icons.add(filename.replace('.svg', ''), fs.readFileSync(file, 'utf8'));

              fs.writeFileSync(`${outputDir}icons.svg`, icons);
            });
          })
        })
      }
    }

    console.log(`\n${compileEmoji}  Icons compiled.`)

  } catch (err) {
    console.log('Error! ' + err);
  }
}

/**
 * Execute Icons
 */
compile();