'use babel';

import Widget from './widget';

export default class OutputPane extends Widget {
  constructor() {
    super(OutputPane.HTML);
    this._pre = this._child('pre');
  }

  clear() {
    this._pre.html('');
  }

  print(msg) {
    this._pre.html(this._pre.html() + msg);
    this._element.scrollTop(this._element.prop('scrollHeight'));
  }
}

OutputPane.HTML = '<pre></pre>';
