const axios = require('axios');
const config = require('../config.js');

let getReposByUsername = (username) => {
  // TODO - Use the axios module to request repos for a specific
  // user from the github API
  // The options object has been provided to help you out,
  // but you'll have to fill in the URL
  const ENDPOINT = 'https://api.github.com/users';
  let options = {
    url: `${ENDPOINT}/${username}/repos`,
    headers: {
      'User-Agent': 'request',
      Authorization: `token ${config.TOKEN}`,
    },
  };

  return axios(options).catch((err) => {
    console.error('Failed to fetch repo of ', username, err);
  });
};

module.exports.getReposByUsername = getReposByUsername;
