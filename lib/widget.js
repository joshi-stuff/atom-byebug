"use babel";

import { $ } from 'atom-space-pen-views';

export default class Widget {
  constructor(html) {
    this._type = this.__proto__.constructor.name;
    this._node = $.parseHTML(`<div class="${this.type}">${html}</div>`)[0];
    this._panel = null;
  }

  get type() {
    return this._type;
  }

  addToPanel(position, options = {}) {
    if (this._panel != null) {
      throw new Error('Panel already instantiated');
    }

    options.item = this._node;

    switch (position) {
      case 'left':
        this._panel = atom.workspace.addLeftPanel(options);
        break;

      case 'top':
        this._panel = atom.workspace.addTopPanel(options);
        break;

      case 'right':
        this._panel = atom.workspace.addRightPanel(options);
        break;

      case 'bottom':
        this._panel = atom.workspace.addBottomPanel(options);
        break;

      default:
        throw new Error(`Invalid position: '${position}'`);

    }
  }

  destroy() {
    this._panel.destroy();
  }

}