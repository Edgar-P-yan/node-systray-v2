/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import * as child from 'child_process';
import { EventEmitter } from 'events';
import * as readline from 'readline';
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
export type Action = UpdateItemAction | UpdateMenuAction | UpdateMenuAndItemAction;
export type Conf = {
    menu: Menu;
    debug?: boolean;
    copyDir?: boolean | string;
};
export default class SysTray extends EventEmitter {
    protected _conf: Conf;
    protected _process: child.ChildProcess;
    protected _rl: readline.ReadLine;
    protected _binPath: string;
    constructor(conf: Conf);
    onReady(listener: () => void): this;
    onClick(listener: (action: ClickEvent) => void): this;
    writeLine(line: string): this;
    sendAction(action: Action): this;
    /**
     * Kill the systray process.
     *
     * ## Change notes:
     * ### v2.0.0
     * Removed parameter `exitNode` that automatically killed nodejs process when systray exitted.
     */
    kill(): void;
    onExit(listener: (code: number | null, signal: string | null) => void): void;
    onError(listener: (err: Error) => void): void;
    get killed(): boolean;
    get binPath(): string;
}
//# sourceMappingURL=index.d.ts.map