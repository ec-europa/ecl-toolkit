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
  planned: {
    label: 'Planned',
    description: 'Do not implement.',
    color: '#FF3333',
  },
  wip: {
    label: 'WIP',
    description: 'Work in progress. Implement with caution.',
    color: '#FF9233',
  },
  ready: {
    label: 'Ready',
    description: 'Ready to implement.',
    color: '#29CC29',
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
