# Working NYC Theme

This folder contains all of the PHP functions, templates, styling, and scripts for the site. This is the only WordPress theme that is compatible with the WordPress site.

* **/acf-json** - [Advanced Custom Fields](https://www.advancedcustomfields.com/pro/) JSON files for syncing custom fields between environments.
* **/assets** - The source for SVG, stylesheet, and JavaScript files in [**src**](src) and **node_modules** directories are compiled to the [**/assets**](assets) directory. The theme relies on the [Opportunity Standard](https://nycopportunity.github.io/standard) for sourcing UI code. Refer to the [documentation](https://nycopportunity.github.io/standard) for details on the different patterns and their usage.
<!-- * **/blocks** - [Custom Gutenburg Block](https://developer.wordpress.org/block-editor/developers/) source. -->
* **/timber-posts** - Site and Post Type classes that [extend Timber](https://timber.github.io/docs/guides/extending-timber/) and provide processed data to views.
* **/includes** - Theme functions, filters, and other helpers that assist in rendering views.
* **/shortcodes** - Theme [shortcodes](https://codex.wordpress.org/Shortcode) available to the admin.
* **/src** - JavaScript and stylesheet source (described below).
* **/views** - View templates are generally organized on a component level and by site feature and include [Twig](https://twig.symfony.com/), [Underscore.js](https://underscorejs.org/#template), and [Vue.js](https://vuejs.org/v2/guide/single-file-components.html) templates.
  * **/components** - Component pattern templates.
  <!-- * **/elements** - Element pattern templates. -->
  <!-- * **/emails** - Email view templates -->
  * **/objects** - Object pattern templates.
  * **/programs** - Programs feature templates.
  * **/jobs** - Jobs feature templates.
  * **/guides** - Guides feature templates.
  * **/utilities** - Misc. view template partials.

## Twig Templates

The theme is built on [Timber](https://www.upstatement.com/timber/) which uses the [Twig Templating Engine](https://twig.symfony.com/). Templates can be edited in the [**/views**](views) directory.

## Functions

The [**functions.php**](functions.php) is a proxy used to require and instantiate dependencies for rendering views only. Any other site configuration such as a filter, hook, or action will be found in the [must use plugins directory](/#must-use-plugins). Functions available to the theme are stored in the [**lib/functions.php**](lib/functions.php) file.

## Path Helpers

Path helpers are shorthand functions that return path strings for including various dependencies within the theme. They are used throughout theme files and generally accept a single string parameter referencing the filename (without extension) of the dependency.

```php
<?php

require_once WorkingNYC\timber_post('programs');
```

* `WorkingNYC\inc` -  Return the path to a file in the **/lib** directory.
* `WorkingNYC\require_includes` - Require all includes from the **/includes**. No arguments required.
* `WorkingNYC\timber_post` -  Return the path to the site or a post type controller from **/timber-posts** directory.
<!-- * `WorkingNYC\block` -  Return the path to a Gutenburg Block from the **/blocks** directory. -->
<!-- * `WorkingNYC\require_blocks` - Require all Gutenburg Blocks. No arguments required. -->
* `WorkingNYC\shortcode` - Return the path to a shortcode in the **/shortcodes** directory.
* `WorkingNYC\require_shortcodes` - Require all shortcodes from the **/shortcodes**. No arguments required.

## Timber Posts

Site and Post Type classes [extend Timber functionality](https://timber.github.io/docs/guides/extending-timber/) and make it easy for providing extra or customized context to different views and even the WordPress REST API. Controllers are based on post types and are included in the theme when rendering posts on the homepage, in an archive, or a single view.

Classes are required using the Timber post path helper (described above):

```php
<?php

require_once WorkingNYC\timber_post('program');
require_once WorkingNYC\timber_post('page');
```

And instantiated (below in a single view):

```php
<?php

$program = new WorkingNYC\Program();

$context = Timber::get_context();

$context['post'] = $program;
```

Instantiated post classes accept either a post object or post ID argument if used outside of their single view context. The following example instantiates a list of alert posts:

```php
<?php

$context['programs'] = array_map(function($post) {
  return new WorkingNYC\Program($post);
}, get_field('programs'));
```

## Assets

### Using NPM

NPM is used to manage the assets in the theme. Install dependencies to get started with modifying the front-end. One of the packages is installed from the GitHub package repository (`@hail2u`) so you will need a personal access token configured for NPM as well as the GitHub package manager in your **.npmrc**. Follow the instructions on the [NPM website](https://docs.npmjs.com/creating-and-viewing-access-tokens#creating-granular-access-tokens-on-the-website) and [GitHub](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) to set up your personal access tokens. Then, add them to your **.npmrc**. Use `git update-index --skip-worktree` to ensure that you don’t commit your keys in .npmrc to git.

Before:

```dotfile
@hail2u:registry=https://npm.pkg.github.com
//registry.npmjs.org/:_authToken={{ NPM Personal Access Token }}
//npm.pkg.github.com/:_authToken={{ GitHub Personal Access Token }}
```

After (dummy access token):

```dotfile
@hail2u:registry=https://npm.pkg.github.com
//registry.npmjs.org/:_authToken=npm_qFeTd1MkP1kfJuqjatXbSuZo30m4Z3IY29TUVYWX
//npm.pkg.github.com/:_authToken=ghp_M3sjMsGthoiGmaIUILa2xgbU4UypbpCtgivDh7g8
```


Once configured, run `npm install`.

<!-- If using NVM, the **.nvmrc** will set the supported Node version for you by running the following command: -->

<!-- ```shell
nvm use
``` -->

```shell
npm install
```

Then run the development server.

```shell
npm start
```

The NPM package comes with additional scripts that can be run via the command.

```shell
npm run {{ script }}
```

Script        | Description
--------------|-
`start`       | Runs the `development` script below then uses concurrently to run the Patterns CLI default command in watch mode.
`development` | This cleans the [./assets](assets) directory, runs the default Patterns CLI command, and the [./bin/rename.js](bin/rename.js) script to build the assets for development.
`production`  | This runs the same same command as development but uses the `NODE_ENV=production` environment variable to build the assets for production.

### Patterns CLI

The [Patterns CLI](https://github.com/CityOfNewYork/patterns-cli/) is the build pack for theme assets. It is the same build pack for the [Working NYC Patterns library](https://github.com/CityOfNewYork/working-nyc-patterns). The main assets the current build back manages are the source JavaScript, source Sass files, and SVG sprite for the site's icons. The CLI has a predefined set of [configurations and commands](https://github.com/CityOfNewYork/patterns-cli/#commands) but is extended with custom [configurations](configuration) and [commands](bin) in this theme.

CLI commands can be run outside of the NPM scripts defined above using NPX ([refer to the documentation](https://github.com/CityOfNewYork/patterns-cli/#executing-the-binary) on other ways to execute the CLI binary).

```shell
npx pttrn {{ command }}
```

#### Custom CLI Configuration

Command   | Description
----------|-
`default` | Sets the default commands the Patterns CLI will use when running `pttrn` or `pttrn -w`
`postcss` | Uses the Working NYC Patterns PostCSS configuration but modifies Tailwindcss to compile in just-in-time mode, reducing the size of the CSS utility output for production.
`rollup`  | Defines the JavaScript modules to be rolled up and plugins to be used.
`sass`    | Defines the CSS stylesheets to be compiled.
`svgs`    | Defines the SVG file directories to source and build into SVG sprites.

#### Custom CLI Commands

Command  | Description
---------|-
`clean`  | Deletes the [./assets](assets) directory for a new build.
`rename` | Renames files defined in the [./config/rename.js](config/rename.js) file. In production mode, it replaces the string `development` with a hash based on the file contents for cache-busting.
`styles` | A custom style command for running Sass and PostCSS on modules defined in the [./config/sass.js](config/sass.js) file.

### JavaScript

The JavaScript is written in ES6 syntax and bundled together using Rollup.js. Source files are located in the theme [./src/js](src/js) directory. Script entry-points are split into the theme template files that depend on them.

Script Name                                                 | PHP Template                                           | Description
------------------------------------------------------------|--------------------------------------------------------|-
[global.js](src/js/global.js)                               |                                                        | Site-wide functionality required for every website view.
[archive.js](src/js/archive.js)                             | [archive.php](archive.php)                             | Functionality required for the /programs archive. The main dependency used is [Vue.js](https://vuejs.org/).
[newsletter.js](src/js/newsletter.js)                       | [template-landing-page.php](template-landing-page.php) | Functionality for the /newsletter view.


Other directories in the [./src/js](src/js) directory are shared modules and dependencies of the main view entry-points.

#### Enqueue

Each asset is enqueued in it's corresponding theme template on the `wp_enqueue_scripts` hook using a custom function that only requires the name of the script.

```php
<?php

add_action('wp_enqueue_scripts', function() {
  enqueue_script('newsletter');
});
```

The `global` script is enqueued in the [./functions.php](functions.php) file.

### SCSS

The theme relies on the [Working NYC Patterns](https://cityofnewyork.github.io/working-nyc-patterns/) for sourcing Stylesheets. Refer to the [documentation](https://cityofnewyork.github.io/working-nyc-patterns/) for details on the different patterns and their usage. The SCSS files are processed, concatenated, and minified by the CLI styles command into one global stylesheet.

#### Enqueue

The `site-default` stylesheet is enqueued in the [./functions.php](functions.php) file on the `wp_enqueue_scripts` hook using a custom function.

### DNS Pre-fetch and Pre-connect

By using `wp_enqueue_scripts` and the custom function for scripts and styles, proper DNS prefetch and preconnect headers are added to the website headers. Some assets need to be added when they are not enqueued through WordPress. These are managed in a `wp_resource_hints` filter in the [./functions.php](functions.php) file.
