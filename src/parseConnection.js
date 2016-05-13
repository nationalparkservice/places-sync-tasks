// Takes a source config and adds the secrets
var fs = require('fs');
var path = require('path');
var secretsDir = path.join(__dirname, '../secrets');

module.exports = function (config) {
  var newConfig = {};

  // Parse the config to JSON (and copy it)
  try {
    newConfig = JSON.parse(typeof config === 'string' ? config : JSON.stringify(config));
  } catch (e) {
    throw e;
  }

  var hasSecrets = new RegExp('^file:///?{{secrets}}/?', 'i');
  var fileName;
  for (var field in newConfig) {
    if (newConfig[field].match(hasSecrets)) {
      fileName = newConfig[field].replace(hasSecrets, '');
      newConfig[field] = fs.readFileSync(path.join(secretsDir, fileName)).toString().replace(/\n$/, '');
    }
  }

  return newConfig;
};
