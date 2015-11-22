var config = {app:{}, api:{}};
config.app.name = 'default';
config.app.port = 3000;
config.app.logger = 'dev';
config.app.secret = 'you suck!';
config.app.token_lifetime = 240; //in minutes

var development = JSON.parse(JSON.stringify(config));
development.app.mode = 'development';
development.app.port = 3000;

module.exports = {
	development: development
}
