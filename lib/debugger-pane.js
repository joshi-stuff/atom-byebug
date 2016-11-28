'use babel';

import Widget from './widget';

export default class DebuggerPane extends Widget {
  constructor() {
    super(DebuggerPane.HTML);
    this._pre = this._child('pre');
    this._input = this._child('input');

    this._install_input_handler();
  }

  clear() {
    this._pre.html('');
  }

  print(msg) {
    this._pre.html(this._pre.html() + msg);
    this._pre.scrollTop(this._pre.prop('scrollHeight'));
  }

  _install_input_handler() {
    this._input.keyup((ev) => {
      if(ev.keyCode == 13) {
        this._send_line();
      }
    });
  }

  _send_line() {
    this.emit(DebuggerPane.EVENT.SEND_LINE, this._input.val());
    this._input.val('');
  }
}

DebuggerPane.EVENT = {
  SEND_LINE: 'send_line'
};

DebuggerPane.HTML = `
  <pre></pre>
  <input type="text"></input>
`;
