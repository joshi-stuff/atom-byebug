"use babel";

import Widget from './widget';

export default class DebuggerView extends Widget {
  constructor() {
    super(DebuggerView.HTML);
  }
}

DebuggerView.HTML =
  `
  <div class="padded">
    <div class="inset-panel">
      <div class="panel-heading">Byebug debugger</div>
        <div class="panel-body">
          <div class="padded button-bar">
            <div class="btn-group">
                <button class="btn icon icon-playback-play" title="Run (F8)">
                  Run
                </button>
                <button class="btn icon icon-jump-right disabled"
                        title="Step over (F10)">
                  Step over
                </button>
                <button class="btn icon icon-sign-in disabled"
                        title="Step into (F11)">
                  Step into
                </button>
                <!--
                <button class="btn icon icon-stop">
                  Stop
                </button>
                -->
            </div>
            <button class="btn icon icon-gear">
              Configure
            </button>
          </div>
          <ul class="tab-bar inset-panel">
            <li class="tab active"><div class="title">Call stack</div></li>
            <li class="tab"><div class="title">Variables</div></li>
            <li class="tab"><div class="title">Breakpoints</div></li>
          </ul>
          <div class="tab-body" id="call-stack">
            Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
            Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
            Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
            Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
            Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
            Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
            Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
            Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
            Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
            Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
            Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
            Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
            Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
            Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
            Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
            Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
          </div>
        </div>
      </div>
    </div>
  </div>
  `;
