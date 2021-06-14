const fs = require('fs');
const glob = require('glob');
const svgstore = require('svgstore');
const crypto = require('crypto');

/**
 * Config
 */
const iconsDir = [
  'node_modules/@nycopportunity/working-patterns/dist/svg/',
  'node_modules/feather-icons/dist/icons/'
];

const matches = [
  'icon-',
  'logo-',
  'option-',
  'shape-',
  'select-',
  'arrow-',
  'chevron-',
  'help-circle',
  'calendar',
  'users',
  'award',
  'x',
  'copy',
  'check',
  'facebook',
  'twitter',
  'menu',
  'translate',
  'search',
  'info',
  'alert-',
  'external-link',
  'share-2'
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
  console.log(`${cleanEmoji}  Removing existing files`);

  try {
    let files = fs.readdirSync(`${outputDir}`);

    for (const file of files) {
      if (fs.existsSync(`${outputDir}${file}`)){
        fs.unlinkSync(`${outputDir}${file}`, err => {
          if (err) console.log('error' + err);
        })
      }
    }

    return files;
  } catch (err) {
    console.log(err);
  }
}

/**
 * Copy svgs and generate store
 */
async function compile() {
  await clean()

  console.log(`\n${buildEmoji}  Creating Icon Sprite`);

  try {
    let icons = svgstore();

    for await (const path of iconsDir) {
      for await (const s of matches) {
        let files = glob.sync(`${path}${s}*`, {});

        for (let index = 0; index < files.length; index++) {
          const file = files[index];

          let filename = file.replace(`${path}`, '');

          // Add icon to store
          icons.add(filename.replace('.svg', ''), fs.readFileSync(file, 'utf8'));

          // console.dir(icons);
          fs.writeFileSync(`${outputDir}icons.svg`, icons.toString());
        }
      }
    }

    console.log(`\n${buildEmoji}  Hashing Icon Sprite`);

    let name = fs.readFileSync(`${outputDir}icons.svg`, 'utf8');
    var hash = crypto.createHash('md5').update(name).digest('hex').substring(0, 7);

    fs.renameSync(`${outputDir}icons.svg`, `${outputDir}icons-${hash}.svg`);

    console.log(`\n${compileEmoji}  Icon sprite created.`);
  } catch (err) {
    console.log('Error! ' + err);
  }
}

/**
 * Execute Icons
 */
compile();