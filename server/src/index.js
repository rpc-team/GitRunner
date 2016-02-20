var express = require('express');
var app = express();

var handlers = require('./handlers');

var GitHubAPI = require('github');

app.exposeEndpoints = function() {

    app.get('/', function(req, res) {
        res.end('GitRunner Backend!');
    });

    /*
    app.get(_ENDPOINT_, handlers._MyHandlerMethod_)

    e.g.
    */
    app.get('/version', handlers.version);

    app.get('/health', handlers.health);
};

app.initGitHub = function() {
    var github = new GitHubAPI({
        version: '3.0.0',
        debug: app.locals.github.debug,
        protocol: app.locals.github.protocol,
        timeout: app.locals.github.timeout || 30000,
        headers: {
            'user-agent': app.locals.github.userAgent + ' v' + app.locals.appVersion
        }
    });

    github.authenticate({
        type: 'basic',
        username: process.env.GITHUB_USERNAME,
        password: process.env.GITHUB_OAUTH_TOKEN
    });

    handlers.setGitHub(github);
};

exports.boot = function(config) {
    app.locals.httpServer = config.httpServer;
    app.locals.github = config.github;
    app.locals.appVersion = config.appVersion;

    app.exposeEndpoints();
    app.initGitHub();

    app.listen(config.httpServer.port, function() {
        console.log('httpServer started at ' + config.httpServer.port);
    });
};