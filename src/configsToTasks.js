var sync = require('places-sync');

var syncWrap = function (config, connection, updateSql, updateErrorSql) {
  console.log(updateSql);
  return sync(config.master, config.source, config.destination, config.options).then(function () {
    return connection.query(updateSql, config);
  }).catch(function (e) {
    config.errorMessage = e.message;
    console.log('Error with ' + config.processName + '\n' + e.message);
    return connection.query(updateErrorSql, config);
  });
};

module.exports = function (configs, connection, updateSql, updateErrorSql) {
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
      'task': syncWrap,
      'params': [config, connection, updateSql, updateErrorSql]
    });
  // returnArray.push({
  //   'name': 'Sync ' + config.processName,
  //   'description': 'Syncing source: ' + config.source.name + ' to ' + config.destination.name,
  //   'task': sync,
  //   'params': [config.master, config.source, config.destination, config.options]
  // })
  // returnArray.push({
  //   'name': 'Update Status ' + config.processName,
  //   'description': 'Updates the last_sync field',
  //   'task': connection.query,
  //   'params': [updateSql, config]
  // })
  });
  return returnArray;
};
