var fs = require('fs')
, https = require('https')
, app = require('./app')
 
var options = {
  key: fs.readFileSync('/etc/letsencrypt/live/aklbuses.nz/privkey.pem')
, cert: fs.readFileSync('/etc/letsencrypt/live/aklbuses.nz/fullchain.pem')
, ca: fs.readFileSync('/etc/letsencrypt/live/aklbuses.nz/chain.pem')
}
var server = https.createServer(options, app);
server.listen(443);




