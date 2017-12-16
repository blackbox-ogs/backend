const args = ['start'];
const opts = {
  stdio: 'inherit',
  cwd: 'blackbox-ui',
  shell: true
};
require('child_process').spawn('npm', args, opts);