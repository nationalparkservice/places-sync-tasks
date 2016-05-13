var iterateTapeTasks = require('../node_modules/places-sync/src/tools/iterateTapeTasks');
var requireDirectory = require('../node_modules/places-sync/src/tools/requireDirectory');

var tests = requireDirectory('./', 'index.js');
var mainTaskList = [];

for (var test in tests) {
  tests[test].forEach(function (test) {
    mainTaskList.push(test);
  });
}

iterateTapeTasks(mainTaskList, true, true, true).then(function (results) {
  console.log('main tests done ');
}).catch(function (e) {
  if (e === undefined) {
    e = new Error('undefined error ');
  }
  console.log('main test error ');
  throw e;
});
