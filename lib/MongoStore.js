/**
 * store transform generated object into mongo db
 *
 * @param obj - object to import/save (generated by the transform)
 * @param type - import type 'Agent', 'Office', 'Listing' (must have a corresponding json schema file
 *    and a corresponding mongo collection in TypeCollectionMap)
 * @param mapping - { the mapping }
 * @param opts - { forced: true to force update records }
 * @param cb - callback
 */
var _ = require('underscore');
 var db_provider = require('../lib/MongoProvider');
var async = require('async');
var moment = require('moment');

var MongoStore = function (db) {
  if (!(this instanceof MongoStore))
	return new MongoStore(db);
	this.db=db;
};

MongoStore.prototype.use = function(collection,cb){
  var self=this;
  self.collection=collection;
  return cb();
};



MongoStore.prototype.getEvent = function (sys,startTime,endTime,cb){
	var self=this;
	var query={
		sys:sys,
		ts:{$gte:new Date(startTime),$lte:new Date(endTime)},
		s:{$in:['vue','pc','addfav','ns','f','favc']}

	}
	console.log(query);
	self.db.collection(self.collection).find(query).toArray(function(err,data){
				if(err){return cb(err)}
				if(data ===null){return cb(new Error("no data"))};
				cb(null,data);
		});
}





module.exports= MongoStore;