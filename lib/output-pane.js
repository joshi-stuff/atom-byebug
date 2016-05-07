"use babel";

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
    // TODO: scroll to end if scroll is at the end
    this._pre.html(this._pre.html() + msg);
  }
}

OutputPane.HTML =
  `<pre></pre>`;
