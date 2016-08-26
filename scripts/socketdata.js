import io from 'socket.io-client'

var socket = io();
var intervalId = null

function startRefreshing(map){
  socket.emit('bus latlng', '') //Don't need an argument at this moment cause pull all
  clearInterval(intervalId)
  intervalId = setInterval(()=>{
    socket.emit('bus latlng', '')
  }, 30000)
}
function stopRefreshing(map){
  clearInterval(intervalId)
}
function setChatListener(cb){
  socket.on('bus positions', function(msg){
    console.log('bus positions received')
    cb(msg)
  });
}
module.exports = {
  startRefreshing
, stopRefreshing
, setChatListener
}
