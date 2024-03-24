const Service = require('node-windows').Service;
const svc = new Service({
  name: 'Toms Pc manager',
  description: 'Node.js app to manage a pc via the browser',
  script: 'app.js'
});
svc.on('install', () => {
  svc.start();
});
svc.install();