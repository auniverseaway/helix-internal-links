const client = require('request-promise-native');

const hiddenFiles = [ 
    'src',
    'package-lock.json',
    'package.json',
    'spa',
    'config.yml',
    'helix-config.yaml',
    'LICENSE',
    'admin.md',
    'webpack.config.js'];

function isHiddenOrSrc(str) {
    return str.substr(0, 1) === '.' || hiddenFiles.indexOf(str) > -1;
}

function isTree(file) {
    return file.type === 'tree';
}

function formatTree(tree, label, parent) {
    let url = '/';
    if (parent) {
        url += `${parent}/`;
    }
    if (label) {
        url += `${label}/`;
    }
    return tree.reduce((filtered, file) => {
        if (!isHiddenOrSrc(file.path)) {
            const displayFile = { 
                label: file.path,
                sha: file.sha,
                url: `${url}${file.path}`,
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
    const { sha } = payload.request.params;
    const { label } = payload.request.params;
    const { parent } = payload.request.params;
    const ref = sha || request.params.ref;
    const url = `${secrets.REPO_API_ROOT}repos/${request.params.owner}/${request.params.repo}/git/trees/${ref}`;

    const options = { uri: url, json: true, headers: { 'User-Agent': 'Request-Promise' } };
    const files = await client(options)
        .then((files) => {
            return files;
        })
        .catch((err) => {
            console.log('Error: ', err);
        });

    payload.response.body = formatTree(files.tree, label, parent);
  
    return {
      response: payload.response
    };
}
module.exports.main = main;