const fetch = require('node-fetch');
const base64 = require('js-base64').Base64;

function decodeContent(content) {
    return base64.decode(content);
}

async function main(payload, { logger, request, secrets }) {
    payload.response = payload.response || {};
    const { sha } = payload.request.params;

    const url = `${secrets.REPO_API_ROOT}repos/${request.params.owner}/${request.params.repo}/git/blobs/${sha}`;
    const leaf = await (await (fetch(url)
      .then(res => {
        return res.json();
      })
      .catch(err => {
        console.log('Error: ', err);
      })
    ));

    const content = decodeContent(leaf.content);
    payload.response.body = content;

    return {
      response: payload.response
    };
}
module.exports.main = main;