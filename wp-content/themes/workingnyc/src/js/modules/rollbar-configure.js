/* eslint-env browser */
'use strict';

/**
 * Sends a configuration object to Rollbar, the most important config is
 * the code_version which maps to the source maps version.
 *
 * @source https://docs.rollbar.com/docs/rollbarjs-configuration-reference
 */
class RollbarConfigure {
  /**
   * Adds Rollbar configuration to the page if the snippet has been included.
   *
   * @constructor
   */
  constructor() {
    // Get the script version based on the hash value in the file.
    let scripts = document.getElementsByTagName('script');
    let source = scripts[scripts.length - 1].src;
    let path = source.split('/');
    let basename = path[path.length - 1];
    let hash = basename.split(RollbarConfigure.hashDelimeter)[1].replace('.js', '');

    // Copy the default configuration and add the current version number.
    let config = Object.assign({}, RollbarConfigure.config);

    config.payload.client.javascript.code_version = hash;

    window.addEventListener('load', () => {
      // eslint-disable-next-line no-undef
      if (typeof Rollbar === 'undefined') {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.log('Rollbar is not defined.');
        }

        return false;
      }

      // eslint-disable-next-line no-undef
      let rollbarConfigure = Rollbar.configure(config);
      let msg = `Configured Rollbar with '${hash}'`;

      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.log(`${msg}:`);

        // eslint-disable-next-line no-console
        console.dir(rollbarConfigure);

        Rollbar.debug(msg); // eslint-disable-line no-undef
      }
    });
  }
}

/**
 * Rollbar Hash Delimiter
 */
RollbarConfigure.hashDelimeter = '-';

/**
 * @type {Object} The default Rollbar configuration
 */
RollbarConfigure.config = {
  payload: {
    client: {
      javascript: {
        // This is will be true by default if you have enabled this in settings.
        source_map_enabled: true,
        // Optionally guess which frames the error was thrown from when the browser
        // does not provide line and column numbers.
        guess_uncaught_frames: true
      }
    }
  }
};

export default RollbarConfigure;
