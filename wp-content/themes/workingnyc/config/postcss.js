/**
 * Dependencies
 */

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
      './views/**/*.twig',
      './views/**/*.vue',
      './shortcodes/**/*.php'
    ];

    return require('tailwindcss')(tailwindcssConfig);
  }

  return p;
});

module.exports = postCssConfig;
