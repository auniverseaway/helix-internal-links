const client = require('request-promise-native');
const base64 = require('js-base64').Base64;

function decodeContent(content) {
    return base64.decode(content);
}

async function main(payload, { logger, request, secrets }) {
    payload.response = payload.response || {};
    const { hlx_sha } = payload.request.params;
    const url = `${secrets.REPO_API_ROOT}repos/${request.params.owner}/${request.params.repo}/git/blobs/${hlx_sha}`;
    
    const options = { uri: url, json: true, headers: { 'User-Agent': 'Request-Promise' } };
    const leaf = await client(options)
        .then((leaf) => {
            return leaf;
        }).catch((err) => {
            console.log('Error: ', err);
        });

    const content = decodeContent(leaf.content);
    payload.response.body = content;

    return {
      response: payload.response
    };
}
module.exports.main = main;