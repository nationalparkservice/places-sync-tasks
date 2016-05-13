var cartodbConnection = require('./cartoDbConnection');
var databases = require('./node_modules/places-sync/src/databases');
var parseConnection = require('./src/parseConnection');
var sync = require('places-sync');
var iterateTasks = require('./node_modules/places-sync/src/tools/iterateTasks');
var write = require('./src/writeResults');
var path = require('path');
var fs = require('fs');

var sql = fs.readFileSync(path.join(__dirname, 'sql', 'taskQuery.sql'), 'UTF8').toString();

var cleanField = function (field) {
  return field !== null ? field : undefined;
};

var readSource = function (source) {
  var newSource;
  var returnSource = {};
  try {
    newSource = JSON.parse(typeof source === 'string' ? source : JSON.stringify(source));
    returnSource.name = newSource.source_name;
    returnSource.connection = parseConnection(newSource.connection);
    returnSource.fields = {
      'data': cleanField(newSource.field_data),
      'forced': cleanField(newSource.field_forced),
      'hash': cleanField(newSource.field_hash),
      'lastUpdated': cleanField(newSource.field_last_updated),
      'mapped': cleanField(JSON.parse(newSource.field_mapped)),
      'primaryKey': cleanField(newSource.field_primary_key),
      'removed': cleanField(newSource.field_removed),
      'removedValue': cleanField(newSource.field_removed_value),
      'transforms': cleanField(JSON.parse(newSource.transforms))
    };
    return returnSource;
  } catch (e) {
    throw (e);
  }
};

var buildConfig = function (configList) {
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

var configsToTasks = function (configs) {
  return configs.map(function (config) {
    return {
      'name': 'Sync ' + config.processName,
      'description': 'Syncing source: ' + config.source.name + ' to ' + config.destination.name,
      'task': sync,
      'params': [config.master, config.source, config.destination, config.twoWay]
    };
  });
};

var taskList = [{
  'name': 'createDbConnection',
  'description': 'Connects to the CartoDB Database',
  'task': databases,
  'params': [{
    'type': 'cartodb',
    'connection': parseConnection(cartodbConnection)
  }]
}, {
  'name': 'taskList',
  'description': 'Read the tasks that need to be run from cartodb',
  'task': '{{createDbConnection.query}}',
  'params': [sql]
}, {
  'name': 'parsedConfigs',
  'description': 'Created Config files for all the valid tasks',
  'task': buildConfig,
  'params': ['{{taskList}}']
}, {
  'name': 'syncTasks',
  'description': 'creates each of the sync tasks',
  'task': configsToTasks,
  'params': ['{{parsedConfigs}}']
}, {
  'name': 'runSyncs',
  'description': 'runs each of the sync tasks',
  'task': iterateTasks,
  'params': ['{{syncTasks}}', 'Run Syncs']
}];

iterateTasks(taskList, 'Load Tasks')
  .then(write.success)
  .catch(write.failure);
