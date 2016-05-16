module.exports = function (field) {
  // Convert Null to Undefined
  return field !== null ? field : undefined;
};
