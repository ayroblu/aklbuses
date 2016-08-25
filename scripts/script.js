// This example uses the Google Maps JavaScript API's Data layer
// to create a rectangular polygon with 2 holes in it.

//var controls = document.querySelector('.controls')
//var sControls;
import './main'
import {qget, qgeta} from './helper'
import socketData from './socketdata'
//require('./main')
//var helper = require('./helper')
//var socketData = require('./socketdata')
import mapsModule from 'google-maps-api'
const mapsapi = mapsModule('AIzaSyBkSlPom4tp0ypqQpZela8ct4VIjh2OoN8');
//script(src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBkSlPom4tp0ypqQpZela8ct4VIjh2OoN8&callback=initMap")
 
mapsapi().then( function( maps ) {
  initMap()
  //use the google.maps object as you please 
});

window.store = {data: [], markers: {}, posData: {}};
//var states = [false, false]
var map;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: {lat: -36.844784, lng: 174.758700},
  })

  socketData.startRefreshing(null) //put in map
  socketData.setChatListener(function(d){
    showData(d)
  })
}
function showData(data){
  console.log('Showing data')

  var positions = data.entity.map(e=>{
    var pos = e.vehicle.position
    var ll = {lat: pos.latitude, lng: pos.longitude}
    var routeId = e.vehicle.trip.route_id
    return {
      ll: ll
    , id: e.id
    , vehicle_id: e.vehicle.vehicle.id
    , name: data.routes[routeId].route_short_name
    , longName: data.routes[routeId].route_long_name
    , datetime: new Date(e.vehicle.timestamp*1000)
    , startTime: e.vehicle.trip.start_time
    }
  })
  store.data = positions
  updateMarkers(positions, map)

  //var markers = positions.reduce((o p)=>{
  //  o[p.vehicle_id] = drawMarker(p, map)
  //  return o
  //}, {})
  //var posData = positions.reduce((o p)=>{
  //  o[p.vehicle_id] = p
  //  return o
  //}, {})
  //store.markers = markers
  //store.posData = posData
  //console.log('num markers: ', markers.length)
}
function updateMarkers(data, map){
  //okay, here's what we got
  // new data object, looking at all the entities, check their ids
  // Build three object stacks, same, removed, added
  // same -> update marker position (stop using markers...)
  // removed -> remove a marker
  // added -> add a marker -> can basically call showData
  var getGroupedData = function(data){
    var keys = Object.keys(store.markers)
    var groupedData = data.reduce((o, d)=>{
      if (keys.indexOf(d.vehicle_id) >= 0){
        o.moveData.push(d)
        keys.splice(keys.indexOf(d.vehicle_id))
      } else {
        o.addedData.push(d)
      }
      return o
    }, {moveData: [], removedData: [], addedData: []})
    groupedData.removedData = keys.map(k=>data[k])
    return groupedData
  }
  //var groupedData = {moveData: [], removedData: [], addedData: []}
  var groupedData = getGroupedData(data)

  var moveMarkers = function(data){
    // get markers by data, re
    var markers = store.markers
    data.forEach(d=>{
      markers[d.vehicle_id].setPosition(new google.maps.LatLng(d.ll.lat, d.ll.lng))
    })
  }
  var removeMarkers = function(data){
    var markers = store.markers
    data.forEach(d=>{
      markers[d.vehicle_id].setMap(null)
      markers[d.vehicle_id] = undefined
      delete markers[d.vehicle_id]
    })
    // data.map(d=>d.remove)
  }
  var addMarkers = function(data){
    data.forEach(d=>{
      store.markers[d.vehicle_id] = drawMarker(d, map)
    })
  }
  moveMarkers(groupedData.moveData)
  removeMarkers(groupedData.moveData)
  addMarkers(groupedData.addedData)
}
function drawMarker(dataPart, map){
  var p = dataPart;
  var cc = [new google.maps.LatLng(p.ll.lat, p.ll.lng)];

  var marker = new google.maps.Marker({
    position: p.ll
  , map: map
  , title: p.title
  , icon: {
      path: google.maps.SymbolPath.CIRCLE
    , scale: 6
    , strokeWeight: 2
    },
  });

  var infoWindow = drawInfoWindow(dataPart, map, cc)

  markerShowPopup(dataPart, map, marker, infoWindow);

  return marker;
}
function markerShowPopup(dataPart, map, marker, infoWindow){
  google.maps.event.addListener(marker, 'mouseover', function (event) {
    // Within the event listener, "this" refers to the polygon which
    // received the event.
    this.setOptions({
      strokeColor: '#00ff00',
      fillColor: '#00ff00'
    });

    infoWindow.open(map);

    var iwOuter = document.querySelector('.gm-style-iw');

    var iwBackground = iwOuter.previousElementSibling;

    // Remove the background shadow DIV
    for (var i = 0; i < 4; ++i) {
      Object.assign(iwBackground.children[i].style, {
        display: 'none'
      })
    }
    Object.assign(iwOuter.parentElement.parentElement.style, {
      pointerEvents: 'none'
    })
    var iwCloseBtn = iwOuter.nextElementSibling;

    Object.assign(iwCloseBtn.style, {
      display: 'none'
    })
  });
  // STEP 5: Listen for when the mouse stops hovering over the polygon.
  google.maps.event.addListener(marker, 'mouseout', function (event) {
    this.setOptions({
      //strokeColor: '#ff0000',
      //fillColor: getColour(dataPart.val)
    });
    infoWindow.close(map);
  });
}
function drawInfoWindow(dataPart, map, cc){
  //var featureData = {
  //  name: dataPart.name
  //}
  var featureData = dataPart
  var dataText = `
    <div class="popupData">
      <h2>${featureData.name}</h2>
      <p>${featureData.longName}</p>
      <p>UTC: ${featureData.datetime.toISOString()}</p>
      <p>Started at: ${featureData.startTime}</p>
    </div>
  `
  var infoWindow = new google.maps.InfoWindow({
    content: dataText
  });
  var bounds = new google.maps.LatLngBounds();
  cc.forEach(c=>bounds.extend(c))
  infoWindow.setPosition(bounds.getCenter());
  return infoWindow
}

