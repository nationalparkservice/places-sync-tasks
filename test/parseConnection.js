var parseConnection = require('../src/parseConnection');

var testConfig = {
  'type': 'cartodb',
  'account': 'file://{{secrets}}/testAccount',
  'apiKey': 'file://{{secrets}}/testApiKey',
  'tableName': 'tableName'
};
var expectedConfig = {
  'type': 'cartodb',
  'account': 'TEST_ACCOUNT',
  'apiKey': 'TEST_API_KEY',
  'tableName': 'tableName'
};

module.exports = [{
  'name': 'Test Config',
  'description': 'Loads the test config and makes sure it parses it correctly',
  'task': parseConnection,
  'params': [testConfig],
  'operator': 'deepEqual',
  'expected': expectedConfig
}];
