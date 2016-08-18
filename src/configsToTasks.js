var sync = require('places-sync');

module.exports = function (configs, connection, updateSql) {
  var returnArray = [];
  configs.forEach(function (config) {
    returnArray.push({
      'name': 'Report Sync ' + config.processName,
      'description': 'Syncing source: ' + config.source.name + ' to ' + config.destination.name,
      'task': console.log,
      'params': ['Syncing source: ' + config.source.name + ' to ' + config.destination.name]
    });
    returnArray.push({
      'name': 'Sync ' + config.processName,
      'description': 'Syncing source: ' + config.source.name + ' to ' + config.destination.name,
      'task': sync,
      'params': [config.master, config.source, config.destination, config.options]
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
