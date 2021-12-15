#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const alerts = require('@nycopportunity/pttrn/config/alerts');
const cnsl = require('@nycopportunity/pttrn/bin/util/console');
const resolve = require('@nycopportunity/pttrn/bin/util/resolve');

/**
 * Configuration
 *
 * @type {Array}
 */
const paths = resolve('config/rename', true, false);

// /**f
//  * Cleans previously renamed files based on files in the `paths` array.
//  *
//  * @return  {Boolean}  Truthy when complete
//  */
// const clean = async () => {
//   try {
//     let directories = paths.map(p => path.dirname(p))
//       .filter((d, i, paths) => paths.indexOf(d) === i);

//     for (let di = 0; di < directories.length; di++) {
//       let dir = directories[di];
//       let files = paths.filter(p => p.includes(dir));

//       files = files.map(f => {
//         let file = fs.readdirSync(dir).filter(curr => {
//           return curr.startsWith(`${path.basename(f, path.extname(f))}-`) &&
//             curr.endsWith(path.extname(f));
//         }).map(f => path.join(dir, f));

//         return file;
//       }).flat();

//       console.dir(files);

//       files.forEach(async (f) => {
//         await fs.unlinkSync(f);

//         cnsl.describe(`${alerts.success} Rename deleting ${alerts.str.path(f)}`);
//       });
//     }

//     return true;
//   } catch (err) {
//     cnsl.error(`Rename (rename): ${err.stack}`);
//   }
// };

/**
 * Renames files included in the `paths` array.
 *
 * @return  {Boolean}  Truthy when complete
 */
const rename = async () => {
  try {
    for (let index = 0; index < paths.length; index++) {
      let p = paths[index];

      if (!fs.existsSync(p)) continue;

      let content = await fs.readFileSync(p);

      let hash = (process.env.NODE_ENV === 'production') ?
        crypto.createHash('md5')
          .update(content)
          .digest('hex')
          .substring(0, 7)
        : 'development';

      let basename = (p.includes('-development')) ?
        path.basename(p, path.extname(p)).replace('development', hash) :
        `${path.basename(p, path.extname(p))}-${hash}`;

      let rename = path.join(path.dirname(p), `${basename}${path.extname(p)}`);

      await fs.renameSync(p, rename);

      cnsl.describe(`${alerts.success} Rename ${alerts.str.path(p)} to ${alerts.str.path(rename)}`);
    }

    return true;
  } catch (err) {
    cnsl.error(`Rename (rename): ${err.stack}`);
  }
};

/**
 * The main task running function
 */
const run = async () => {
  await rename();

  process.exit();
};

/**
 * @var {Object}
 */
module.exports = {
  run: run
};
