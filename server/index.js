#!/usr/bin/env node

var backend = require('./src/index.js');
var config = require('./config');
var pkg = require('./package');

config.appVersion = pkg.version;

backend.boot(config);