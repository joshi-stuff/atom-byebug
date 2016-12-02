'use babel';

import { get_executable_config } from './config';

import DebugProcess from '../classes/debug-process'
import { signal_name } from '../classes/util'

import DebuggerView from '../ui/debugger-view'
import DebuggerPane from '../ui/debugger-pane'

export default class Application {
  constructor() {
    this._view = this._create_view();
    this._current_line_marker = null;
    this._process = null;
  }

  destroy() {
    this._stop();
    this._view.destroy();
    this._view = null;
  }

  toggle() {
    const view = this._view;

    view.visible = !view.visible;
  }

  run() {
    const view = this._view;

    if (!view.visible) {
      view.visible = true;
    }

    if (this._process) {
      this._process.send('continue');
      return;
    }

    this.clear();
    view.enable_button('run', false);
    view.enable_button('stop', true);

    const config = get_executable_config();

    const process = new DebugProcess(config.dir, config.executable, config.arguments);
    this._process = process;
    process.on(DebugProcess.EVENT.PROC_OUTPUT, (data) => {view.output_pane.print(data)});
    process.on(DebugProcess.EVENT.PROC_EXIT, (code, signal) => {this._on_exit(code, signal)});
    process.on(DebugProcess.EVENT.PROC_RUNNING, () => {this._on_running()});
    process.on(DebugProcess.EVENT.PROC_STOPPED, (file, line) => {this._on_stopped(file, line)});
    process.on(DebugProcess.EVENT.DBG_CONNECTED, () => {this._on_connected()});
    process.on(DebugProcess.EVENT.DBG_DISCONNECTED, () => {this._on_disconnected()});
    process.on(DebugProcess.EVENT.DBG_OUTPUT, (line) => {view.debugger_pane.print(`${line}\n`);});
    process.on(DebugProcess.EVENT.DBG_INPUT, (line) => {view.debugger_pane.print(`${line}\n`)});
  }

  next() {
    const proc = this._process;

    if (proc) {
      proc.send('next');
    }
  }

  step() {
    const proc = this._process;

    if (proc) {
      proc.send('step');
    }
  }

  stop() {
    const proc = this._process;

    if (proc) {
      proc.destroy();
    }
  }

  clear() {
    const view = this._view;
    view.output_pane.clear();
    view.debugger_pane.clear();
  }

  configure() {
    alert('Not yet implemented :-(');
  }

  _create_view() {
    const view = new DebuggerView();

    view.visible = false;
    view.addToPanel('bottom');
    view.on(DebuggerView.EVENT.RUN, () => {this.run()});
    view.on(DebuggerView.EVENT.NEXT, () => {this.next()});
    view.on(DebuggerView.EVENT.STEP, () => {this.step()});
    view.on(DebuggerView.EVENT.STOP, () => {this.stop()});
    view.on(DebuggerView.EVENT.CLEAR, () => {this.clear()});
    view.on(DebuggerView.EVENT.CONFIGURE, () => {this.configure()});

    view.debugger_pane.on(DebuggerPane.EVENT.SEND_LINE, (line) => {
      this._on_debugger_pane_send_line(line)
    });

    view.enable_button('run', true);
    view.enable_button('next', false);
    view.enable_button('step', false);
    view.enable_button('stop', false);

    return view;
  }

  _show_current_line(file, line) {
    this._hide_current_line();

    atom.workspace.open(
      file, {
        initialLine: line,
        pending: true
      }
    ).then((editor) => {
      const current_line_marker = editor.markBufferRange([
        [line-1, 0],
        [line, 0]
      ], {
        persistent: true,
        invalidate: 'never'
      });
      this._current_line_marker = current_line_marker;

      editor.decorateMarker(current_line_marker, {
        type: 'line',
        class: 'byebug-current-line'
      });
      editor.moveUp(1);
    });
  }

  _hide_current_line() {
    const current_line_marker = this._current_line_marker;

    if(current_line_marker) {
      current_line_marker.destroy();
      this._current_line_marker = null;
    }
  }

  _on_debugger_pane_send_line(line) {
    const proc = this._process;

    if(proc) {
      proc.send(line);
    }
  }

  _on_connected() {
    const view = this._view;

    view.connected = true;
  }

  _on_disconnected() {
    const view = this._view;º

    view.connected = false;
    alert('Connection to byebug was lost or not established');
  }

  _on_stopped(file, line) {
    const view = this._view;

    this._show_current_line(file, line);
    view.enable_button('run', true);
    view.enable_button('next', true);
    view.enable_button('step', true);
  }

  _on_running() {
    const view = this._view;

    this._hide_current_line();
    view.enable_button('run', false);
    view.enable_button('next', false);
    view.enable_button('step', false);
  }

  _on_exit(code, signal) {
    const view = this._view;

    this._hide_current_line();
    view.enable_button('run', true);
    view.enable_button('next', false);
    view.enable_button('step', false);
    view.enable_button('stop', false);
    view.connected = false;

    this._process = null;
    if (signal == 0) {
      view.output_pane.print(
        '<hr>' +
        `<div class="exit_message ${code==0 ? 'success' : 'error'}">` +
        `Process exited with code ${code}` +
        '</div>'
      );
    } else {
      view.output_pane.print(
        '<hr>' +
        '<div class="exit_message warning">' +
        `Process exited with signal ${signal_name(signal)} (${signal})` +
        '</div>'
      );
    }
  }
}
