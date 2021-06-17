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

const sprite = [
  'icon-',
  'logo-',
  'option-',
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

const copy = [
  'shape-wnyc-a.svg',
  'shape-wnyc-b.svg',
  'shape-wnyc-c.svg'
];

const outputDir = `${process.env.PWD}/assets/svg/`;

/**
 * Emojis
 */
const emojiBuild = '\u{1F6E0} ';
const emojiClean = '\u{1F5D1} ';
const emojiSuccess = '\u{2728}';

/**
 * Remove previous files
 */
async function clean() {
  console.log(`${emojiClean} Removing existing files`);

  try {
    let files = fs.readdirSync(`${outputDir}`);

    for (const file of files) {
      if (fs.existsSync(`${outputDir}${file}`)) {
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
 * Copy SVG Source into SVG Sprite
 */
async function createSprite() {
  console.log(`\n${emojiBuild} Creating SVG sprite`);

  try {
    let icons = svgstore();

    for await (const path of iconsDir) {
      for await (const s of sprite) {
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

    console.log(`\n${emojiBuild} Hashing SVG sprite`);

    let name = fs.readFileSync(`${outputDir}icons.svg`, 'utf8');
    var hash = crypto.createHash('md5').update(name).digest('hex').substring(0, 7);

    fs.renameSync(`${outputDir}icons.svg`, `${outputDir}icons-${hash}.svg`);

    console.log(`\n${emojiSuccess} Icon sprite created`);

    return true;
  } catch (err) {
    console.log('Error! ' + err);
  }
}

/**
 * Copy Files
 */
async function copyFiles() {
  try {
    for (let index = 0; index < copy.length; index++) {
      const file = copy[index];

      fs.copyFileSync(`${iconsDir[0]}${file}`, `${outputDir}${file}`);

      console.log(`\n${emojiSuccess} Copied ${file} to ${outputDir.replace(process.env.PWD, '')}`);
    }

    return true;
  } catch (err) {
    console.log(err);
  }
}

/**
 * Create Icon Sprite
 */

(async () => {
  await clean();

  await createSprite();

  await copyFiles();
})();
