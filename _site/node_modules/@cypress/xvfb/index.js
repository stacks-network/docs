/* eslint-disable node/no-deprecated-api */

'use strict'

const once = require('lodash.once')
const fs = require('fs')
const path = require('path')
const spawn = require('child_process').spawn
fs.exists = fs.exists || path.exists
fs.existsSync = fs.existsSync || path.existsSync

function Xvfb (options) {
  options = options || {}
  this._display = (options.displayNum ? `:${options.displayNum}` : null)
  this._reuse = options.reuse
  this._timeout = options.timeout || 2000
  this._silent = options.silent
  this._onStderrData = options.onStderrData || (() => {})
  this._xvfb_args = options.xvfb_args || []
}

Xvfb.prototype = {
  start (cb) {
    let self = this

    if (!self._process) {
      let lockFile = self._lockFile()

      self._setDisplayEnvVariable()

      fs.exists(lockFile, function (exists) {
        let didSpawnFail = false
        try {
          self._spawnProcess(exists, function (e) {
            didSpawnFail = true
            if (cb) cb(e)
          })
        } catch (e) {
          return cb && cb(e)
        }

        let totalTime = 0;
        (function checkIfStarted () {
          fs.exists(lockFile, function (exists) {
            if (didSpawnFail) {
              // When spawn fails, the callback will immediately be called.
              // So we don't have to check whether the lock file exists.
              return
            }
            if (exists) {
              return cb && cb(null, self._process)
            } else {
              totalTime += 10
              if (totalTime > self._timeout) {
                return cb && cb(new Error('Could not start Xvfb.'))
              } else {
                setTimeout(checkIfStarted, 10)
              }
            }
          })
        })()
      })
    }
  },

  stop (cb) {
    let self = this

    if (self._process) {
      self._killProcess()
      self._restoreDisplayEnvVariable()

      let lockFile = self._lockFile()
      let totalTime = 0;
      (function checkIfStopped () {
        fs.exists(lockFile, function (exists) {
          if (!exists) {
            return cb && cb(null, self._process)
          } else {
            totalTime += 10
            if (totalTime > self._timeout) {
              return cb && cb(new Error('Could not stop Xvfb.'))
            } else {
              setTimeout(checkIfStopped, 10)
            }
          }
        })
      })()
    } else {
      return cb && cb(null)
    }
  },

  display () {
    if (!this._display) {
      let displayNum = 98
      let lockFile
      do {
        displayNum++
        lockFile = this._lockFile(displayNum)
      } while (!this._reuse && fs.existsSync(lockFile))
      this._display = `:${displayNum}`
    }

    return this._display
  },

  _setDisplayEnvVariable () {
    this._oldDisplay = process.env.DISPLAY
    process.env.DISPLAY = this.display()
  },

  _restoreDisplayEnvVariable () {
    // https://github.com/cypress-io/xvfb/issues/1
    // only reset truthy backed' up values
    if (this._oldDisplay) {
      process.env.DISPLAY = this._oldDisplay
    } else {
      // else delete the values to get back
      // to undefined
      delete process.env.DISPLAY
    }
  },

  _spawnProcess (lockFileExists, onAsyncSpawnError) {
    let self = this

    const onError = once(onAsyncSpawnError)

    let display = self.display()
    if (lockFileExists) {
      if (!self._reuse) {
        throw new Error(`Display ${display} is already in use and the "reuse" option is false.`)
      }
    } else {
      const stderr = []

      self._process = spawn('Xvfb', [display].concat(self._xvfb_args))
      self._process.stderr.on('data', function (data) {
        stderr.push(data.toString())

        if (self._silent) {
          return
        }

        self._onStderrData(data)
      })

      self._process.on('close', (code) => {
        if (code !== 0) {
          const err = new Error(`${stderr.join('\n')}`)
          err.nonZeroExitCode = true
          onError(err)
        }
      })

      // Bind an error listener to prevent an error from crashing node.
      self._process.once('error', function (e) {
        onError(e)
      })
    }
  },

  _killProcess () {
    this._process.kill()
    this._process = null
  },

  _lockFile (displayNum) {
    displayNum = displayNum || this.display().toString().replace(/^:/, '')
    return `/tmp/.X${displayNum}-lock`
  },
}

module.exports = Xvfb
