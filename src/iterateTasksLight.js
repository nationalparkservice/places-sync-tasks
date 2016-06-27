var Promise = require('bluebird');
var iterateTasks = require('jm-tools').iterateTasks;

var iterateTasksLight = module.exports = function (list, taskName, verbose, errorArray) {
  return new Promise(function (resolve, reject) {
    if (list.length) {
      iterateTasks([list[0]], taskName, verbose, errorArray).then(function () {
        return iterateTasksLight(list.slice(1), taskName, verbose, errorArray);
      }).then(function () {
        resolve();
      }).catch(function (e) {
        console.log('ERROR, ', e);
        reject(e);
      });
    } else {
      resolve();
    }
  });
};
