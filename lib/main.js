'use babel';

import { CompositeDisposable } from 'atom';
import { connect_to_term, connect_to_byebug } from './debug-flow'
import { get_exec_config } from './config'
import { begin_debug, enter_prompt, end_debug } from './ui-flow'
import { exec } from './util'
import Byebug from './byebug'
import DebuggerPane from './debugger-pane'
import DebuggerView from './debugger-view'

const subscriptions = new CompositeDisposable();
let view = null;
let term = null;
let byebug = null;

export function activate(/*state*/) {
  // Register commands
  register_command(toggle, 'toggle');
  register_command(run, 'run');
  register_command(configure, 'configure');
  register_command(next, 'next');
  register_command(step, 'step');

  // Create view
  view = new DebuggerView();
  view.visible = false;
  view.addToPanel('bottom');
  view.on(DebuggerView.EVENT.RUN, run);
  view.on(DebuggerView.EVENT.STOP, stop);
  view.on(DebuggerView.EVENT.NEXT, next);
  view.on(DebuggerView.EVENT.STEP, step);
  view.on(DebuggerView.EVENT.CONFIGURE, configure);
}

export function deactivate() {
  view.destroy();
  view = null;
  subscriptions.dispose();
}

export function toggle() {
  view.visible = !view.visible;
}

export function run() {
  if (!view.visible) {
    view.visible = true;
  }

  if (term) {
    return;
  }

  const config = get_exec_config();
  begin_debug(view);

  term = exec(config.dir, config.executable, config.arguments);
  connect_to_term(view, term, () => {
    end_debug(view);
    term = byebug = null;
  });

  setTimeout(() => {
    byebug = new Byebug().connect();
    connect_to_byebug(view, byebug, () => {
      enter_prompt(byebug);
    });
  }, 2000);
}

export function configure() {
  alert('configure');
}

export function next() {
  if (byebug) {
    byebug.next();
  }
}

export function step() {
  if (byebug) {
    byebug.step();
  }
}

export function stop() {
  if (term) {
    term.destroy();
  }
}

function register_command(method, cmd) {
  subscriptions.add(
    atom.commands.add(
      'atom-workspace', `byebug-debugger:${cmd}`, method
    )
  );
}
