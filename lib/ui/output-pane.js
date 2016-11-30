'use babel';

import Widget from './widget';

export default class OutputPane extends Widget {
  constructor() {
    super(OutputPane.HTML);
    this._content = this._child('.content');
  }

  clear() {
    this._content.html('');
  }

  print(msg) {
    this._content.append(msg.replace('\n', '<br>'));
    this._element.scrollTop(this._element.prop('scrollHeight'));
  }
}

OutputPane.HTML = '<div class="content" style="font-family: monospace;"></div>';
