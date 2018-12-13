const fetch = require('node-fetch');

const hiddenFiles = [ 
    'src',
    'package-lock.json',
    'package.json',
    'spa',
    'config.yml',
    'LICENSE',
    'admin.md',
    'webpack.config.js'];

function isHiddenOrSrc(str) {
    return str.substr(0, 1) === '.' || hiddenFiles.indexOf(str) > -1;
}

function isTree(file) {
    return file.type === 'tree';
}

function formatTree(tree) {
    return tree.reduce(function(filtered, file) {
        if (!isHiddenOrSrc(file.path)) {
            const displayFile = { 
                label: file.path,
                sha: file.sha,
                url: file.url
            };
            if (isTree(file)) {
                displayFile.children = [];
            }
            filtered.push(displayFile);
        }
        return filtered;
    }, []);
}

async function main(payload, { logger, request, secrets }) {
    payload.response = payload.response || {};
    const sha = request.headers['x-helix-git-tree'];
    const url = `${secrets.REPO_API_ROOT}repos/${request.params.owner}/${request.params.repo}/git/trees/${sha}`;
    const files = await (await (fetch(url)
      .then(res => {
        return res.json();
      })
      .catch(err => {
        console.log('Error: ', err)
      })
    ));

    payload.response.body = formatTree(files.tree);
  
    return {
      response: payload.response
    };
}
module.exports.main = main;