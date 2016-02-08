"use strict"

/**
 * @fileoverview defines the worklfow 
 * @author @litzenberger ron.litzenberger@gmail.com (ron litzenberger) 
 *
 */
var moment = require('moment');
var async = require('async');
var redis = require('redis');
var ObjectID = require('mongodb').ObjectID;

module.exports = {

		createLoop : function(seneca,next){
			var cmd = {role : 'flowEngine', cmd : 'append'};
	
			//var sequence=["nextPage","vgGet","vgTrasformation"];
			//var sequence=["nextConsole","jjGetItemsPopular","jjTrasformation"];
			var sequence=["nextConsole","jjGetTopPopular","jjTopPopularTrasformation"];
			var loop =23;
			seneca.act(cmd,{loop:loop,sequence:sequence},function(){
				console.log("createLoop done");
				return next();
			});

		},
		generateDateInit : function (seneca,next){
			console.log("Init started")
			var date = moment();
			var yesterday =moment(date).add(-1, 'days').format("YYYY-MM-DD");
			console.log("starting date: "+date.format("YYYY-MM-DD") +"  yesterday "+yesterday)
			return next(null,yesterday,date.format("YYYY-MM-DD"));
		},
		generateDateInc : function (seneca,d,y,next){
		console.log("INC started")
			var date = moment(d).add(1,'days');
			var yesterday =moment(d);
			console.log("INC starting date: "+date.format("YYYY-MM-DD") +"  yesterday "+yesterday.format("YYYY-MM-DD"))
			return next(null,date.format("YYYY-MM-DD"),yesterday.format("YYYY-MM-DD"));
		},
		getStart : function (seneca,startTime,endTime,next){
			console.log("sys "+seneca.options()['seneca-wflow'].argv.sys)
			var sys=seneca.options()['seneca-wflow'].argv.sys;
			return next(null,sys,startTime,endTime);
		},
		getEvent : function (seneca,sys,startTime,endTime,next){
			console.log("get events started")
			var cmd = {role : 'db', cmd : 'query',startTime:startTime,endTime:endTime,sys:sys};

			seneca.act(cmd,function(err,data){
				console.log("get Event done");
				return next(null,data,startTime,endTime);
			});	
		},

		publish :function(seneca,data,startTime,endTime,next){
	
			var pub = redis.createClient(seneca.options()['seneca-wflow'].redis.port, seneca.options()['seneca-wflow'].redis.host);
			pub.on('error', function (err) {
  				console.error('Redis connection error ' + err);
			});
			async.eachSeries(data,function(message,done){
				console.log('ts : '+message.ts);
				console.log('ObjectId '+message._id);
				console.log('sys ' + message.sys)
				message._id = new ObjectID();
				if(message.ts === null){
					message.ts = new Date();
				}
        		if(message.d && message.d.modified && message.d.modified.$date){
        			delete message.d.modified;
        		}

				pub.publish('logging:eventsio:' + message.sys + ':' + message.t + ':' + message.s, JSON.stringify(message));
 				pub.publish(message.t + ':' + message.s + ':' + message.sys, JSON.stringify(message))
 				console.log("message sent");
                setTimeout(function(){console.log("wait 1 sec");done()}, 1000);
                },
                        function(err) {
                        console.log('message notification done total:');
                        next();
                        });


		},
		dbClose : function (seneca,next){
			seneca.act({role : 'mongoDb', cmd : 'close'},function(err){
			if (err) { return cb(err); }
			next(null,null);
			}
			);
		}
}