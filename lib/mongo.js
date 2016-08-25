var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var assert = require('assert');

var mongoUrl = 'mongodb://localhost:27017/atdata';

function getVehicleLocations(cb){
  var getQuery = function(db, callback) {
    var cursor = db.collection('vehicle_location').find().limit(1).sort({$natural:-1});
    var results = [];
    cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc != null) {
        results.push(doc)
      } else {
        if (results.length){
          callback(results[0]);
        } else {
          console.log('no results!')
          callback();
        }
      }
    });
  }
  MongoClient.connect(mongoUrl, function(err, db) {
    assert.equal(null, err);
    getQuery(db, function(data) {
      db.close();
      cb(data)
    });
  });
}
// data.entity.map(e=>e.vehicle.trip.route_id)
function getRoutes(routeIds, cb){
  var getQuery = function(db, callback) {
    var cursor = db.collection('routes').find({route_id: {$in: routeIds}}
    , {route_id: true, route_long_name: true, route_short_name: true}).toArray((err, docs)=>{
      assert.equal(err, null);
      callback(docs)
    })
  }
  MongoClient.connect(mongoUrl, function(err, db) {
    assert.equal(null, err);
    getQuery(db, function(data) {
      db.close();
      cb(data)
    });
  });
}
function indexRoute(cb){
  var indexQuery = function(db, callback) {
   db.collection('routes').createIndex(
      {route_id: 1},
      null,
      function(err, results) {
        console.log('index: ', results);
        callback();
      }
    );
  };
  MongoClient.connect(mongoUrl, function(err, db) {
    assert.equal(null, err);
    indexQuery(db, function() {
      db.close();
      cb()
    });
  });
}
function getLatestData(cb){
  getVehicleLocations(data=>{
    var routeIds = data.entity.map(e=>e.vehicle.trip.route_id)
    //indexRoute(()=>{})
    getRoutes(routeIds, routes=>{
      // convert list to dict object
      data.routes = routes.reduce((o, v)=>{
        o[v.route_id] = v
        return o
      }, {})
      cb(data)
    })
  });
}

module.exports = {
  getVehicleLocations
, getLatestData
}
