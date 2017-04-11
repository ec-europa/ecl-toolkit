// Check selectors against BEM syntax
function bemSelector(block) {
  const ns = 'ecl-';
  const WORD = '[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*';
  const element = '(?:__' + WORD + ')?';
  const modifier = '(?:--' + WORD + '){0,2}';
  const attribute = '(?:\\[.+\\])?';
  return new RegExp('^\\.' + ns + block + element + modifier + attribute + '$');
}

module.exports = {
  extends: [
    'stylelint-config-sass-guidelines',
    'stylelint-config-standard',
  ],
  plugins: ['stylelint-selector-bem-pattern'],
  rules: {
    'plugin/selector-bem-pattern': {
      componentName: /^[a-z][-a-zA-Z0-9]+$/,
      componentSelectors: bemSelector,
    },
    'selector-class-pattern': null,
  },
};
