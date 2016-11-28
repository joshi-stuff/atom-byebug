'use babel';

let current_line_marker = null;

export function begin_debug(view) {
  reset_ui(view, true);
}

export function enter_prompt(byebug) {
  show_current_line(byebug);
}

export function end_debug(view) {
  reset_ui(view, false);
  hide_current_line();
}

function reset_ui(view, begin) {
  if (begin) {
    view.enable_button('run', false);
    view.enable_button('next', false);
    view.enable_button('step', false);
    view.enable_button('stop', false);
  } else {
    view.enable_button('run', true);
    view.enable_button('next', false);
    view.enable_button('step', false);
    view.enable_button('stop', false);
    hide_current_line();
  }
}

function show_current_line(byebug) {
  hide_current_line();

  atom.workspace.open(byebug.current_file, {
    initialLine: byebug.current_line-1,
    pending: true
  }).then((text_editor) => {
    current_line_marker = text_editor.markBufferRange([
      [byebug.current_line-1, 0],
      [byebug.current_line, 0]
    ], {
      persistent: false,
      invalidate: 'never'
    });

    text_editor.decorateMarker(current_line_marker, {
      type: 'line',
      class: 'byebug-current-line'
    });
  });
}

function hide_current_line() {
  if(current_line_marker) {
    current_line_marker.destroy();
    current_line_marker = null;
  }
}
