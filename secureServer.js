var fs = require('fs')
, http = require('http')
, https = require('https')
, app = require('./app')
 
 var redir = http.createServer(function(req, res){
  if (req.url.indexOf('.well-known') > -1) {
    serve(req, res, finalhandler(req, res));
    return;
  }
  res.writeHead(302, {
    'Location': 'https://'+req.headers.host+req.url
  });
  res.end();
});
redir.listen(80);

var options = {
  key: fs.readFileSync('/etc/letsencrypt/live/aklbuses.nz/privkey.pem')
, cert: fs.readFileSync('/etc/letsencrypt/live/aklbuses.nz/fullchain.pem')
, ca: fs.readFileSync('/etc/letsencrypt/live/aklbuses.nz/chain.pem')
}
var server = https.createServer(options, app);
var io = require('./lib/sockets').listen(server)
server.listen(443);




