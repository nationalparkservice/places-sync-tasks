var iterateTasksLight = require('../src/iterateTasksLight');
var Promise = require('bluebird');

var sampleTask = function (value) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      console.log('Ran value:' + value);
      resolve();
    }, 100);
  });
};

var tasks = [];
for (var i = 0; i < 200; i += 1) {
  tasks.push({
    'name': 'Task ' + i,
    'task': sampleTask,
    'params': [i]
  });
}

module.exports = [{
  'name': 'Test Config',
  'description': 'Loads the test config and makes sure it parses it correctly',
  'task': iterateTasksLight,
  'params': [tasks],
  'operator': 'equal',
  'expected': undefined
}];
