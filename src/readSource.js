var nullToUndefined = require('./nullToUndefined');
var parseConnection = require('./parseConnection');

var parseJson = function (str) {
  var returnValue = str;
  var regex = new RegExp('^[[{].+?(]|})$', 'gm');
  if (typeof str === 'string' && str.match(regex)) {
    // We have a string in brackets!
    try {
      returnValue = JSON.parse(str);
    } catch (e) {
      returnValue = str;
    }
  }
  return returnValue;
};

module.exports = function (source) {
  var newSource;
  var returnSource = {};
  try {
    newSource = JSON.parse(typeof source === 'string' ? source : JSON.stringify(source));
    returnSource.name = newSource.source_name;
    returnSource.connection = parseConnection(newSource.connection);
    returnSource.filter = nullToUndefined(JSON.parse(newSource.filter));
    returnSource.translation = nullToUndefined(newSource.osm_translation);
    returnSource.fields = {
      'data': nullToUndefined(newSource.field_data),
      'forced': nullToUndefined(newSource.field_forced),
      'hash': nullToUndefined(newSource.field_hash),
      'lastUpdated': nullToUndefined(newSource.field_last_updated),
      'mapped': nullToUndefined(JSON.parse(newSource.field_mapped)),
      'primaryKey': parseJson(nullToUndefined(newSource.field_primary_key)),
      'foreignKey': nullToUndefined(newSource.field_foreign_key),
      'removed': nullToUndefined(newSource.field_removed),
      'removedValue': nullToUndefined(newSource.field_removed_value),
      'transforms': nullToUndefined(JSON.parse(newSource.transforms)),
      'valueMapped': nullToUndefined(JSON.parse(newSource.value_mapped))
    };
    return returnSource;
  } catch (e) {
    throw (e);
  }
};
