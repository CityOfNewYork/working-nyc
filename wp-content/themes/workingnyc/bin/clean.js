const fs = require('fs');

const alerts = require('@nycopportunity/pttrn/config/alerts');
const cnsl = require('@nycopportunity/pttrn/bin/util/console');

module.exports = {
  run: async () => {
    try {
      if (fs.existsSync('./assets')) {
        await fs.rmSync('./assets/js', {
          recursive: true
        });

        await fs.rmSync('./assets/styles', {
          recursive: true
        });

        await fs.rmSync('./assets/svg', {
          recursive: true
        });

        cnsl.describe(`${alerts.success} Clean ${alerts.str.path('./assets')}`);
      }
    } catch (err) {
      cnsl.error(`Clean (run): ${err.stack}`);
    }
  }
};