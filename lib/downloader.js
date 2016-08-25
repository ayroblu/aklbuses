var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var fetch = require('node-fetch')

var mongoUrl = 'mongodb://localhost:27017/atdata';

// node script to download
//var apiKey = '34893bb6-1d38-4403-923b-f3892de693e4'

function getVehicleLocations(){
  var url = 'https://api.at.govt.nz/v1/public/realtime/vehiclelocations?api_key=34893bb6-1d38-4403-923b-f3892de693e4'
  fetch(url).then(res=>{
    if (res.ok)
      return res.json()
    console.error(res)
  }).then(json=>{
    saveVehicleLocations(json.response)
  }).catch(err=>{
    console.error(err)
  })
}
var saveVehicleLocations = function(data){
  var insertVehicleLocations = function(db, data, callback) {
    db.collection('vehicle_location').insertOne(data, function(err, result) {
      assert.equal(err, null);
      console.log("Inserted a document into the vehicle_location collection.");
      callback();
    });
  };
  MongoClient.connect(mongoUrl, function(err, db) {
    assert.equal(null, err);
    insertVehicleLocations(db, data, function() {
      db.close();
    });
  });
}

module.exports = {
  getVehicleLocations
}
