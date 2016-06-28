var readSource = require('./readSource');

module.exports = function (configList) {
  var configs = [];
  var configTemplate = {
    'master': {},
    'source': {},
    'destination': {},
    'options': false
  };

  configList.forEach(function (config) {
    var newConfig = JSON.parse(JSON.stringify(configTemplate));
    var processName = config.name;
    newConfig.processName = processName;
    try {
      newConfig.options = config.options ? JSON.parse(config.options) : false;
      newConfig.source = readSource(config.source);
      newConfig.source.connection.processName = processName;
      newConfig.destination = readSource(config.destination);
      newConfig.destination.connection.processName = processName;
      newConfig.master = readSource(config.master);
      configs.push(newConfig);
    } catch (e) {
      throw e;
    }
  });

  return configs;
};
