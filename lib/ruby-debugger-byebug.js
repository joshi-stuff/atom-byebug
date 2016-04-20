"use babel";

import { CompositeDisposable } from 'atom';
import { spawn } from 'child_process';
import fs from 'fs';
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
      'atom-workspace', 'ruby-debugger-byebug:show', show
    )
  );
}

export function deactivate() {
  subscriptions.dispose();
}

function run(executable, arguments) {
  alert(executable);
  alert(arguments);
  const pid = spawn(executable, arguments);

  let out = '';

  pid.stdout.on('data', (chunk) => {
    out += chunk;
  });

  pid.on('error', () => {
    out = 'Failed to import ENV'
  });

  pid.on('close', () => {
    alert(out);
  });

  pid.stdin.end();
}

export function launch() {
  // TODO: handle several paths
  const path = atom.project.getPaths()[0];
  const config_path = `${path}/.ruby-debugger-byebug`;
  const config_file = `${config_path}/config.json`;

  let config = null;
  try {
    fs.accessSync(config_file, fs.R_OK);
    const json = fs.readFileSync(config_file, 'utf8');
    config = JSON.parse(json);
  } catch (e) {
    console.log(e);
    alert('No configuration found!');
  }

  if (config) {
    let executable = `${config_path}/${config.executable}`

    try {
      fs.accessSync(executable, fs.X_OK);
    } catch (e) {
      console.log(e);
      alert(
        'Unable to debug because the configured executable has no execution permissions'
      );
      executable = null;
    }

    if (executable) {
      run(executable, config.arguments);
    }
  }
}

export function show() {
  if (view) {
    view.destroy();
    view = null;
  } else {
    view = new DebuggerView();
    view.addToPanel('right');
  }
}
