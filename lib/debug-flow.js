'use babel';

import { signal_name } from './util'
import Byebug from './byebug'
import DebuggerPane from './debugger-pane'

export function connect_to_term(view, term, end_callback) {
  view.output_pane.clear();

  term.on('data', (data) => {
    view.output_pane.print(data);
  });

  term.on('exit', (code, signal) => {
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

    end_callback();
  });
}

export function connect_to_byebug(view, byebug, stop_callback) {
  view.debugger_pane.clear();

  view.debugger_pane.on(DebuggerPane.EVENT.SEND_LINE, (line) => {
    byebug.send(line);
  });

  byebug.on(Byebug.EVENT.RECEIVED, (line) => {
    view.debugger_pane.print(`${line}\n`);
  });

  byebug.on(Byebug.EVENT.SENT, (line) => {
    view.debugger_pane.print(`${line}\n`);
  });

  byebug.on(Byebug.EVENT.STOPPED, () => {
    stop_callback();
  });
}
