var sync = require('places-sync');

module.exports = function (configs) {
  return configs.map(function (config) {
    return {
      'name': 'Sync ' + config.processName,
      'description': 'Syncing source: ' + config.source.name + ' to ' + config.destination.name,
      'task': sync,
      'params': [config.master, config.source, config.destination, config.twoWay]
    };
  });
};
