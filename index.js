var buildConnection = require('./src/buildConnection');
var cartodbConnection = require('./cartoDbConnection');
var configsToTasks = require('./src/configsToTasks');
var databases = require('./node_modules/places-sync/node_modules/places-sync-sources/node_modules/places-sync-databases/'); // TODO: Add this to the package instead
var fs = require('fs');
var iterateTasksLight = require('jm-tools').iterateTasksLight;
var parseConnection = require('./src/parseConnection');
var path = require('path');
var updateProcessStatusSql = fs.readFileSync(path.join(__dirname, 'sql', 'updateProcessStatus.sql'), 'UTF8').toString();
var write = require('./src/writeResults');
var getTasksSql = fs.readFileSync(path.join(__dirname, 'sql', 'getTasks.sql'), 'UTF8').toString();

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
  'params': [getTasksSql]
}, {
  'name': 'parsedConfigs',
  'description': 'Created Config files for all the valid tasks',
  'task': buildConnection,
  'params': ['{{taskList}}']
}, {
  'name': 'syncTasks',
  'description': 'creates each of the sync tasks',
  'task': configsToTasks,
  'params': ['{{parsedConfigs}}', '{{createDbConnection}}', updateProcessStatusSql]
}, {
  'name': 'runSyncs',
  'description': 'runs each of the sync tasks',
  'task': iterateTasksLight,
  'params': ['{{syncTasks}}', 'Run Syncs']
}];

iterateTasksLight(taskList, 'Load Tasks')
  .then(write.success)
  .catch(write.failure);
