'use babel';

import EventHandler from './event-handler';
import DefaultHandler from './byebug/default-handler';
import ControlHandler from './byebug/control-handler';
import WhereCommand from './byebug/where-command';

export default class Byebug {
  constructor(port = 8989, control_port = null) {
    this._eh = new EventHandler();
    this._port = port;
    this._control_port = control_port || (port + 1);

    window.setTimeout(() => {
      this._control_handler = new ControlHandler(this, this._control_port);

      this._default_handler = new DefaultHandler(this, this._port);
      this._repeat_default_handler_events();
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

  on(event_name, callback) {this._eh.on(event_name, callback)}
  emit(event_name, ...args) {this._eh.emit(event_name, ...args)}

  next() {this._send('next')}
  step() {this._send('step')}
  continue() {this._send('continue')}

  send(line) {this._send(line)}

  where() {return this._run(WhereCommand)}

  _send(line) {
    this._default_handler.send(line)
  }

  _run(CommandClass) {
    this._eh.disable();
    return new CommandClass(this._default_handler).run().then((result) => {
      this._eh.enable();
      return result;
    });
  }

  _repeat_default_handler_events() {
    ['CONNECTED', 'DISCONNECTED', 'ENTER_PROMPT', 'EXIT_PROMPT', 'SENT', 'RECEIVED'].forEach(
      (event_name) => {
        this._eh.repeat(
          this._default_handler, DefaultHandler.EVENT[event_name], Byebug.EVENT[event_name]
        );
      }
    );
  }
}

Byebug.EVENT = {
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  ENTER_PROMPT: 'enter-prompt',
  EXIT_PROMPT: 'exit-prompt',
  SENT: 'sent',
  RECEIVED: 'received'
};
