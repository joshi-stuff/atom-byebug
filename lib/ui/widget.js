'use babel';

import { $ } from 'atom-space-pen-views';

import EventHandler from '../classes/event-handler';

export default class Widget {
  constructor(html) {
    this._type = this.__proto__.constructor.name;
    this._node = $.parseHTML(`<div class="${this.type}">${html}</div>`)[0];
    this._element = $(this._node);
    this._panel = null;
    this._eh = new EventHandler();
  }

  get type() {
    return this._type;
  }

  get visible() {
    return this._element.is(':visible');
  }

  set visible(visible) {
    if (visible) {
      this._element.show();
    } else {
      this._element.hide();
    }
  }

  on(event_name, callback) {
    this._eh.on(event_name, callback);
  }

  emit(event_name, ...args) {
    this._eh.emit(event_name, ...args);
  }

  appendTo(node) {
    this._element.appendTo($(node));
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

  _child(selector) {
    return $(selector, this._element);
  }
}
