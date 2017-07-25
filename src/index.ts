import child, { ChildProcess } from 'child_process'
import path from 'path'
import os from 'os'
import fs from 'fs-extra'
import EventEmitter from 'events'
import readline, { ReadLine } from 'readline'
import Debug from 'debug'

const pkg = require('../package.json')
const debug = Debug(pkg.name)

export type MenuItem = {
  title: string,
  tooltip: string,
  checked: boolean,
  enabled: boolean,
}

export type Menu = {
  icon: string,
  title: string,
  tooltip: string,
  items: MenuItem[],
}

export type ClickEvent = {
  type: 'clicked',
  item: MenuItem,
  seq_id: number,
}

export type ReadyEvent = {
  type: 'ready',
}

export type Event = ClickEvent | ReadyEvent

export type UpdateItemAction = {
  type: 'update-item',
  item: MenuItem,
  seq_id: number,
}

export type UpdateMenuAction = {
  type: 'update-menu',
  menu: Menu,
  seq_id: number,
}

export type UpdateMenuAndItemAction = {
  type: 'update-menu-and-item',
  menu: Menu,
  item: MenuItem,
  seq_id: number,
}

export type Action = UpdateItemAction | UpdateMenuAction | UpdateMenuAndItemAction

export type Conf = {
  menu: Menu,
  debug?: boolean,
  copyDir?: boolean | string
}

const getTrayBinPath = (debug: boolean = false, copyDir: boolean | string = false) => {
  const binName = ({
    win32: `tray_windows${debug ? '' : '_release'}.exe`,
    darwin: `tray_darwin${debug ? '' : '_release'}`,
    linux: `tray_linux${debug ? '' : '_release'}`,
  })[process.platform]
  const binPath = path.resolve(`${__dirname}/../traybin/${binName}`)
  if (copyDir) {
    copyDir = path.join((
      typeof copyDir === 'string'
        ? copyDir
        : `${os.homedir()}/.cache/node-systray/`), pkg.version)

    const copyDistPath = path.join(copyDir, binName)
    if (!fs.existsSync(copyDistPath)) {
      fs.ensureDirSync(copyDir)
      fs.copySync(binPath, copyDistPath)
    }

    return copyDistPath
  }
  return binPath
}

export default class SysTray extends EventEmitter {
  protected _conf: Conf
  protected _process: ChildProcess
  protected _rl: ReadLine
  protected _binPath: string

  constructor(conf: Conf) {
    super()
    this._conf = conf
    this._binPath = getTrayBinPath(conf.debug, conf.copyDir)
    this._process = child.spawn(this._binPath)
    this._rl = readline.createInterface({
      input: this._process.stdout,
    })
    this._rl.on('line', data => debug('onLine', data))
    this.onReady(() => this.writeLine(JSON.stringify(conf.menu)))
  }

  onReady(listener: () => void) {
    this._rl.on('line', (line: string) => {
      let action: Event = JSON.parse(line)
      if (action.type === 'ready') {
        listener()
        debug('onReady', action)
      }
    })
    return this
  }

  onClick(listener: (action: ClickEvent) => void) {
    this._rl.on('line', (line: string) => {
      let action: ClickEvent = JSON.parse(line)
      if (action.type === 'clicked') {
        debug('onClick', action)
        listener(action)
      }
    })
    return this
  }

  writeLine(line: string) {
    if (line) {
      debug('writeLine', line + '\n', '=====')
      this._process.stdin.write(line.trim() + '\n')
    }
    return this
  }

  sendAction(action: Action) {
    debug('sendAction', action)
    this.writeLine(JSON.stringify(action))
    return this
  }

  kill() {
    this._rl.close()
    this._process.kill()
  }

  onExit(listener: (code: number | null, signal: string | null) => void) {
    this._process.on('exit', listener)
  }

  onError(listener: (err: Error) => void) {
    this._process.on('error', err => {
      debug('onError', err, 'binPath', this.binPath)
      listener(err)
    })
  }

  get killed() {
    return this._process.killed
  }

  get binPath() {
    return this._binPath
  }
}