const client = require('request-promise-native');

const hiddenFiles = [ 
    'src',
    'favicon.ico',
    'package-lock.json',
    'package.json',
    'client',
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

function formatTree(tree, targetUrl) {
    if (targetUrl === '/') {
        targetUrl = '';
    }
    return tree.reduce((filtered, file) => {
        if (!isHiddenOrSrc(file.path)) {
            const displayFile = { 
                label: file.path,
                sha: file.sha,
                targetUrl: `${targetUrl}/${file.path}`,
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
    const { hlx_sha, hlx_targetUrl } = payload.request.params;
    const ref = hlx_sha || request.params.ref;
    const url = `${secrets.REPO_API_ROOT}repos/${request.params.owner}/${request.params.repo}/git/trees/${ref}`;

    const options = { uri: url, json: true, headers: { 'User-Agent': 'Request-Promise' } };
    const files = await client(options)
        .then((files) => {
            return files;
        })
        .catch((err) => {
            console.log('Error: ', err);
        });
    
    payload.response.body = formatTree(files.tree, hlx_targetUrl);

    return {
      response: payload.response
    };
}
module.exports.main = main;