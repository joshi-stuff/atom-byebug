'use babel';

import { check_access, read_json } from '../classes/util'

export function get_executable_config() {
  // TODO: handle several paths
  const path = atom.project.getPaths()[0];
  const config_path = `${path}/.atom-byebug`;
  const config_file = `${config_path}/config.json`

  if (!check_access(config_file, 'r')) {
    alert('Configuration file is not readable or does not exist');
    return;
  }

  const config = read_json(config_file);

  if (!config.executable) {
    alert('Configuration does not define any executable');
    return;
  }

  const executable = `${config_path}/${config.executable}`

  if (!check_access(executable, 'x')) {
    alert('Configured executable has no execution permissions');
    return;
  }

  return {
    dir: config_path,
    executable: executable,
    arguments: config.arguments
  };
}
