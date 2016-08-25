var express = require('express');
var router = express.Router();
var async = require('async');
var fetch = require('node-fetch');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {title: 'Bus Data', page: 'home'});
});
router.get('/chat', function(req, res, next) {
  res.render('chat', { title: 'Socket.IO Chat' });
});

module.exports = router;
