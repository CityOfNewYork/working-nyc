const chokidar = require('chokidar');
const fs = require('fs');
const shell = require('shelljs');

/**
 * Evaluate arguments
 */

const argvs = process.argv.slice(2);

const args = {
  watch: (argvs.includes('-w') || argvs.includes('--watch')),
};

const outputDir = `${process.env.PWD}/assets/js/`

/**
 * Initialize watcher
 */

const watcher = chokidar.watch(`${process.env.PWD}/src/js`, {
  usePolling: false,
  awaitWriteFinish: {
    stabilityThreshold: 750
  }
});

/**
 * Emojis
 */

const watchEmoji = '\u{1f440}';
const buildEmoji = '\u{1f6e0} ';
const cleanEmoji = '\u{267b}';
const compileEmoji = '\u{2728}';

/**
 * Clean - remove existing source files
 */
async function clean() {
  console.log(`\n${cleanEmoji} Removing existing files`);

  fs.readdir(`${outputDir}`, (err, files) => {
    if (err) console.log(err);

    for (const file of files) {
      if (file != 'ie'){
        fs.unlink(`${outputDir}${file}`, err => {
          if (err) console.log(err);
        })
      }
    }
  });
}

/**
 * Compile the scripts
 */

async function compile() {
  await clean();

  shell.exec(`cross-env NODE_ENV=${process.env.NODE_ENV} npm run rollup`, (code, stdout, stderr) => {
    if (code) {
      console.log(`Rollup failed: ${stderr}`);

      process.exit(1);
    } else {
      console.log(`\n${compileEmoji} Rolled up scripts defined in ${outputDir.replace(`${process.env.PWD}`, '')}`);
    }
  });
}

/**
 * Execute
 */

if (args.watch) {
  console.log(`\n${watchEmoji} Watching scripts`);

  watcher.on('change', (changed) => {
    console.log('Change detected in ' + changed.replace(`${process.env.PWD}`, ''));

    compile();
  });
} else {
  console.log(`\n${buildEmoji} Building scripts`);

  compile();

  watcher.close();
}

