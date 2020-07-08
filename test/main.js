var Docker = require('dockerode');

var docker = new Docker();

docker.run('ubuntu', ['bash', '-c', 'uname -a'], process.stdout, function (err, data, container) {
	  console.log(container);
});
