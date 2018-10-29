(function() {
  var _, error, errors, isArray, isArrayOfStrings, isFalse, isFullyQualifiedUrl, isNumber, isString;

  _ = require("lodash");

  errors = require("../errors");

  error = function(key, value, type) {
    return "Expected '" + key + "' to be " + type + ". Instead the value was: " + (JSON.stringify(value));
  };

  isFullyQualifiedUrl = function(value) {
    return isString(value) && /^https?\:\/\//.test(value);
  };

  isArrayOfStrings = function(value) {
    return isArray(value) && _.every(value, isString);
  };

  isFalse = function(value) {
    return value === false;
  };

  isArray = _.isArray;

  isNumber = _.isFinite;

  isString = _.isString;

  module.exports = {
    isNumber: function(key, value) {
      if ((value == null) || isNumber(value)) {
        return true;
      } else {
        return error(key, value, "a number");
      }
    },
    isNumberOrFalse: function(key, value) {
      if (isNumber(value) || isFalse(value)) {
        return true;
      } else {
        return error(key, value, "a number or false");
      }
    },
    isFullyQualifiedUrl: function(key, value) {
      if ((value == null) || isFullyQualifiedUrl(value)) {
        return true;
      } else {
        return error(key, value, "a fully qualified URL (starting with http:// or https://)");
      }
    },
    isBoolean: function(key, value) {
      if ((value == null) || _.isBoolean(value)) {
        return true;
      } else {
        return error(key, value, "a boolean");
      }
    },
    isPlainObject: function(key, value) {
      if ((value == null) || _.isPlainObject(value)) {
        return true;
      } else {
        return error(key, value, "a plain object");
      }
    },
    isString: function(key, value) {
      if ((value == null) || isString(value)) {
        return true;
      } else {
        return error(key, value, "a string");
      }
    },
    isArray: function(key, value) {
      if ((value == null) || isArray(value)) {
        return true;
      } else {
        return error(key, value, "an array");
      }
    },
    isStringOrFalse: function(key, value) {
      if (isString(value) || isFalse(value)) {
        return true;
      } else {
        return error(key, value, "a string or false");
      }
    },
    isStringOrArrayOfStrings: function(key, value) {
      if (isString(value) || isArrayOfStrings(value)) {
        return true;
      } else {
        return error(key, value, "a string or an array of strings");
      }
    }
  };

}).call(this);
