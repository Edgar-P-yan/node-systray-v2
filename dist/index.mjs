/*!
 * node-systray-v2 v2.0.0
 * (c) Edgar Pogosyan
 * Released under the MIT License.
 */

import * as child from 'child_process';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs-extra';
import { EventEmitter } from 'events';
import * as readline from 'readline';
import Debug from 'debug';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('../package.json');
const debug = Debug('systray');
const getTrayBinPath = (debug = false, copyDir = false) => {
    const binName = {
        win32: `tray_windows${debug ? '' : '_release'}.exe`,
        darwin: `tray_darwin${debug ? '' : '_release'}`,
        linux: `tray_linux${debug ? '' : '_release'}`,
    }[process.platform];
    if (!binName) {
        throw new Error(`node-systray-v2: unsupported platform ${process.platform}.`);
    }
    const binPath = path.resolve(`${__dirname}/../traybin/${binName}`);
    if (copyDir) {
        copyDir = path.join(typeof copyDir === 'string'
            ? copyDir
            : `${os.homedir()}/.cache/node-systray/`, pkg.version);
        const copyDistPath = path.join(copyDir, binName);
        if (!fs.existsSync(copyDistPath)) {
            fs.ensureDirSync(copyDir);
            fs.copySync(binPath, copyDistPath);
        }
        return copyDistPath;
    }
    return binPath;
};
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
class SysTray extends EventEmitter {
    constructor(conf) {
        super();
        this._conf = conf;
        this._binPath = getTrayBinPath(conf.debug, conf.copyDir);
        this._process = child.spawn(this._binPath, [], {
            windowsHide: true,
        });
        this._rl = readline.createInterface({
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
    /**
     * Kill the systray process.
     *
     * ## Change notes:
     * ### v2.0.0
     * Removed parameter `exitNode` that automatically killed nodejs process when systray exitted.
     */
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

export { SysTray as default };
//# sourceMappingURL=index.mjs.map
