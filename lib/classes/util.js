'use babel';

import pty from 'pty.js';
import fs from 'fs';

export function read_json(file) {
  try {
    const json = fs.readFileSync(file, 'utf8');
    return JSON.parse(json);
  } catch (e) {
    // TODO: propagate
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
    // TODO: propagate
    console.log(e);
    return false;
  }
}

export function exec(dir, executable, args) {
  args = args || [];

  let term = pty.spawn(executable, args, {
    name: 'xterm-color',
    cols: 80,
    rows: 50,
    cwd: dir
  });

  return term;
}

export function signal_name(signal_number) {
  return [
    null,
    'SIGHUP',
    'SIGINT',
    'SIGQUIT',
    'SIGILL',
    'SIGTRAP',
    'SIGABRT',
    'SIGEMT',
    'SIGFPE',
    'SIGKILL',
    'SIGBUS',
    'SIGSEGV',
    'SIGSYS',
    'SIGPIPE',
    'SIGALRM',
    'SIGTERM',
    'SIGUSR1',
    'SIGUSR2',
    'SIGCHLD',
    'SIGPWR',
    'SIGWINCH',
    'SIGURG',
    'SIGPOLL',
    'SIGSTOP',
    'SIGTSTP',
    'SIGCONT',
    'SIGTTIN',
    'SIGTTOU',
    'SIGVTALRM',
    'SIGPROF',
    'SIGXCPU',
    'SIGXFSZ',
    'SIGWAITING',
    'SIGLWP',
    'SIGAIO'
  ][signal_number] || '???';
}
