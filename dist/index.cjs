/*!
 * node-systray-v2 v2.0.0
 * (c) Edgar Pogosyan
 * Released under the MIT License.
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var child = require('child_process');
var readline = require('readline');
var path = require('path');
var os = require('os');
var fs = require('fs-extra');
var events = require('events');
var xdebug = require('debug');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n["default"] = e;
  return Object.freeze(n);
}

var child__namespace = /*#__PURE__*/_interopNamespace(child);
var readline__namespace = /*#__PURE__*/_interopNamespace(readline);
var path__namespace = /*#__PURE__*/_interopNamespace(path);
var os__namespace = /*#__PURE__*/_interopNamespace(os);
var fs__namespace = /*#__PURE__*/_interopNamespace(fs);
var xdebug__default = /*#__PURE__*/_interopDefaultLegacy(xdebug);

function getTrayBinPath(debug = false, copyDir = false) {
    const binName = {
        win32: `tray_windows${debug ? '' : '_release'}.exe`,
        darwin: `tray_darwin${debug ? '' : '_release'}`,
        linux: `tray_linux${debug ? '' : '_release'}`,
    }[process.platform];
    if (!binName) {
        throw new Error(`node-systray-v2: unsupported platform ${process.platform}.`);
    }
    const binPath = path__namespace.resolve(`${getDirName()}/../traybin/${binName}`);
    if (copyDir) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const pkg = require('../package.json');
        copyDir = path__namespace.join(typeof copyDir === 'string'
            ? copyDir
            : `${os__namespace.homedir()}/.cache/node-systray/`, pkg.version);
        const copyDistPath = path__namespace.join(copyDir, binName);
        if (!fs__namespace.existsSync(copyDistPath)) {
            fs__namespace.ensureDirSync(copyDir);
            fs__namespace.copySync(binPath, copyDistPath);
        }
        return copyDistPath;
    }
    return binPath;
}
const getDirName = (function getDirNameScope() {
    return () => __dirname;
})();

const debug = xdebug__default["default"]('systray');
const CHECK_STR = ' (√)';
function updateCheckedInLinux(item) {
    if (process.platform !== 'linux') {
        return item;
    }
    if (item.checked) {
        item.title += CHECK_STR;
    }
    else {
        item.title = (item.title || '').replace(RegExp(CHECK_STR + '$'), '');
    }
    return item;
}
class SysTray extends events.EventEmitter {
    constructor(conf) {
        super();
        this._conf = conf;
        this._binPath = getTrayBinPath(conf.debug, conf.copyDir);
        this._process = child__namespace.spawn(this._binPath, [], {
            windowsHide: true,
        });
        this._rl = readline__namespace.createInterface({
            input: this._process.stdout,
        });
        conf.menu.items = conf.menu.items.map(updateCheckedInLinux);
        this._rl.on('line', (data) => debug('onLine', data));
        this.onReady(() => this.writeLine(JSON.stringify(conf.menu)));
    }
    onReady(listener) {
        this._rl.on('line', (line) => {
            const action = JSON.parse(line);
            if (action.type === 'ready') {
                listener();
                debug('onReady', action);
            }
        });
        return this;
    }
    onClick(listener) {
        this._rl.on('line', (line) => {
            const action = JSON.parse(line);
            if (action.type === 'clicked') {
                debug('onClick', action);
                listener(action);
            }
        });
        return this;
    }
    writeLine(line) {
        if (line) {
            debug('writeLine', line + '\n', '=====');
            this._process.stdin.write(line.trim() + '\n');
        }
        return this;
    }
    sendAction(action) {
        switch (action.type) {
            case 'update-item':
                action.item = updateCheckedInLinux(action.item);
                break;
            case 'update-menu':
                action.menu.items = action.menu.items.map(updateCheckedInLinux);
                break;
            case 'update-menu-and-item':
                action.menu.items = action.menu.items.map(updateCheckedInLinux);
                action.item = updateCheckedInLinux(action.item);
                break;
        }
        debug('sendAction', action);
        this.writeLine(JSON.stringify(action));
        return this;
    }
    kill() {
        this._rl.close();
        this._process.kill();
    }
    onExit(listener) {
        this._process.on('exit', listener);
    }
    onError(listener) {
        this._process.on('error', (err) => {
            debug('onError', err, 'binPath', this.binPath);
            listener(err);
        });
    }
    get killed() {
        return this._process.killed;
    }
    get binPath() {
        return this._binPath;
    }
}

exports.SysTray = SysTray;
//# sourceMappingURL=index.cjs.map
