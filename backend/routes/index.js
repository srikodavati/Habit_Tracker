module.exports = function (app, router) {
	app.use('/api', require('./habits')(router));
	app.use('/api', require('./users')(router));
	app.use('/api', require('./friends')(router));

};
