# Working NYC

![Image of a person using the Working NYC website with their phone.](product-open-graph.png)

[Working NYC](https://working.nyc.gov) helps New Yorkers connect to the services and resources they need to find a new or better job. The site accommodates NYC residents...

* With low digital literacy
* With limited technology access, especially those who are mobile dependent
* Who do not speak fluent English
* Who have limited visual capabilities

Learn more about Working NYC at [nyc.gov/opportunity](https://www1.nyc.gov/site/opportunity/portfolio/workingnyc.page).

## Tech

Working NYC is a publicly available [WordPress](https://wordpress.org/) site hosted on [WP Engine](https://wpengine.com/). Source code is available in this repository. The [Opportunity Standard](https://nycopportunity.github.io/standard) provides mobile-first stylesheets, fonts, icons, and JavaScript-enhanced components that support WCAG AA compliance, and multi-lingual (right-to-left, and left-to-right) layouts. They are distributed as an NPM Package which can be installed in any project.

## Local Installation

### Requirements

* **Virtualization** ([Docker](https://docs.docker.com/compose/wordpress/), [Vagrant](https://www.vagrantup.com/) + Virtualbox, [Local](https://localwp.com/), or other). The technology team at [NYC Opportunity](https://github.com/NYCOpportunity) uses [Docker for Mac](https://www.docker.com/docker-mac) and the [NYCO WordPress Boilerplate](https://github.com/cityofnewyork/nyco-wp-boilerplate) for running and managing the application locally.

* **Composer**. PHP and WordPress plugin dependencies for WordPress core and the Working NYC theme are managed via Composer. [Learn more about Composer on its website](https://getcomposer.org/).

* **Node and NPM**. The Working NYC Theme uses Node with NPM and the NYC Opportunity Patterns CLI to compile assets for the front-end. Learn more about [Node](https://nodejs.org), [NPM](https://www.npmjs.com/), and the [Patterns CLI](https://github.com/CityOfNewYork/patterns-cli/) at their respective websites. [NVM](https://github.com/nvm-sh/nvm) is a recommended tool for managing versions of Node.

### Installation

This guide covers running the WordPress site without a specific virtualization method. The [NYCO WordPress Boilerplate](https://github.com/cityofnewyork/nyco-wp-boilerplate) is used by the team to manage WordPress sites locally.

**$1** Rename **wp-config-sample.php** to **wp-config.php**. Modify the *MySQL settings*, *Authentication Unique Keys*, *Salts*, and *WordPress debugging mode*. If using the NYCO WordPress Boilerplate, you can use the [**wp-config.php** included in the repository](https://github.com/CityOfNewYork/nyco-wp-boilerplate/blob/main/wp/wp-config.php) but you should still update the salts.

**$2** To get un-tracked composer packages when you install the site you will need to run the following in the root of the WordPress site where the [**composer.json**](composer.json) file lives:

```shell
composer install
```

**$3** This will install plugins included in the Composer package, including **NYCO WordPress Config** (see details in [Configuration](#configuration) below). This plugin includes a sample config that needs to be renamed from **mu-plugins/config/config-sample.yml** to **mu-plugins/config/config.yml**.

## WordPress Site Structure

### Configuration

Working NYC integrates the [NYCO WordPress Config plugin](https://packagist.org/packages/nyco/wp-config) for determining configurations based on the environment. This plugin will pull from an array of variables set in the **mu-plugins/config/config.yml** file and set the appropriate group to environment variables that can be accessed by site functions, templates, and plugins.

### Theme

The theme for the site contains all of the documentation, PHP functions, templates, styling, and scripts for the site front-end and can be found in the [**themes**](wp-content/themes/workingnyc) directory.

### Plugins

WordPress Plugins are managed via Composer and the WordPress Admin. They are tracked by the repository to be easily shipped to different environments. Plugins utilized by the WordPress site can be found in the [**plugins**](wp-content/plugins) directory. Key plugins include [Advanced Custom Fields Pro](https://www.advancedcustomfields.com/pro/), [WordPress Multilingual](https://wpml.org/), and the [Gather Content WordPress Integration](https://wordpress.org/plugins/gathercontent-import/). There are a few ways of managing plugins.

#### WordPress Admin Plugins

Not all plugins can be managed by Composer. Specifically [Advanced Custom Fields Pro](https://www.advancedcustomfields.com/pro/) and [WordPress Multilingual](https://wpml.org/). These plugins must be updated by either downloading from their respective sites and adding directly to the **wp-content/plugins** directory or by logging into the *WordPress Admin* and updating via the **/wp-admin/plugins** page.

#### Must Use Plugins

[Must Use Plugins](https://codex.wordpress.org/Must_Use_Plugins) are used to handle most of the custom configuration for the WordPress site including custom post types, plugin configuration, and special plugins that enable additional functionality for major features of the site. Those can be found in the [**mu-plugins**](wp-content/mu-plugins) directory.

#### Composer Plugins

The [**composer.json**](composer.json) file illustrates which plugins can be managed by Composer. WordPress Plugins can be installed either from [WordPress Packagist](https://wpackagist.org/) or from [Packagist](https://packagist.org/) via the [Composer Libray Installer](https://github.com/composer/installers). Other PHP packages that are not plugins and stored in the **/vendor** directory are tracked by git so they can be deployed with the code. See the [**.gitignore**](.gitignore) file under the "Composer" block.

## Using Composer

* [Installer Paths](#installer-paths)
* [/vendor and git](#vendor-and-git)
* [Autoloader](#autoloader)
* [Requiring Packages](#requiring-packages)
* [Updating packages](#updating-packages)
* [Composer scripts](#composer-scripts)

### Installer Paths

Composer will install packages in one of three directory locations on the site depending on the type of package it is.

* **/vendor** - By default, Composer will install packages here. These may include helper libraries or SDKs used for PHP programming.

Packages that have the [Composer Library Installer](https://github.com/composer/installers) included as a dependency can reroute their installation to directories alternative to the **./vendor** directory. This is to support different PHP-based application frameworks. For WordPress, there are four possible directories ([see the Composer Library Installer documentation for details](https://github.com/composer/installers#current-supported-package-types)), however, for this site, most packages are installed the two following directories:

* **/wp-content/plugins** - Packages that are WordPress plugins are installed in the WordPress plugin directory.
* **wp-content/mu-plugins** - Packages that are Must Use WordPress plugins are installed in the Must Use plugin directory.

### /vendor and git

Normally, **/vendor** packages wouldn't be checked into version control. They are installed on the server level in each environment. However, this site is deployed to WP Engine which does not support Composer so the packages need to be checked in and deployed to the site using git. By default **/vendor** packages are not tracked by the repository. If a composer package is required by production it needs to be included in the repository so it can be deployed to WP Engine. The [**.gitignore**](.gitignore) manually includes tracked repositories using the `!` prefix. This does not apply to WordPress plugins.

```
# Composer #
############
/vendor/*             # Exclude all /vendor packages
!/vendor/autoload.php # Include the autoloader
!/vendor/altorouter   # etc.
...
```

### Autoloader

The [autoloader](https://getcomposer.org/doc/01-basic-usage.md#autoloading) is what includes PHP package files in the application. It works by requiring package PHP files when the class names they include are invoked. The autoloader needs to be required in every application before Composer packages can be run. The site requires the autoloader in [wp-content/mu-plugins/config/default.php](wp-content/mu-plugins/config/default.php). This only applies to packages in the **/vendor** directory. WordPress Plugins and Must Use Plugins are not autoloaded.

```php
<?php

require_once ABSPATH . '/vendor/autoload.php';
```

#### Development build

Different types of autoloaders can be [generated](https://getcomposer.org/doc/03-cli.md#dump-autoload-dumpautoload-). The [**composer.json**](composer.json) includes scripts that will generate a "development" autoloader that requires packages defined in the `require` and `require-dev` json blocks (including [whoops](https://filp.github.io/whoops/)).

```shell
composer run development
```

#### Production build

The "production" autoloader will only require packages in the `require` JSON block. **Once you are done developing and before deployment, regenerate the production autoloader which will prevent development dependencies from being required**.

```shell
composer run production
```

### Requiring Packages

The command to install new packages is `composer require`. See the [Composer docs for more details on the CLI](https://getcomposer.org/doc/03-cli.md#require). Packages can be installed from [Packagist](https://packagist.org/) or [WordPress Packagist](https://wpackagist.org/). To require a package run:

```shell
composer require {{ vendor }}/{{ package }}:{{ version constraint }}
```

For example:

```shell
composer require timber/timber:^1.18
```

... will require the **Timber** package and install the latest minor version, greater than `1.18` and less than `2.0.0`. The caret designates the version range. Version constraints can be read about in more detail in the [Composer documentation](https://getcomposer.org/doc/articles/versions.md).

### Updating Packages

The command to update packages is [`composer update`](https://getcomposer.org/doc/03-cli.md#update-u). Running it will install packages based on their version constraint in the [**composer.json**](composer.json) file. Individual packages can be updated by specifying the package name.

```shell
composer update {{ vendor }}/{{ package }}
```

For example:

```shell
composer update timber/timber
```

### Composer scripts

The Composer package includes scripts that can be run via the command:

```shell
composer run {{ script }}
```

Script        | Description
--------------|-
`development` | Rebuilds the autoloader including development dependencies.
`production`  | Rebuilds the autoloader omitting development dependencies.
`predeploy`   | Rebuilds the autoloader using the `production` script then runs [PHP Code Sniffer](https://github.com/squizlabs/PHP_CodeSniffer) using the `lint` script (described below).
`lint`        | Runs PHP Code Sniffer which will display violations of the standard defined in the [phpcs.xml](phpcs.xml) file.
`fix`         | Runs PHP Code Sniffer in fix mode which will attempt to fix violations automatically. It is not necessarily recommended to run this on large scripts because if it fails it will leave a script partially formatted and malformed.
`version`     | Regenerates the **composer.lock** file and rebuilds the autoloader for production.
`deps`        | This is a shorthand for `composer show --tree` for illustrating package dependencies.

## Git Hooks

Before contributing, configure git hooks to use the repository's hooks.

```shell
git config core.hooksPath .githooks
```

Hook       | Description
-----------|-
`pre-push` | Runs the Composer `predeploy` script. See [composer scripts](#composer-scripts).

## Coding Style

### PHP

PHP is linted using [PHP Code Sniffer](https://github.com/squizlabs/PHP_CodeSniffer) with the [PSR-2 standard](https://www.php-fig.org/psr/psr-2/). The configuration can be found in the [phpcs.xml](phpcs.xml). Linting must be done manually using the command:

```shell
composer run lint
```

PHP Code Sniffer can attempt to fix violations. Run the following command in a clean git directory. Occasionally, with multiple files and large scripts it can fail and leave malformed PHP files.

```shell
composer run fix
```

## Security

The team [@NYCOpportunity](https://github.com/NYCOpportunity) actively maintains and releases updates to the site to ensure security using a combination of practices for WordPress. The [NYCO WordPress Boilerplate README file](https://github.com/cityofnewyork/nyco-wp-boilerplate) documents some of these tools and best practices.

### Reporting a Vulnerability

Please report any vulnerabilities confidentially using the [GitHub Security Advisories Feature](/security/advisories).

---

<p><img src="nyco-civic-tech.blue.svg" width="300" alt="The Mayor's Office for Economic Opportunity Civic Tech"></p>

Working NYC is maintained by the [New York City Mayor's Office for Economic Opportunity](http://nyc.gov/opportunity) (NYC Opportunity). We are committed to sharing open source software that we use in our products. Feel free to ask questions and share feedback. Follow @nycopportunity on [Github](https://github.com/orgs/CityOfNewYork/teams/nycopportunity), [Twitter](https://twitter.com/nycopportunity), [Facebook](https://www.facebook.com/NYCOpportunity/), and [Instagram](https://www.instagram.com/nycopportunity/).
