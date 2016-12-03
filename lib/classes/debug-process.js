'use babel';

import Byebug from './byebug';
import EventHandler from './event-handler';
import { exec } from './util';

export default class DebugProcess {
  constructor(dir, executable, args) {
    this._eh = new EventHandler();
    this._destroying = false;

    const term = exec(dir, executable, args);
    this._term = term;
    term.on('data', (data) => {this.emit(DebugProcess.EVENT.PROC_OUTPUT, data)});
    term.on('exit', (code, signal) => {this._on_exit(code, signal)});

    this._byebug = new Byebug();
    this._handle_byebug_events();
  }

  destroy() {
    this._destroying = true;
    this._term.destroy(); // TODO: check that this raises _on_exit
  }

  on(event_name, callback) {this._eh.on(event_name, callback)}
  emit(event_name, ...args) {this._eh.emit(event_name, ...args)}

  next() {this._byebug.next()}
  step() {this._byebug.step()}
  continue() {this._byebug.continue()}

  send(line) {this._byebug.send(line)}

  where() {return this._byebug.where()}

  _on_exit(code, signal) {
    this._byebug.destroy();
    this._byebug = null;
    this._term = null;
    this.emit(DebugProcess.EVENT.PROC_EXIT, code, signal);
  }

  _on_disconnected() {
    if(!this._destroying) {
      this.emit(DebugProcess.EVENT.DBG_DISCONNECTED);
    }
  }

  _on_enter_prompt(file, line) {
    this.emit(DebugProcess.EVENT.PROC_STOPPED, file, line);
  }

  _handle_byebug_events() {
    const byebug = this._byebug;

    this._eh.repeat(byebug, Byebug.EVENT.RECEIVED, DebugProcess.EVENT.DBG_OUTPUT);
    this._eh.repeat(byebug, Byebug.EVENT.SENT, DebugProcess.EVENT.DBG_INPUT);
    this._eh.repeat(byebug, Byebug.EVENT.CONNECTED, DebugProcess.EVENT.DBG_CONNECTED);
    byebug.on(Byebug.EVENT.DISCONNECTED, () => {this._on_disconnected()});
    byebug.on(Byebug.EVENT.ENTER_PROMPT, (file, line) => {this._on_enter_prompt(file, line)});
    this._eh.repeat(byebug, Byebug.EVENT.EXIT_PROMPT, DebugProcess.EVENT.PROC_RUNNING);
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
