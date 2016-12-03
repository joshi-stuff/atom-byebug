'use babel';

import net from 'net';

import EventHandler from '../event-handler';

export default class Handler {
  constructor(byebug, port) {
    this._eh = new EventHandler();
    this._in_prompt = false;
    this._data = '';

    this._byebug = byebug;
    this._socket = net.connect({
      family: 6, host: 'localhost', port: port, readable: true, writable: true
    });
    this._socket.on('data', (data) => {this._on_data(data)});
  }

  destroy() {
    this._socket.destroy();
    this._socket = null;
  }

  on(event_name, callback) {this._eh.on(event_name, callback)}
  emit(event_name, ...args) {this._eh.emit(event_name, ...args)}
  removeListener(event_name, listener) {this._eh.removeListener(event_name, listener)}

  send(line) {
    if (!this._in_prompt) {
      throw new Error('Currently not in prompt');
    }

    this._in_prompt = false;
    this._on_exit_prompt();

    this._socket.write(`${line}\n`);
    this.emit(Handler.EVENT.SENT, line);
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
        this.emit(Handler.EVENT.RECEIVED, line);
        this._on_line(line);
      }

      end_of_data = this._data.indexOf('\n');
    }
  }

  _on_line(line) {
  }

  _on_enter_prompt() {
  }

  _on_exit_prompt() {
  }
}

Handler.EVENT = {
  SENT: 'sent',
  RECEIVED: 'received'
};
