'use babel';

import { EventEmitter } from 'events';

import Byebug from './byebug';
import { exec } from './util';

export default class DebugProcess {
  constructor(dir, executable, args) {
    this._ee = new EventEmitter();

    const term = exec(dir, executable, args);
    this._term = term;
    term.on('data', (data) => {this.emit(DebugProcess.EVENT.PROC_OUTPUT, data)});
    term.on('exit', (code, signal) => {this._on_exit(code, signal)});

    const byebug = new Byebug();
    this._byebug = byebug;
    byebug.on(Byebug.EVENT.RECEIVED, (line) => {this.emit(DebugProcess.EVENT.DBG_OUTPUT, line)});
    byebug.on(Byebug.EVENT.SENT, (line) => {this.emit(DebugProcess.EVENT.DBG_INPUT, line)});
    byebug.on(Byebug.EVENT.CONNECTED, () => {this.emit(DebugProcess.EVENT.DBG_CONNECTED)});
    byebug.on(Byebug.EVENT.DISCONNECTED, () => {this.emit(DebugProcess.EVENT.DBG_DISCONNECTED)});
    byebug.on(Byebug.EVENT.ENTER_PROMPT, () => {this.emit(DebugProcess.EVENT.PROC_STOPPED)});
    byebug.on(Byebug.EVENT.EXIT_PROMPT, () => {this.emit(DebugProcess.EVENT.PROC_RUNNING)});
  }

  on(event_name, callback) {
    this._ee.on(event_name, callback);
  }

  emit(event_name, ...args) {
    this._ee.emit(event_name, ...args);
  }

  send(line) {
    this._byebug.send(line);
  }

  destroy() {
    this._term.destroy(); // TODO: check that this raises _on_exit
  }

  _on_exit(code, signal) {
    this._byebug.destroy();
    this._byebug = null;
    this._term = null;
    this.emit(DebugProcess.EVENT.PROC_EXIT, code, signal);
  }
}

DebugProcess.EVENT = {
  PROC_OUTPUT: 'proc-output',
  PROC_STOPPED: 'proc-stopped',
  PROC_RUNNING: 'proc-running',
  PROC_EXIT: 'proc-exit',

  DBG_CONNECTED: 'dbg-connected',
  DBG_DISCONNECTED: 'dbg-disconnected',
  DBG_OUTPUT: 'dbg-output',
  DBG_INPUT: 'dbg-input'
};
