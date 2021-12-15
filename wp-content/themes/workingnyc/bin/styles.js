#!/usr/bin/env node

/**
 * Dependencies
 */

const chokidar = require('chokidar');

const sass = require('@nycopportunity/pttrn/bin/sass');
const postcss = require('@nycopportunity/pttrn/bin/postcss');
const args = require('@nycopportunity/pttrn/bin/util/args').args;
const cnsl = require('@nycopportunity/pttrn/bin/util/console');

const alerts = require('@nycopportunity/pttrn/config/alerts');
const global = require('@nycopportunity/pttrn/config/global');

const GLOBS = [
  './src/**/*.scss',
  './views/**/*.twig',
  './shortcodes/**/*.php',
  './bin/styles.js',
  './config/sass.js',
  './config/postcss.js'
];

/**
 * Run each task on the modules
 */
const main = async () => {
  try {
    await sass.run();

    await postcss.run();
  } catch (err) {
    cnsl.error(`Styles failed: ${err.stack}`);
  }
};

/**
 * Our Chokidar Watcher
 *
 * @type {Source} https://github.com/paulmillr/chokidar
 */
const watcher = chokidar.watch(GLOBS, global.chokidar);

 /**
  * Tne runner for single commands and the watcher
  */
 const run = async () => {
   try {
     if (args.watch) {
       watcher.on('change', changed => {
         cnsl.watching(`Detected change on ${alerts.str.path(changed)}`);

         main();
       });

       cnsl.watching(`Styles watching ${alerts.str.ext(GLOBS)}`);
     } else {
       await main();

       cnsl.success(`Styles finished`);

       process.exit();
     }
   } catch (err) {
     cnsl.error(`Styles failed: ${err.stack}`);
   }
 };

 /**
  * @type {Object}
  */
 module.exports = {
   run: run
 };
