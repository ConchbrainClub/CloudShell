var Docker = require('dockerode');

var docker = new Docker({
	protocol:'http',
	host: '127.0.0.1', 
	port: 3000
});
