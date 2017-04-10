#!/usr/bin/env node

const path = require('path');
const program = require('commander');
const buildScript = require('../scripts/scripts');
const buildStyles = require('../scripts/styles');
const copyFiles = require('../scripts/copy');

const loadConfig = (configFile) => {
  const conf = configFile || 'ecl-builder.config.js';
  return require(path.resolve(process.cwd(), conf)); // eslint-disable-line
};

program
  .version('0.0.1')
  .option('-c, --config [config_file]', 'Config file (default: ecl-builder.config.js)');

program
  .command('scripts')
  .description('compile JS')
  .action((options) => {
    const config = loadConfig(options.config_file);
    config.scripts.forEach(conf => buildScript(conf.entry, conf.dest, conf.options));
  });

program
  .command('styles')
  .description('compile SCSS to CSS')
  .action((options) => {
    const config = loadConfig(options.config_file);
    config.styles.forEach(conf => buildStyles(conf.entry, conf.dest, conf.options));
  });

program
  .command('copy')
  .description('copy static files')
  .action((options) => {
    const config = loadConfig(options.config_file);
    config.copy.forEach(conf => copyFiles(conf.from, conf.to));
  });

program.parse(process.argv);
