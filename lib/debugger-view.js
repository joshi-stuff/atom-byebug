"use babel";

import { $ } from 'atom-space-pen-views';

import Widget from './widget';
import OutputPane from './output-pane'

export default class DebuggerView extends Widget {
  constructor() {
    super(DebuggerView.HTML);
    this._tab_body = this.child('.tab-body');
    this._panes = {
      output: new OutputPane(),
    };

    this._add_panes_to_dom();
    this._install_tab_selection_handler();

    this.selected_tab = 'output';
  }

  get output() {
    return this._panes['output'];
  }

  get call_stack() {
    return this._panes['call_stack'];
  }

  get variables() {
    return this._panes['variables'];
  }

  get breakpoints() {
    return this._panes['breakpoints'];
  }

  set selected_tab(tab_id) {
    this.child('.tab').removeClass('active');
    this.child(`.tab[data-tab=${tab_id}]`).addClass('active');

    this._for_each_pane((pane) => {
      pane.visible = false;
    });
    this._panes[tab_id].visible = true;
  }

  _add_panes_to_dom() {
    this._for_each_pane((pane) => {
      pane.appendTo(this._tab_body);
    });
  }

  _install_tab_selection_handler() {
    this.child('.tab').click((ev) => {
      const li = $(ev.target).parent();
      this.selected_tab = li.data('tab');
    });
  }

  _for_each_pane(callback) {
    for (let id in this._panes) {
      callback(this._panes[id]);
    }
  }
}

DebuggerView.HTML =
  `
  <div class="padded">
    <div class="inset-panel">
      <div class="button-bar header">
        <button class="btn title" title="Open Byebug Debugger Site">
          Byebug Debugger
        </button>
        <div class="btn-group inline-block">
          <button class="btn icon icon-playback-play" title="Run (F8)">
            Run
          </button>
          <button disabled class="btn icon icon-jump-right disabled" title="Step over (F10)">
            Next
          </button>
          <button disabled class="btn icon icon-steps disabled" title="Step into (F11)">
            Step
          </button>
          <button disabled class="btn icon icon-stop disabled">
            Stop
          </button>
        </div>
        <button class="btn icon icon-gear">
          Configure project
        </button>
      </div>
      <div class="panel-body">
        <ul class="tab-bar inset-panel">
          <li class="tab active" data-tab="output"><div class="title">Output</div></li>
          <li class="tab" data-tab="call_stack"><div class="title">Call stack</div></li>
          <li class="tab" data-tab="variables"><div class="title">Variables</div></li>
          <li class="tab" data-tab="breakpoints"><div class="title">Breakpoints</div></li>
        </ul>
        <div class="tab-body"></div>
      </div>
    </div>
  </div>
  `;
