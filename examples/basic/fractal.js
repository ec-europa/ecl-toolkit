const path = require('path');
const fractal = require('@frctl/fractal').create(); // eslint-disable-line import/no-extraneous-dependencies
const eclTheme = require('@ec-europa/ecl-fractal-theme'); // eslint-disable-line import/no-extraneous-dependencies

const paths = {
  build: `${__dirname}/dist`,
  static: `${__dirname}/static`,
};

// Create a new theme instance with custom config options
const theme = eclTheme({ skin: 'blue' });

// Project config
fractal.set('project.title', 'ECL Toolkit Example');
fractal.set('project.url', '/');
fractal.set(
  'project.repo',
  'https://github.com/ec-europa/ecl-toolkit/tree/master/examples/basic'
);

// Components config
fractal.components.set('label', 'library');
fractal.components.set('default.preview', '@preview');
fractal.components.set('statuses', {
  ready: {
    label: 'Ready',
    description: 'Can be used in production.',
    color: '#29CC29',
  },
  planned: {
    label: 'Planned',
    description: 'Still under discussion.',
    color: '#337ab7',
  },
  wip: {
    label: 'WIP',
    description: 'Work in progress. Implement with caution.',
    color: '#fbca04',
  },
  legacy: {
    label: 'Legacy',
    description: 'Not to be used on new applications. Kept temporarily.',
    color: '#FF9233',
  },
  broken: {
    label: 'Broken',
    description: 'Cannot be used.',
    color: '#FF3333',
  },
});
fractal.components.set('default.status', 'planned');
fractal.components.set('path', path.resolve(__dirname, './framework'));
fractal.components.engine('@frctl/twig'); // use Twig for components
fractal.components.set('ext', '.twig');

// 'Assets' tab
fractal.components.set('resources.assets', {
  label: 'Code',
  match: '**/*.{js,scss}',
});

// Docs config
fractal.docs.set('path', path.resolve(__dirname, 'docs'));

// Web UI config
fractal.web.theme(theme);
fractal.web.set('static.path', paths.static);
fractal.web.set('builder.dest', paths.build);
fractal.web.set('builder.urls.ext', null);

// Export config
module.exports = fractal;
