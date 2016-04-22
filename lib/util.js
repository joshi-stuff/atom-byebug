"use babel";

import pty from 'pty.js';
import fs from 'fs';

export function read_config(file) {
  try {
    const json = fs.readFileSync(file, 'utf8');
    return JSON.parse(json);
  } catch (e) {
    console.log(e);
    return {};
  }
}

export function check_access(file, permission) {
  const permissions = {
    'r': fs.R_OK,
    'w': fs.W_OK,
    'x': fs.X_OK
  };

  try {
    fs.accessSync(file, permissions[permission]);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export function run(executable, arguments) {
  arguments = arguments || [];

  const term = pty.spawn(executable, arguments, {
    name: 'xterm-color',
    cols: 80,
    rows: 50
  });

  term.on('data', function(data) {
    console.log(data);
  });

  // term.write('ls\r');
  // term.resize(100, 40);
  // term.write('ls /\r');
}
