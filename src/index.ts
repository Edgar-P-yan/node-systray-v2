import * as child from 'child_process';
import { EventEmitter } from 'events';
import * as readline from 'readline';
import Debug from 'debug';
import { getTrayBinPath } from './get-tray-bin-path';

const debug = Debug('systray');

export type MenuItem = {
  title: string;
  tooltip: string;
  checked: boolean;
  enabled: boolean;
};

export type Menu = {
  icon: string;
  title: string;
  tooltip: string;
  items: MenuItem[];
};

export type ClickEvent = {
  type: 'clicked';
  item: MenuItem;
  seq_id: number;
};

export type ReadyEvent = {
  type: 'ready';
};

export type Event = ClickEvent | ReadyEvent;

export type UpdateItemAction = {
  type: 'update-item';
  item: MenuItem;
  seq_id: number;
};

export type UpdateMenuAction = {
  type: 'update-menu';
  menu: Menu;
  seq_id: number;
};

export type UpdateMenuAndItemAction = {
  type: 'update-menu-and-item';
  menu: Menu;
  item: MenuItem;
  seq_id: number;
};

export type Action =
  | UpdateItemAction
  | UpdateMenuAction
  | UpdateMenuAndItemAction;

export type Conf = {
  menu: Menu;
  debug?: boolean;
  copyDir?: boolean | string;
};

const CHECK_STR = ' (√)';

function updateCheckedInLinux(item: MenuItem): MenuItem {
  if (process.platform !== 'linux') {
    return item;
  }
  if (item.checked) {
    item.title += CHECK_STR;
  } else {
    item.title = (item.title || '').replace(RegExp(CHECK_STR + '$'), '');
  }
  return item;
}

export default class SysTray extends EventEmitter {
  protected _conf: Conf;
  protected _process: child.ChildProcess;
  protected _rl: readline.ReadLine;
  protected _binPath: string;

  constructor(conf: Conf) {
    super();

    this._conf = conf;
    this._binPath = getTrayBinPath(conf.debug, conf.copyDir);
    this._process = child.spawn(this._binPath, [], {
      windowsHide: true,
    });

    this._rl = readline.createInterface({
      input: this._process.stdout!,
    });

    conf.menu.items = conf.menu.items.map(updateCheckedInLinux);
    this._rl.on('line', (data) => debug('onLine', data));
    this.onReady(() => this.writeLine(JSON.stringify(conf.menu)));
  }

  onReady(listener: () => void): this {
    this._rl.on('line', (line: string) => {
      const action: Event = JSON.parse(line);
      if (action.type === 'ready') {
        listener();
        debug('onReady', action);
      }
    });
    return this;
  }

  onClick(listener: (action: ClickEvent) => void): this {
    this._rl.on('line', (line: string) => {
      const action: ClickEvent = JSON.parse(line);
      if (action.type === 'clicked') {
        debug('onClick', action);
        listener(action);
      }
    });
    return this;
  }

  writeLine(line: string): this {
    if (line) {
      debug('writeLine', line + '\n', '=====');
      this._process.stdin!.write(line.trim() + '\n');
    }
    return this;
  }

  sendAction(action: Action): this {
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
  kill(): void {
    this._rl.close();
    this._process.kill();
  }

  onExit(listener: (code: number | null, signal: string | null) => void): void {
    this._process.on('exit', listener);
  }

  onError(listener: (err: Error) => void): void {
    this._process.on('error', (err) => {
      debug('onError', err, 'binPath', this.binPath);
      listener(err);
    });
  }

  get killed(): boolean {
    return this._process.killed;
  }

  get binPath(): string {
    return this._binPath;
  }
}
