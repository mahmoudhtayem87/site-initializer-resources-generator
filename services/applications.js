const config = require('../config');

var digestRequest = require('request-digest')(config.config().liferay.user
  , config.config().liferay.password);

const helper = require('../helper');
const request = require('request');

async function getContentStructureWebDav(structureId) {
  return new Promise(function (resolve, reject) {
    const DigestFetch = require('digest-fetch')
    const client = new DigestFetch(config.config().liferay.user, config.config().liferay.password, { algorithm: 'MD5' })
    client.fetch(`${config.config().liferay.host}/webdav/${config.config().friendlyUrlPath}/journal/Structures/${structureId}`, {})
    .then(res =>
       res.json()
       ).then(data => 
        resolve(data));
  });
}

async function getContentStructures() {
  return new Promise(function (resolve, reject) {
    var options = {
      'method': 'GET',
      'url': `${config.config().liferay.host}/o/headless-delivery/v1.0/sites/${config.config().siteId}/content-structures`,
      'headers': {
        'Authorization': helper.getAuthHeader(config)
      }
    };
    request(options, function (error, response) {
      if (error) {
        reject(error)
      };
      resolve((JSON.parse(response.body)).items);
    });
  });
}
async function getSites() {
  return new Promise(function (resolve, reject) {
    var options = {
      'method': 'GET',
      'url': `${config.config().liferay.host}/o/headless-admin-user/v1.0/my-user-account/sites`,
      'headers': {
        'Authorization': helper.getAuthHeader(config)
      }
    };
    request(options, function (error, response) {
      if (error) {
        reject(error)
      };
      resolve((JSON.parse(response.body)).items);
    });
  });
}

async function getRootDocuments() {
  return new Promise(function (resolve, reject) {
    var options = {
      'method': 'GET',
      'url': `${config.config().liferay.host}/o/headless-delivery/v1.0/sites/${config.config().siteId}/documents?page=0&pageSize=999999`,
      'headers': {
        'Authorization': helper.getAuthHeader(config)
      }
    };
    request(options, function (error, response) {
      if (error) {
        reject(error)
      };
      resolve(JSON.parse(response.body));
    });
  });
}

async function getCommerceCatalogs() {
  return new Promise(function (resolve, reject) {
    var options = {
      'method': 'GET',
      'url': `${config.config().liferay.host}/o/headless-commerce-admin-catalog/v1.0/catalogs?page=0&pageSize=999999`,
      'headers': {
        'Authorization': helper.getAuthHeader(config)
      }
    };
    request(options, function (error, response) {
      if (error) {
        reject(error)
      };
      resolve(JSON.parse(response.body));
    });
  });
}

async function getCommerceChannels() {
  return new Promise(function (resolve, reject) {
    var options = {
      'method': 'GET',
      'url': `${config.config().liferay.host}/o/headless-commerce-admin-channel/v1.0/channels?page=0&pageSize=999999`,
      'headers': {
        'Authorization': helper.getAuthHeader(config)
      }
    };
    request(options, function (error, response) {
      if (error) {
        reject(error)
      };
      resolve(JSON.parse(response.body).items);
    });
  });
}

module.exports = {
  getContentStructures,
  getRootDocuments,
  getSites,
  getContentStructureWebDav,
  getCommerceCatalogs,
  getCommerceChannels
}