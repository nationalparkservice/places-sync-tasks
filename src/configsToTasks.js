var sync = require('places-sync');

module.exports = function (configs, connection, updateSql) {
  var returnArray = [];
  configs.forEach(function (config) {
    returnArray.push({
      'name': 'Sync ' + config.processName,
      'description': 'Syncing source: ' + config.source.name + ' to ' + config.destination.name,
      'task': sync,
      'params': [config.master, config.source, config.destination, config.twoWay]
    });
    returnArray.push({
      'name': 'Update Status ' + config.processName,
      'description': 'Updates the last_sync field',
      'task': connection.query,
      'params': [updateSql, config]
    });
  });
  return returnArray;
};
