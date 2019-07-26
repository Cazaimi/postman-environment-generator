module.exports = function (name, variableArray) {
  return {
    environment: {
      name,
      values: variableArray.map(function (value) {
        return {
          key: value,
          value: ''
        };
      })
    }
  }
};
