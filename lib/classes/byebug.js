'use babel';

import { EventEmitter } from 'events';
import net from 'net';

export default class Byebug {
  constructor(port = 8989, control_port = null) {
    this._port = port;
    this._control_port = control_port || (port + 1);
    this._ee = new EventEmitter();

    window.setTimeout(() => {
      this._control_handler = new ControlHandler(this, this._control_port);
      this._default_handler = new DefaultHandler(this, this._port);
    }, 2000);
  }

  destroy() {
    if(this._control_handler) {
      this._control_handler.destroy();
      this._control_handler = null;
    }

    if(this._default_handler) {
      this._default_handler.destroy();
      this._default_handler = null;
    }
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

  send(line) {
    this._default_handler.send(line);
  }
}

Byebug.EVENT = {
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  ENTER_PROMPT: 'enter_prompt',
  EXIT_PROMPT: 'exit_prompt',
  SENT: 'sent',
  RECEIVED: 'received'
};

class Handler {
  constructor(byebug, port) {
    this._byebug = byebug;
    this._in_prompt = false;
    this._data = '';

    this._socket = net.connect({
      family: 6,
      host: 'localhost',
      port: port,
      readable: true,
      writable: true
    });
    this._socket.on('data', (data) => {this._on_data(data)});
  }

  destroy() {
    this._socket.destroy();
    this._socket = null;
  }

  send(line) {
    if (!this._in_prompt) {
      throw new Error('Currently not in prompt');
    }

    this._in_prompt = false;
    this._on_exit_prompt();

    this._socket.write(`${line}\n`);
    this._emit(Byebug.EVENT.SENT, line);
  }

  _on_data(data) {
    this._data += data;

    let end_of_data = this._data.indexOf('\n');
    while (end_of_data != -1) {
      const line = this._data.substring(0, end_of_data);
      this._data = this._data.substring(end_of_data + 1);

      if (line.indexOf('PROMPT') == 0) {
        this._in_prompt = true;
        this._on_enter_prompt();
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

  _on_enter_prompt() {
  }

  _on_exit_prompt() {
  }
}

// TODO: implement ControlHandler
class ControlHandler extends Handler {
  constructor(byebug, port) {
    super(byebug, port);
  }
}

class DefaultHandler extends Handler {
  constructor(byebug, port) {
    super(byebug, port);

    // TODO: handle this for both sockets in base Handler
    this._socket.on('connect', () => {this._byebug.emit(Byebug.EVENT.CONNECTED)});
    this._socket.on('close', (had_error) => {this._byebug.emit(Byebug.EVENT.DISCONNECTED)});

    this._current_file = '';
    this._current_line = 0;
  }

  get current_file() {
    return this._current_file;
  }

  get current_line() {
    return this._current_line;
  }

  _on_line(line) {
    console.log('_on_line', line);

    if (/^\[.*\] in .*$/.test(line)) {
      this._on_current_file(line);
    } else if (line.indexOf('=>') == 0) {
      this._on_current_line(line);
    }
  }

  _on_enter_prompt() {
    console.log('_on_enter_prompt');

    this._emit(Byebug.EVENT.ENTER_PROMPT);
  }

  _on_exit_prompt() {
    console.log('_on_exit_prompt');

    this._emit(Byebug.EVENT.EXIT_PROMPT);
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
