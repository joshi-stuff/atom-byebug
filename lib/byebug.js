'use babel';

import { EventEmitter } from 'events';
import net from 'net';

export default class Byebug {
  constructor(port = 8989, control_port = null) {
    this._port = port;
    this._control_port = control_port || (port + 1);
    this._ee = new EventEmitter();
  }

  connect() {
    this._control_handler = new ControlHandler(this, net.connect({
      family: 6,
      host: 'localhost',
      port: this._control_port,
      readable: true,
      writable: true
    }));

    this._default_handler = new DefaultHandler(this, net.connect({
      family: 6,
      host: 'localhost',
      port: this._port,
      readable: true,
      writable: true
    }));

    return this;
  }

  on(event_name, callback) {
    this._ee.on(event_name, callback);
  }

  emit(event_name, ...args) {
    this._ee.emit(event_name, ...args);
  }

  get current_file() {
    return this._default_handler.current_file;
  }

  get current_line() {
    return this._default_handler.current_line;
  }

  next() {
    this._default_handler.next();
  }

  step() {
    this._default_handler.step();
  }

  send(line) {
    this._default_handler.send(line);
  }
}

Byebug.EVENT = {
  RUNNING: 'running',
  STOPPED: 'stopped',
  SENT: 'sent',
  RECEIVED: 'received'
};

class Handler {
  constructor(byebug, socket) {
    this._byebug = byebug;
    this._socket = socket;

    this._in_prompt = false;

    this._data = '';
    this._socket.on('data', (data) => {
      this._on_data(data);
    });
  }

  send(line) {
    if (!this._in_prompt) {
      throw new Error('Currently not in prompt');
    }

    this._in_prompt = false;
    this._socket.write(`${line}\n`);
    this._emit(Byebug.EVENT.SENT, line);
    this._emit(Byebug.EVENT.RUNNING);
  }

  _on_data(data) {
    this._data += data;

    let end_of_data = this._data.indexOf('\n');
    while (end_of_data != -1) {
      const line = this._data.substring(0, end_of_data);
      this._data = this._data.substring(end_of_data + 1);

      if (line.indexOf('PROMPT') == 0) {
        this._in_prompt = true;
        this._on_prompt();
      } else {
        this._emit(Byebug.EVENT.RECEIVED, line);
        this._on_line(line);
      }

      end_of_data = this._data.indexOf('\n');
    }
  }

  _emit(event_name, ...args) {
    this._byebug.emit(event_name, ...args);
  }

  _on_line(line) {

  }

  _on_prompt() {

  }
}

// TODO: implement ControlHandler
class ControlHandler extends Handler {
  constructor(byebug, socket) {
    super(byebug, socket);
  }
}

class DefaultHandler extends Handler {
  constructor(byebug, socket) {
    super(byebug, socket);

    this._current_file = '';
    this._current_line = 0;
  }

  get current_file() {
    return this._current_file;
  }

  get current_line() {
    return this._current_line;
  }

  next() {
    this.send('next');
  }

  step() {
    this.send('step');
  }

  _on_line(line) {
    console.log('_on_line', line);

    if (/^\[.*\] in .*$/.test(line)) {
      this._on_current_file(line);
    } else if (line.indexOf('=>') == 0) {
      this._on_current_line(line);
    }
  }

  _on_prompt() {
    console.log('_on_prompt');

    this._emit(Byebug.EVENT.STOPPED);
  }

  _on_current_file(line) {
    console.log('_on_current_file', line);

    const i = line.indexOf(' in ');
    this._current_file = line.substring(i + 4);
  }

  _on_current_line(line) {
    console.log('_on_current_line', line);

    const i = line.indexOf(':');
    this._current_line = parseInt(line.substring(3, i));
  }
}
