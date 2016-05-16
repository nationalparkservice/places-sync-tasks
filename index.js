var buildConfig = require('./src/buildConfig');
var cartodbConnection = require('./cartoDbConnection');
var configsToTasks = require('./src/configsToTasks');
var databases = require('./node_modules/places-sync/node_modules/places-sync-sources/node_modules/places-sync-databases/'); // TODO: Add this to the package instead
var fs = require('fs');
var iterateTasks = require('jm-tools').iterateTasks;
var parseConnection = require('./src/parseConnection');
var path = require('path');
var write = require('./src/writeResults');
var sql = fs.readFileSync(path.join(__dirname, 'sql', 'taskQuery.sql'), 'UTF8').toString();

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
