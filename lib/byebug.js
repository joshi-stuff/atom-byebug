"use babel";

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

  _on_data(data) {
    console.log(`on_data: ${data}`);
  }

  _on_control_data(data) {
    console.log(`on_control_data: ${data}`);
  }
}

class Handler {
  constructor(byebug, socket) {
    this._byebug = byebug;
    this._data = '';

    socket.on('data', (data) => {
      this._on_data(data);
    });
  }

  _on_data(data) {
    console.log(data.toString());

    this._data += data;

    let end_of_data = this._data.indexOf('\n');
    while (end_of_data != -1) {
      const line = this._data.substring(0, end_of_data);
      this._data = this._data.substring(end_of_data + 1);
      this._on_line(line);
      end_of_data = this._data.indexOf('\n');
    }
  }

  _on_line(line) {
    throw 'Pure virtual function called';
  }
}

class ControlHandler extends Handler {
  constructor(byebug, socket) {
    super(byebug, socket);
  }

  _on_line(line) {
    // TODO: do something with this
  }
}

class DefaultHandler extends Handler {
  constructor(byebug, socket) {
    super(byebug, socket);
  }

  _on_line(line) {
    if (/^\[.*\] in .*$/.test(line)) {
      this._on_current_file(line);
    } else if (line.indexOf('=>') == 0) {
      this._on_current_line(line);
    } else if (line.indexOf('PROMPT') == 0) {
      this._on_prompt();
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

  _on_prompt() {
    alert(this._current_file + ":" + this._current_line);
  }
}
