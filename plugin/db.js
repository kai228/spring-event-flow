"use strict"
/**
 * @fileoverview rets import.
 * @author @litzenberger rlitzenberger@solidearth.com (ron litzenberger) 
 *
 */


var _ = require('underscore');
var util = require('util');
var path = require('path');
var uuid = require('node-uuid');
var fs = require('fs');

module.exports = function( options) {

	var seneca = this;
	var config = options;

	var noop = function () {};
	var plugin = "db";
	var MongoProvider = require('../lib/MongoProvider');
	var MongoStore = require('../lib/MongoStore');
	var eventClient,
		statsClient;
	// init seneca plugins
	seneca.add('init:db',init);
	seneca.add({role : plugin,cmd : 'close'}, close);// store in a collection 
	seneca.add({role : plugin,cmd : 'query'}, query);// 

	// store in a collection 

	// initialize
	function init (args,cb) {
		var seneca = this;
		MongoProvider.data(config.mongo_connection,config.mongo_options,function(err,db){
			if (err){cb(err)}
				eventClient = new MongoStore(db);
				return cb();

 		}); // end mongo provider
	}

	function close (args,cb) {
		var seneca = this;
		MongoProvider.close();
		cb();
	}

	function query(args,cb){
		var seneca = this;
		//TODO use async.series
		seneca.log.debug("-- start listings agg --");
		eventClient.use("events",function(){
			eventClient.getEvent(args.sys,args.startTime,args.endTime,function(err,results) {
				if(err){return cb(err)}

					cb(null,results);

			});
		})
	}

	return {
		name:plugin
	}

}