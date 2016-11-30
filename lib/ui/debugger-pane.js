'use babel';

import Widget from './widget';

export default class DebuggerPane extends Widget {
  constructor() {
    super(DebuggerPane.HTML);
    this._content = this._child('.content');
    this._input = this._child('input');

    this._install_input_handler();
  }

  clear() {
    this._content.html('');
  }

  print(msg) {
    this._content.append(msg.replace('\n', '<br>'));
    this._content.scrollTop(this._content.prop('scrollHeight'));
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
  <div class="content" style="font-family: monospace;"></div>
  <input type="text"></input>
`;
