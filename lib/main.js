"use babel";

import { CompositeDisposable } from 'atom';
import { check_access, read_config, exec, signal_name } from './util'
import DebuggerView from './debugger-view'

const subscriptions = new CompositeDisposable();
let view = null;
let term = null;

export function activate(state) {
  register_command(toggle, 'toggle');
  register_command(run, 'run');
  register_command(configure, 'configure');
  register_command(next, 'next');
  register_command(step, 'step');
}

export function deactivate() {
  if (view) {
    view.destroy();
    view = null;
  }
  subscriptions.dispose();
}

export function toggle() {
  if (view) {
    view.destroy();
    view = null;
  } else {
    view = new DebuggerView();
    view.addToPanel('bottom');
  }
}

export function run() {
  ensure_view();

  // TODO: handle several paths
  const path = atom.project.getPaths()[0];
  const config_path = `${path}/.byebug-debugger`;
  const config_file = `${config_path}/config.json`

  if (!check_access(config_file, 'r')) {
    alert('Configuration file is not readable or does not exist');
    return;
  }

  const config = read_config(config_file);

  if (!config.executable) {
    alert('Configuration does not define any executable');
    return;
  }

  const executable = `${config_path}/${config.executable}`

  if (!check_access(executable, 'x')) {
    alert('Configured executable has no execution permissions');
    return;
  }

  view.output.clear();

  term = exec(executable, config.arguments);

  term.on('data', (data) => {
    view.output.print(data);
  });
  term.on('exit', (code, signal) => {
    if (signal == 0) {
      view.output.print(
        `<hr>` +
        `<div class="exit_message ${code==0 ? 'success' : 'error'}">` +
        `Process exited with code ${code}` +
        `</div>`
      );
    } else {
      view.output.print(
        `<hr>` +
        `<div class="exit_message warning">` +
        `Process exited with signal ${signal_name(signal)} (${signal})` +
        `</div>`
      );
    }
  });
}

export function configure() {
  alert('configure');
}

export function next() {
  alert('next');
}

export function step() {
  alert('step');
}

function ensure_view() {
  if (!view) {
    toggle();
  }
}

function register_command(method, cmd) {
  subscriptions.add(
    atom.commands.add(
      'atom-workspace', `byebug-debugger:${cmd}`, method
    )
  );
}
