'use strict';
/*global require, module, console, __dirname, setTimeout */
/*jslint node:true */

var _ = require('underscore');
var fs = require('fs');
var path = require('path');
var util = require('util');
var moment = require('moment');
var async = require('async');
var gm = require('gm');
var mime = require('mime');
var http = require('http')

var noop = function () { };

var optimist = require('optimist')
	.usage('Usage: $0')
	.alias('v', 'env')
	.alias('s', 'sys')

	
optimist.demand(['s', 'v']);
var argv = optimist.argv;
var sys = argv.sys;
// load config based on enviroment
process.env.NODE_ENV = process.env.NODE_ENV || argv.v;

var fertilizer = require('fertilizer');

var config = fertilizer.config('config.json');


// init

config.argv=argv;
config.filename ="./workflow/flow" // module 

config.sequence = ['generateDateInit','getStart','getEvent','publish','dbClose'];

// flow
// require plugins and initialize
var _seneca = require('seneca')({ timeout:84000000 })
	.use('./plugin/db',config)
	.use('seneca-wflow',config);
// pin 
/*Alternatively, you can pin the engage role to a variable via the seneca.pin() API and call the commands as methods.

var cartpin = seneca.pin({role:'data-agg',cmd:'*'});
cartpin.create({custom1:'value1'}, callback);
*/

// start
_seneca.ready( function(err){
		if (err) { return; }
		 	// starts the workflow
		var cmd = {role : 'flowEngine', cmd : 'start'};
		_seneca.act(cmd,function(err,r){
			if (err) { return cb(err); }
				console.log("done");
				process.exit();
		})

});


