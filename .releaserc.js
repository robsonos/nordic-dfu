const releaseNotesGeneratorOptions = {
  writerOpts: {
    transform: (commit, context) => {
      const issues = [];

      if (commit.type === 'breaking') {
        commit.type = 'Breaking :boom:';
      } else if (commit.type === 'feat') {
        commit.type = 'Features :sparkles:';
      } else if (commit.type === 'fix') {
        commit.type = 'Bug Fixes :bug:';
      } else if (commit.type === 'refactor') {
        commit.type = 'Code Refactoring :hammer:';
      } else if (commit.type === 'config') {
        commit.type = 'Config :wrench:';
      } else if (commit.type === 'test') {
        commit.type = 'Tests :rotating_light:';
      } else if (commit.type === 'docs') {
        commit.type = 'Documentation :books:';
      } else if (commit.type === 'no-release') {
        return;
      }
      if (typeof commit.hash === 'string') {
        commit.shortHash = commit.hash.substring(0, 7);
      }

      if (typeof commit.subject === 'string') {
        let url = context.repository ? `${context.host}/${context.owner}/${context.repository}` : context.repoUrl;
        if (url) {
          url = `${url}/issues/`;
          // Issue URLs.
          commit.subject = commit.subject.replace(/#([0-9]+)/g, (_, issue) => {
            issues.push(issue);
            return `[#${issue}](${url}${issue})`;
          });
        }
        if (context.host) {
          // User URLs.
          commit.subject = commit.subject.replace(/\B@([a-z0-9](?:-?[a-z0-9/]){0,38})/g, (_, username) => {
            if (username.includes('/')) {
              return `@${username}`;
            }

            return `[@${username}](${context.host}/${username})`;
          });
        }
      }

      // remove references that already appear in the subject
      commit.references = commit.references.filter((reference) => {
        if (issues.indexOf(reference.issue) === -1) {
          return true;
        }

        return false;
      });

      return commit;
    },
  },
};

module.exports = {
  branches: ['main'],
  plugins: [
    '@semantic-release/commit-analyzer',
    ['@semantic-release/release-notes-generator', releaseNotesGeneratorOptions],
    [
      '@semantic-release/changelog',
      {
        changelogFile: 'CHANGELOG.md',
      },
    ],
    '@semantic-release/npm',
    [
      '@semantic-release/git',
      {
        assets: ['package.json', 'package-lock.lock', 'CHANGELOG.md'],
        message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
    '@semantic-release/github',
  ],
};
