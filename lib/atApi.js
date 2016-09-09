// GTFS api definition
function joinUrl(urlArray){
  if (!urlArray.length || typeof urlArray !== 'object'){
    throw new Error('Array not passed in')
  }
  urlArray.reduce((url, part)=>{
    url += url.slice(-1) === "/" ? (part.slice(0, 1) === "/" ? part.slice(1) : part) : (part.slice(0, 1) === "/" ? part : "/" + part)
    return url
  }, '')
}
function urlParams(params){
  if (!typeof params === "object"){
    throw new Error('Expected to get object, instead got:', params)
  }
  return "?" + Object.keys(params).map(k=>k+"="+encodeURIComponent(params[k])).join("&")
}

var apiConfig = {
  hostname: 'https://api.at.govt.nz'
, apiKey = '34893bb6-1d38-4403-923b-f3892de693e4'
, keyType: 'param' //Could also be header
, keyName: 'api_key'
}

//API definition
var urlArray = [apiConfig.hostname, api.url]
if (apiConfig.keyType === "param"){
  urlArray.push(urlParams({apiConfig.keyName: apiConfig.apiKey}))
}
var fullUrl = joinUrl(urlArray)


module.exports = {
  endpoints: [{
    route: '/gtfs/versions'
  , description: 'GTFS versions'
  , method: 'GET'
  }, {
    route: '/gtfs/agency'
  , description: 'Agencies list'
  , method: 'GET'
  }, {
    route: '/gtfs/calendar'
  , description: 'Calendar list'
  , method: 'GET'
  }, {
    route: '/gtfs/calendar/serviceId/:service_id'
  , description: 'Calendar by service id'
  , method: 'GET'
  }, {
    route: '/gtfs/calendarDate'
  , description: 'Calendar exception list'
  , method: 'GET'
  }, {
    route: '/gtfs/calendarDate/serviceId/:service_id'
  , description: 'Calendar exception by service id'
  , method: 'GET'
  }, {
    route: '/gtfs/routes'
  , description: 'Routes list'
  , method: 'GET'
  }, {
    route: '/gtfs/routes/routeId/:route_id'
  , description: 'Routes list filtered by id'
  , method: 'GET'
  }, {
    route: '/gtfs/routes/routeLongName/:route_long_name'
  , description: 'Routes list filtered by long name'
  , method: 'GET'
  }, {
    route: '/gtfs/routes/routeShortName/:route_short_name'
  , description: 'Routes list filtered by short name'
  , method: 'GET'
  }, {
    route: '/gtfs/routes/search/:search_text'
  , description: 'Routes search'
  , method: 'GET'
  }, {
    route: '/gtfs/routes/geosearch'
  , description: 'Routes, search radius around a position (latitude and longitude)'
  , method: 'GET'
  }, {
    route: '/gtfs/routes/stopid/:stop_id'
  , description: 'Routes search by stop id'
  , method: 'GET'
  }, {
    route: '/gtfs/shapes/shapeId/:shape_id'
  , description: 'Shape by Id'
  , method: 'GET'
  }, {
    route: '/gtfs/shapes/tripId/:trip_id'
  , description: 'Shape by trip id'
  , method: 'GET'
  }, {
    route: '/gtfs/shapes/geometry/:shape_id'
  , description: 'Shape geometry by Id'
  , method: 'GET'
  }, {
    route: '/gtfs/stops'
  , description: 'Stops list'
  , method: 'GET'
  }, {
    route: '/gtfs/stops/stopId/:stop_id'
  , description: 'Stop by Id'
  , method: 'GET'
  }, {
    route: '/gtfs/stops/stopCode/:stop_code'
  , description: 'Stop by code'
  , method: 'GET'
  }, {
    route: '/gtfs/stops/tripId/:trip_id'
  , description: 'Stop by trip id'
  , method: 'GET'
  }, {
    route: '/gtfs/stops/search/:search_text'
  , description: 'Stops search by name'
  , method: 'GET'
  }, {
    route: '/gtfs/stops/geosearch'
  , description: 'Stops search by postion'
  , method: 'GET'
  }, {
    route: '/gtfs/stopTimes/stopId/:stop_id'
  , description: 'Stops times by stop id'
  , method: 'GET'
  }, {
    route: '/gtfs/stopTimes/tripId/:trip_id'
  , description: 'Stops times by trip id'
  , method: 'GET'
  }, {
    route: '/gtfs/stopTimes/tripId/:trip_id/stopSequence/:stop_sequence'
  , description: 'Stops times by trip id and stop sequence'
  , method: 'GET'
  }, {
    route: '/gtfs/trips'
  , description: 'Trips list'
  , method: 'GET'
  }, {
    route: '/gtfs/trips/tripId/:trip_id'
  , description: 'Trips by trip id'
  , method: 'GET'
  }, {
    route: '/gtfs/trips/routeid/:route_id'
  , description: 'Trips by route id'
  , method: 'GET'
  }]
}
