var readSource = require('readSource');

module.exports = function (configList) {
  var configs = [];
  var configTemplate = {
    'master': {},
    'source': {},
    'destination': {},
    'twoWay': false
  };

  configList.forEach(function (config) {
    var newConfig = JSON.parse(JSON.stringify(configTemplate));
    var processName = config.process;
    newConfig.processName = processName;
    newConfig.twoWay = config.two_way === true;
    try {
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
