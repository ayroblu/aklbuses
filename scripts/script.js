//import './cube'
import {qget, qgeta} from './helper'
import socketData from './socketdata'
import mapsModule from 'google-maps-api'
const mapsapi = mapsModule('AIzaSyBkSlPom4tp0ypqQpZela8ct4VIjh2OoN8');
import markerHelper from './markerHelper'
import moment from 'moment'
 
var liveButton = qget('.liveButton')
liveButton.onclick = function(){
  var isLive = this.classList.toggle('live')
  if (isLive){
    socketData.startRefreshing(null)
  } else {
    socketData.stopRefreshing()
  }
}

mapsapi().then( function( maps ) {
  initMap()
  //use the google.maps object as you please 
});

window.store = {data: [], markers: {}};
var map;
var doneFirst = false

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: {lat: -36.844784, lng: 174.758700},
  })

  socketData.startRefreshing(null) //put in map
  socketData.setChatListener(function(d){
    liveData.showData(d)
  })
}
var liveData = {
  showData(data){
    console.log('Showing data')
    console.log('clock difference:', moment.unix(data.header.timestamp).fromNow())

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
      , datetime: moment.unix(e.vehicle.timestamp).from(moment.unix(data.header.timestamp))
      , startTime: e.vehicle.trip.start_time
      }
    })
    store.data = positions
    this.updateMarkers(positions, map)

    // center page
    if (!doneFirst){
      var bounds = new google.maps.LatLngBounds();
      Object.keys(store.markers).forEach(k=>bounds.extend(store.markers[k].getPosition()))
      map.fitBounds(bounds)
      doneFirst = true
    }
  }
, updateMarkers(data, map){
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
          keys.splice(keys.indexOf(d.vehicle_id), 1)
        } else {
          o.addedData.push(d)
        }
        return o
      }, {moveData: [], removedData: [], addedData: []})
      groupedData.removedData = data.filter(d=>keys.indexOf(d.vehicle_id) >= 0) //keys.map(k=>data[k])
      return groupedData
    }
    var groupedData = getGroupedData(data)
    console.log(groupedData)

    var moveMarkers = function(data){
      // get markers by data, re
      var markers = store.markers
      data.forEach(d=>{
        //markers[d.vehicle_id].setPosition(new google.maps.LatLng(d.ll.lat, d.ll.lng))
        var marker = markers[d.vehicle_id]
        markerHelper.animateMarker(markers[d.vehicle_id]
        , {lat: marker.getPosition().lat(), lng: marker.getPosition().lng()}
        , {lat: d.ll.lat, lng: d.ll.lng})
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
        store.markers[d.vehicle_id] = markerHelper.drawMarker(d, map)
      })
    }
    moveMarkers(groupedData.moveData)
    removeMarkers(groupedData.removedData)
    addMarkers(groupedData.addedData)
  }
}

