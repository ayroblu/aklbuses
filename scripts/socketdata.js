import io from 'socket.io-client'

var socket = io();

function startRefreshing(map){
  socket.emit('bus latlng', '') //Don't need an argument at this moment cause pull all
  console.log('bus latlng sent')
  setInterval(()=>{
    socket.emit('bus latlng', '')
  }, 30000)
}
function setChatListener(cb){
  socket.on('bus positions', function(msg){
    console.log('bus positions received')
    cb(msg)
  });
}
module.exports = {
  startRefreshing
, setChatListener
}
