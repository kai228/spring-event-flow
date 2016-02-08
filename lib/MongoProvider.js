
var MongoClient = require('mongodb').MongoClient;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;
var _ = require('underscore');

var MongoProvider = function () {
  if (!(this instanceof MongoProvider))
	return new MongoProvider();

  this.db={};// data db
  this.mdb={};// media db


};

MongoProvider.prototype.data= function(connection,options,cb) {
  var self=this
  MongoClient.connect(connection,options,function(err,db){
	if(err){return cb(err);}
	self.db=db;


	return cb(null,db);

  });
};

MongoProvider.prototype.events= function(connection,options,cb) {
  var self=this
  console.log(connection);
  console.log(options);
  MongoClient.connect(connection,options,function(err,db){
	if(err){cb(err);}
	self.mdb=db;

	return cb(null,db);

  });
};

MongoProvider.prototype.getDb= function() {
	var self=this;
  return self.db;
};

MongoProvider.prototype.getMediaDb= function() {
	var self=this;
  return self.mdb;
};

MongoProvider.prototype.close= function() {
	var self=this;
	self.db.close(true,function (err) {
        if (err) console.error(err);
        else console.log("RSdata close complete")});
	self.db={};  // start garbage collection
	return;
};


MongoProvider.prototype.getCollection= function(collection,cb) {
var self=this;
 self.db.collection(collection, function(error, col) {
	if( error ) {
	  cb(error);
	}
	else {
	  cb(null, col);
	}
  });

};

module.exports= new MongoProvider();