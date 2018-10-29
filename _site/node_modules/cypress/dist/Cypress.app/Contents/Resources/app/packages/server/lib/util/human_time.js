(function() {
  var moment, pluralize;

  moment = require("moment");

  pluralize = require("pluralize");

  module.exports = function(ms) {
    var duration, hours, mins, msg, secs, word;
    msg = [];
    mins = 0;
    duration = moment.duration(ms);
    hours = duration.hours();
    mins = hours * 60;
    if (mins += duration.minutes()) {
      word = pluralize("minute", mins);
      msg.push(mins + " " + word);
    }
    secs = duration.seconds();
    word = pluralize("second", secs);
    msg.push(secs + " " + word);
    return msg.join(", ");
  };

}).call(this);
