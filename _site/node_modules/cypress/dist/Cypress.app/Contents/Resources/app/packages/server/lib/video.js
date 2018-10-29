(function() {
  var Promise, _, debug, ffmpeg, ffmpegPath, fs, stream, utils;

  _ = require("lodash");

  fs = require("fs-extra");

  utils = require("fluent-ffmpeg/lib/utils");

  ffmpeg = require("fluent-ffmpeg");

  stream = require("stream");

  Promise = require("bluebird");

  ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;

  debug = require("debug")("cypress:server:video");

  fs = Promise.promisifyAll(fs);

  ffmpeg.setFfmpegPath(ffmpegPath);

  module.exports = {
    copy: function(src, dest) {
      return fs.copyAsync(src, dest, {
        overwrite: true
      })["catch"]({
        code: "ENOENT"
      }, function() {});
    },
    start: function(name, options) {
      var cmd, done, end, ended, errored, logErrors, pt, skipped, started, wantsWrite, write, written;
      if (options == null) {
        options = {};
      }
      pt = stream.PassThrough();
      started = Promise.pending();
      ended = Promise.pending();
      done = false;
      errored = false;
      written = false;
      logErrors = true;
      wantsWrite = true;
      skipped = 0;
      _.defaults(options, {
        onError: function() {}
      });
      end = function() {
        done = true;
        if (!written) {
          logErrors = false;
        }
        pt.end();
        return ended.promise;
      };
      write = function(data) {
        if (done) {
          return;
        }
        written = true;
        if (wantsWrite) {
          if (!(wantsWrite = pt.write(data))) {
            return pt.once("drain", function() {
              return wantsWrite = true;
            });
          }
        } else {
          return skipped += 1;
        }
      };
      cmd = ffmpeg({
        source: pt,
        priority: 20
      }).inputFormat("image2pipe").inputOptions("-use_wallclock_as_timestamps 1").videoCodec("libx264").outputOptions("-preset ultrafast").on("start", function(line) {
        debug("ffmpeg started");
        return started.resolve(new Date);
      }).on("error", function(err, stdout, stderr) {
        debug("ffmpeg errored:", err.message);
        if (logErrors) {
          options.onError(err, stdout, stderr);
        }
        err.recordingVideoFailed = true;
        return ended.reject(err);
      }).on("end", function() {
        debug("ffmpeg ended");
        return ended.resolve();
      }).save(name);
      return {
        cmd: cmd,
        end: end,
        start: started.promise,
        write: write
      };
    },
    process: function(name, cname, videoCompression, onProgress) {
      var total;
      if (onProgress == null) {
        onProgress = function() {};
      }
      total = null;
      return new Promise(function(resolve, reject) {
        var cmd;
        return cmd = ffmpeg().input(name).videoCodec("libx264").outputOptions(["-preset fast", "-crf " + videoCompression]).save(cname).on("codecData", function(data) {
          return total = utils.timemarkToSeconds(data.duration);
        }).on("progress", function(progress) {
          var progressed;
          if (!total) {
            return;
          }
          progressed = utils.timemarkToSeconds(progress.timemark);
          return onProgress(progressed / total);
        }).on("error", function(err, stdout, stderr) {
          return reject(err);
        }).on("end", function() {
          onProgress(1);
          return fs.moveAsync(cname, name, {
            overwrite: true
          }).then(function() {
            return resolve();
          });
        });
      });
    }
  };

}).call(this);
