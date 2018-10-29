(function() {
  var Menu, _, appData, onLogOutClicked, open, os, shell;

  _ = require("lodash");

  os = require("os");

  Menu = require("electron").Menu;

  shell = require("electron").shell;

  appData = require("../util/app_data");

  open = require("../util/open");

  onLogOutClicked = function() {};

  module.exports = {
    set: function(options) {
      var menu, name, template;
      if (options == null) {
        options = {};
      }
      _.defaults(options, {
        withDevTools: false
      });
      if (options.onLogOutClicked) {
        onLogOutClicked = options.onLogOutClicked;
      }
      template = [
        {
          label: "File",
          submenu: [
            {
              label: "Changelog",
              click: function() {
                return shell.openExternal("https://on.cypress.io/changelog");
              }
            }, {
              type: "separator"
            }, {
              label: "Manage Account",
              click: function() {
                return shell.openExternal("https://on.cypress.io/dashboard");
              }
            }, {
              label: "Log Out",
              click: onLogOutClicked
            }, {
              type: "separator"
            }, {
              label: "View App Data",
              click: function() {
                return open.opn(appData.path());
              }
            }, {
              type: "separator"
            }, {
              label: "Close Window",
              accelerator: "CmdOrCtrl+W",
              role: "close"
            }
          ]
        }, {
          label: "Edit",
          submenu: [
            {
              label: "Undo",
              accelerator: "CmdOrCtrl+Z",
              role: "undo"
            }, {
              label: "Redo",
              accelerator: "Shift+CmdOrCtrl+Z",
              role: "redo"
            }, {
              type: "separator"
            }, {
              label: "Cut",
              accelerator: "CmdOrCtrl+X",
              role: "cut"
            }, {
              label: "Copy",
              accelerator: "CmdOrCtrl+C",
              role: "copy"
            }, {
              label: "Paste",
              accelerator: "CmdOrCtrl+V",
              role: "paste"
            }, {
              label: "Select All",
              accelerator: "CmdOrCtrl+A",
              role: "selectall"
            }
          ]
        }, {
          label: "Window",
          role: "window",
          submenu: [
            {
              label: "Minimize",
              accelerator: "CmdOrCtrl+M",
              role: "minimize"
            }
          ]
        }, {
          label: "Help",
          role: "help",
          submenu: [
            {
              label: "Support",
              click: function() {
                return shell.openExternal("https://on.cypress.io/support");
              }
            }, {
              label: "Documentation",
              click: function() {
                return shell.openExternal("https://on.cypress.io");
              }
            }, {
              label: "Report an Issue..",
              click: function() {
                return shell.openExternal("https://on.cypress.io/new-issue");
              }
            }
          ]
        }
      ];
      if (os.platform() === "darwin") {
        name = "Cypress";
        template.unshift({
          label: name,
          submenu: [
            {
              label: "About " + name,
              role: "about"
            }, {
              type: "separator"
            }, {
              label: "Services",
              role: "services",
              submenu: []
            }, {
              type: "separator"
            }, {
              label: "Hide " + name,
              accelerator: "Command+H",
              role: "hide"
            }, {
              label: "Hide Others",
              accelerator: "Command+Shift+H",
              role: "hideothers"
            }, {
              label: "Show All",
              role: "unhide"
            }, {
              type: "separator"
            }, {
              label: "Quit",
              accelerator: "Command+Q",
              click: (function(_this) {
                return function(item, focusedWindow) {
                  return process.exit(0);
                };
              })(this)
            }
          ]
        });
      }
      if (options.withDevTools) {
        template.push({
          label: "Developer Tools",
          submenu: [
            {
              label: 'Reload',
              accelerator: 'CmdOrCtrl+R',
              click: (function(_this) {
                return function(item, focusedWindow) {
                  if (focusedWindow) {
                    return focusedWindow.reload();
                  }
                };
              })(this)
            }, {
              label: 'Toggle Developer Tools',
              accelerator: (function() {
                if (os.platform() === 'darwin') {
                  return 'Alt+Command+I';
                } else {
                  return 'Ctrl+Shift+I';
                }
              })(),
              click: (function(_this) {
                return function(item, focusedWindow) {
                  if (focusedWindow) {
                    return focusedWindow.toggleDevTools();
                  }
                };
              })(this)
            }
          ]
        });
      }
      menu = Menu.buildFromTemplate(template);
      return Menu.setApplicationMenu(menu);
    }
  };

}).call(this);
