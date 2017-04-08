# Contributing

*Heavily inspired by [Contributing to Create React App](https://github.com/facebookincubator/create-react-app/blob/master/CONTRIBUTING.md).*

## Cutting a Release

1.  Tag all merged pull requests that go into the release with the relevant 
milestone.  Each merged PR should also be labeled with one of the [labels](https://github.com/ec-europa/ecl-toolkit/labels) named `tag: ...` to 
indicate what kind of change it is.

2.  Close the milestone.

3.  Create a change log entry for the release:

    *   You'll need an [access token for the GitHub API](https://help.github.com/articles/creating-an-access-token-for-command-line-use/).  
    Save it to this environment variable: `export GITHUB_AUTH="..."`

    *   Run `npm run changelog`.  The command will find all the labeled pull 
    requests merged since the last release and group them by the label and 
    affected packages, and create a change log entry with all the changes and 
    links to PRs and their authors.  Copy and paste it to `CHANGELOG.md`.

    *   Add a four-space indented paragraph after each non-trivial list item, 
    explaining what changed and why.  For each breaking change also write who 
    it affects and instructions for migrating existing code.

    *   Maybe add some newlines here and there.  Preview the result on GitHub to 
    get a feel for it.  Changelog generator output is a bit too terse for my 
    taste, so try to make it visually pleasing and well grouped.

4.  Make sure to include “Migrating from ...” instructions for the previous 
release. Often you can copy and paste them.

7.  After merging the changelog update, create a GitHub Release with the same 
text. See previous Releases for inspiration.

8.  **Do not run `npm publish`.  Instead, run `npm run publish`.**

9.  Wait for a long time, and it will get published.  Don’t worry that it’s 
stuck. In the end the publish script will prompt for versions before publishing the packages.

Make sure to test the released version! If you want to be extra careful, you 
can publish a prerelease by running `npm run publish -- --tag next` instead of 
`npm run publish`.

------------

*Many thanks to [h5bp](https://github.com/h5bp/html5-boilerplate/blob/master/CONTRIBUTING.md) for the inspiration with this contributing guide*
