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
    this._default_handler.on(Handler.EVENT.LINE, (line) => {
      this.emit(Byebug.EVENT.RECEIVED, line);
    });
    this._default_handler.on(Handler.EVENT.SENT, (data) => {
      this.emit(Byebug.EVENT.SENT, data);
    });

    return this;
  }

  on(event_name, callback) {
    this._ee.on(event_name, callback);
  }

  emit(event_name, ...args) {
    this._ee.emit(event_name, ...args);
  }

  next() {
    this._default_handler.next();
  }

  step() {
    this._default_handler.step();
  }
}

Byebug.EVENT = {
  RECEIVED: 'received',
  SENT: 'sent',
  ENTER_PROMPT: 'enter_prompt',
  EXIT_PROMPT: 'exit_prompt'
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

    this._ee = new EventEmitter();
  }

  on(event_name, callback) {
    this._ee.on(event_name, callback);
  }

  emit(event_name, ...args) {
    this._ee.emit(event_name, ...args);
  }

  send(data) {
    if (!this._in_prompt) {
      throw new Error('Currently not in prompt');
    }

    this._in_prompt = false;
    this.emit(Handler.EVENT.EXIT_PROMPT);

    this._socket.write(`${data}\n`);
    this.emit(Handler.EVENT.SENT, data);
  }

  _on_data(data) {
    this._data += data;

    let end_of_data = this._data.indexOf('\n');
    while (end_of_data != -1) {
      const line = this._data.substring(0, end_of_data);
      this._data = this._data.substring(end_of_data + 1);

      if (line.indexOf('PROMPT') == 0) {
        this.emit(Handler.EVENT.ENTER_PROMPT);
        this._in_prompt = true;
      } else {
        this.emit(Handler.EVENT.LINE, line);
        this._on_line(line);
      }

      end_of_data = this._data.indexOf('\n');
    }
  }

  _on_line(line) {
    throw new Error(`No handler defined for line '${line}'`);
  }
}

Handler.EVENT = {
  LINE: 'line',
  SENT: 'sent',
  ENTER_PROMPT: 'enter_prompt',
  EXIT_PROMPT: 'exit_prompt'
};

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

  next() {
    this.send('next');
  }

  step() {
    this.send('step');
  }

  _on_line(line) {
    if (/^\[.*\] in .*$/.test(line)) {
      this._on_current_file(line);
    } else if (line.indexOf('=>') == 0) {
      this._on_current_line(line);
    }
  }

  _on_current_file(line) {
    const i = line.indexOf(' in ');
    this._current_file = line.substring(i + 4);
  }

  _on_current_line(line) {
    const i = line.indexOf(':');
    this._current_line = parseInt(line.substring(3, i));
  }
}
