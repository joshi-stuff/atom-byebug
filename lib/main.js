'use babel';

import { CompositeDisposable } from 'atom';

import Application from './app/app'

const commands = new CompositeDisposable();
let app;

export function activate(/*state*/) {
  app = new Application();

  register_command(toggle, 'toggle');
  register_command(run, 'run');
  register_command(next, 'next');
  register_command(step, 'step');
  register_command(stop, 'stop');
  register_command(clear, 'clear');
  register_command(configure, 'configure');
}

export function deactivate() {
  app.destroy();
  commands.dispose();
}

export function toggle() {
  app.toggle();
}

export function run() {
  app.run();
}

export function next() {
  app.next();
}

export function step() {
  app.step();
}

export function stop() {
  app.stop();
}

export function clear() {
  app.clear();
}

export function configure() {
  app.configure();
}

function register_command(method, cmd) {
  commands.add(
    atom.commands.add(
      'atom-workspace', `atom-byebug:${cmd}`, method
    )
  );
}
