var express = require('express');
var router = express.Router();
var async = require('async');
var fs = require('fs')
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var assert = require('assert');

var mongoUrl = 'mongodb://localhost:27017/atdata';

router.get('/data', function(req, res, next) {
  var center = {lat: -36.844784, lng: 174.758700};
  fs.readFile('data/realtime_vehicle-locations.json', 'utf-8', (err, data) => {
    if (err){
      console.error(err);
      return res.status(400).json(err)
    }
    console.log(data);
    return res.send(data)
  });
});
router.get('/livedata', function(req, res, next) {
  var center = {lat: -36.844784, lng: 174.758700};
  fs.readFile('data/realtime_vehicle-locations.json', 'utf-8', (err, data) => {
    if (err){
      console.error(err);
      return res.status(400).json(err)
    }
    console.log(data);
    return res.send(data)
  });
});
module.exports = router;

