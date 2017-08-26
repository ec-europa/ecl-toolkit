// Dependencies
const $ = global.jQuery;

// Constants
const github = `https://api.github.com`;
const ecl = `ec-europa/europa-component-library`;

// Helpers
const getCurrentPath = () => window.location.pathname;
const getPathSegments = path => path.split('/').filter(item => item.length);
// Small wrapper to manage update link attributes.
const setHref = target => {
  const updateButton = $('#update-docs');
  updateButton.attr('target', '_blank');
  updateButton.attr('href', target);
};
// Best guess where the markdown file is on github.
const setGithubLocation = pathSegments => {
  // Fractal-specific located documentation pages.
  if (pathSegments[0] === 'docs') {
    if (pathSegments.length == 1) {
      // If it's the docs overview page:
      setHref(`https://github.com/${ecl}/blob/master/docs/README.md`);
    } else if (pathSegments.length > 1) {
      $.get(`${github}/repos/${ecl}/contents/docs`, data => {
        data.forEach(file => {
          // if the repo has a file containing the name of the page
          if (file.name.indexOf(pathSegments[1]) !== -1) {
            setHref(file.html_url);
          }
        });
      });
    }
  }
  // Components documentations
  if (pathSegments[0] === 'components') {
    if (pathSegments.length == 1) {
      // Components overview text is in code, so just search it in the repo.
      // Since there's no point in getting the hash each time from the api.
      setHref(`https://github.com/${ecl}`);
    } else if (pathSegments.length > 1) {
      // Split off the modifier part and get the name of the component.
      const component = pathSegments[pathSegments.length - 1].split('--');
      const pkg = component[0];
      // Fine the location of the component.
      $.get(
        `${github}/search/code?q=${pkg}+in:file+language:json+repo:${ecl}`,
        data => {
          if (data.items !== undefined && data.items.length) {
            // Wild guess/hope that the search found the package.json of the right component.
            let componentPath = data.items[0].path.split('/');
            componentPath.splice(componentPath.length - 1, 1);
            componentPath = componentPath.join('/');
            setHref(
              `https://github.com/${ecl}/blob/master/${componentPath}/README.md`
            );
          }
        }
      );
    }
  }
  // For any other changes, just open the github repo.
  if (pathSegments[0] !== 'docs' && pathSegments !== 'components') {
    setHref(`https://github.com/${ecl}`);
  }
};

const updateButton = () => {
  const path = getCurrentPath();
  const pathSegments = getPathSegments(path);
  // On prod, the first segment is not to be taken into account.
  if (pathSegments[0] === 'europa-component-library') {
    pathSegments.shift();
  }
  // Guess location of files only when they are in specific places that we know.
  if (pathSegments !== undefined && pathSegments.length > 0) {
    if (pathSegments[0] === 'docs' || pathSegments[0] === 'components') {
      setGithubLocation(pathSegments);
    }
  }
};

module.exports = updateButton;
