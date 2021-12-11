#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const resolve = require('@nycopportunity/pttrn/bin/util/resolve');
const paths = resolve('config/rename', true, false);

let run = async () => {
  for (let index = 0; index < paths.length; index++) {
    const p = paths[index];

    if (!fs.existsSync(p)) continue;

    let content = fs.readFileSync(p);

    let hash = crypto.createHash('md5')
      .update(content)
      .digest('hex')
      .substring(0, 7);

    let rename = path.join(path.dirname(p), `${path.basename(p, path.extname(p))}-${hash}${path.extname(p)}`)

    fs.renameSync(p, rename);
  }
};

module.exports = {
  run: run
};
