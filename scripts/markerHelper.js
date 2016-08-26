import mapsModule from 'google-maps-api'

module.exports = {
  drawMarker(dataPart, map){
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

    var infoWindow = this.drawInfoWindow(dataPart, map, cc)

    this.markerShowPopup(dataPart, map, marker, infoWindow);

    return marker;
  }
, markerShowPopup(dataPart, map, marker, infoWindow){
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
, drawInfoWindow(dataPart, map, cc){
    var featureData = dataPart
    var dataText = `
      <div class="popupData">
        <h2>${featureData.name}</h2>
        <p>${featureData.longName}</p>
        <p>Last updated: ${featureData.datetime}</p>
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
, animateMarker(marker, oldPos, newPos){
    // store a LatLng for each step of the animation
    var frames = [];
    for (var percent = 0; percent < 1; percent += 0.1) {
      var pos = {
        lat: oldPos.lat + percent * (newPos.lat - oldPos.lat)
      , lng: oldPos.lng + percent * (newPos.lng - oldPos.lng)
      }
      frames.push(new google.maps.LatLng(pos.lat, pos.lng));
    }

    var move = function(marker, latlngs, index, wait) {
      if (!latlngs[index]){
        return;
      }
      marker.setPosition(latlngs[index]);
      setTimeout(function() { 
        move(marker, latlngs, index+1, wait); 
      }, wait);
    }

    // begin animation, send back to origin after completion
    move(marker, frames, 0, 100, marker.position);
  }
}

