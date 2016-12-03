'use babel';

import Handler from './handler';

export default class DefaultHandler extends Handler {
  constructor(byebug, port) {
    super(byebug, port);

    // TODO: handle this for both sockets in base Handler
    this._socket.on('connect', () => {this._byebug.emit(DefaultHandler.EVENT.CONNECTED)});
    this._socket.on('close', (had_error) => {this._byebug.emit(DefaultHandler.EVENT.DISCONNECTED)});

    this._current_file = '';
    this._current_line = 0;
    this._active_command = null;
  }

  _on_line(line) {
    if (/^\[.*\] in .*$/.test(line)) {
      this._on_current_file(line);
    } else if (line.indexOf('=>') == 0) {
      this._on_current_line(line);
    }
  }

  _on_enter_prompt() {
    this.emit(DefaultHandler.EVENT.ENTER_PROMPT, this._current_file, this._current_line);
  }

  _on_exit_prompt() {
    this.emit(DefaultHandler.EVENT.EXIT_PROMPT);
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

DefaultHandler.EVENT = {
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  ENTER_PROMPT: 'enter_prompt',
  EXIT_PROMPT: 'exit_prompt'
};
Object.assign(DefaultHandler.EVENT, Handler.EVENT)
