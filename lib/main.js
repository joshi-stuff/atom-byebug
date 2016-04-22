"use babel";

import { CompositeDisposable } from 'atom';
import { check_access, read_config, run } from './util'
import DebuggerView from './debugger-view'

const subscriptions = new CompositeDisposable();
let view = null;

export function activate(state) {
  subscriptions.add(
    atom.commands.add(
      'atom-workspace', 'ruby-debugger-byebug:launch', launch
    )
  );
  subscriptions.add(
    atom.commands.add(
      'atom-workspace', 'ruby-debugger-byebug:toggle', toggle
    )
  );
}

export function deactivate() {
  if (view) {
    view.destroy();
    view = null;
  }
  subscriptions.dispose();
}

export function launch() {
  // TODO: handle several paths
  const path = atom.project.getPaths()[0];
  const config_path = `${path}/.ruby-debugger-byebug`;
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

  run(executable, config.arguments);
}

export function toggle() {
  if (view) {
    view.destroy();
    view = null;
  } else {
    view = new DebuggerView();
    view.addToPanel('right');
  }
}
