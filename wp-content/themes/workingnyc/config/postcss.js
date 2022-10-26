/**
 * Dependencies
 */

let postCssConfig = require('@nycopportunity/standard/config/postcss');
let tailwindcssConfig = require('@nycopportunity/standard/config/tailwindcss');

/**
 * Use patterns Tailwindcss config but specify templates to analyze
 */
postCssConfig.plugins = postCssConfig.plugins.map(p => {
  if (p.postcssPlugin === 'tailwindcss') {
    tailwindcssConfig.content = [
      './views/**/*.twig',
      './views/**/*.vue',
      './shortcodes/**/*.php'
    ];

    tailwindcssConfig.safelist = [];

    return require('tailwindcss')(tailwindcssConfig);
  }

  return p;
});

module.exports = postCssConfig;
