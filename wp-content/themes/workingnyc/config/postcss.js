/**
 * Dependencies
 */

const alerts = require('@nycopportunity/pttrn/config/alerts');
const cnsl = require('@nycopportunity/pttrn/bin/util/console');

let postCssConfig = require('@nycopportunity/working-patterns/config/postcss');
let tailwindcssConfig = require('@nycopportunity/working-patterns/config/tailwindcss');

/**
 * Use patterns Tailwindcss config but enable just-in-time mode for prod build
 *
 * @url https://v2.tailwindcss.com/docs/just-in-time-mode
 */
postCssConfig.plugins = postCssConfig.plugins.map(p => {
  if (p.postcssPlugin === 'tailwindcss') {
    tailwindcssConfig.mode = 'jit';
    tailwindcssConfig.purge = [
      './views/**/*.twig'
    ];

    return require('tailwindcss')(tailwindcssConfig);
  }

  return p;
});

cnsl.describe(`${alerts.package} Mirroring PostCSS configuration ${alerts.str.path('@nycopportunity/working-patterns/config/postcss')} with production Tailwindcss build.`);

module.exports = postCssConfig;
