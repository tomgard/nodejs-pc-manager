const Service = require('node-windows').Service;

const password = process.argv[2];
if (!password) {
  console.error('Usage: node windows-service.js <password>');
  process.exit(1);
}
const svc = new Service({
  name: 'Toms Pc manager',
  description: 'Node.js app to manage a pc via the browser',
  script: 'app.js',
  username: '',
  password: password
});

if (svc.exists) {
  svc.stop(() => {
    svc.uninstall(() => {
      installService();
    });
  });
} else {
  installService();
}
function installService() {
  svc.on('install', () => {
    svc.start();
  });
  svc.install();
}
