var nullToUndefined = require('./nullToUndefined');
var parseConnection = require('./parseConnection');

module.exports = function (source) {
  var newSource;
  var returnSource = {};
  try {
    newSource = JSON.parse(typeof source === 'string' ? source : JSON.stringify(source));
    returnSource.name = newSource.source_name;
    returnSource.connection = parseConnection(newSource.connection);
    returnSource.filter = nullToUndefined(JSON.parse(newSource.filter));
    returnSource.fields = {
      'data': nullToUndefined(newSource.field_data),
      'forced': nullToUndefined(newSource.field_forced),
      'hash': nullToUndefined(newSource.field_hash),
      'lastUpdated': nullToUndefined(newSource.field_last_updated),
      'mapped': nullToUndefined(JSON.parse(newSource.field_mapped)),
      'primaryKey': nullToUndefined(newSource.field_primary_key),
      'removed': nullToUndefined(newSource.field_removed),
      'removedValue': nullToUndefined(newSource.field_removed_value),
      'transforms': nullToUndefined(JSON.parse(newSource.transforms))
    };
    return returnSource;
  } catch (e) {
    throw (e);
  }
};
