import mapsModule from 'google-maps-api'

module.exports = {
  drawMarker(dataPart, map){
    var p = dataPart;
    var cc = new google.maps.LatLng(p.ll.lat, p.ll.lng);

    var marker = new google.maps.Marker({
      position: p.ll
    , map: map
    , title: p.title
    , icon: {
        path: google.maps.SymbolPath.CIRCLE
      , scale: 6
      , strokeWeight: 2
      , strokeColor: '#15f'
      },
    });

    var infoWindow = this.drawInfoWindow(dataPart, map, cc)
    this.markerShowPopup(dataPart, map, marker, infoWindow);

    //var miniInfoWindow = this.drawMiniInfoWindow(dataPart, map, cc)
    //this.markerShowMiniPopup(dataPart, map, marker, miniInfoWindow)

    return marker;
  }
, markerShowMiniPopup(dataPart, map, marker, infoWindow){
    var showPopup = function(event){
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
    }

    map.addListener('center_changed', function() {
      console.log('zoom: ', map.getZoom())
      if (map.getZoom() > 13 && map.getBounds().contains(marker.getPosition())){
        showPopup()
      } else {
        infoWindow.close(map);
      }
    })
    map.addListener('zoom_changed', function() {
      if (map.getZoom() > 13 && map.getBounds().contains(marker.getPosition())){
        showPopup()
      } else {
        infoWindow.close(map);
      }
    });
  }
, drawMiniInfoWindow(dataPart, map, cc){
    var featureData = dataPart
    var dataText = `
      <div class="popupData">
        <h3>${featureData.name}</h3>
      </div>
    `
    var infoWindow = new google.maps.InfoWindow({
      content: dataText
    });
    //var bounds = new google.maps.LatLngBounds();
    //cc.forEach(c=>bounds.extend(c))
    //infoWindow.setPosition(bounds.getCenter());
    infoWindow.setPosition(cc);
    return infoWindow
  }
, markerShowPopup(dataPart, map, marker, infoWindow){
    var showPopup = function (event) {
      // Within the event listener, "this" refers to the polygon which
      // received the event.
      this.setIcon({
        path: google.maps.SymbolPath.CIRCLE
      , scale: 6
      , strokeWeight: 2
      , strokeColor: '#f55'
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
    };
    var hidePopup = function (event) {
      marker.setIcon({
        path: google.maps.SymbolPath.CIRCLE
      , scale: 6
      , strokeWeight: 2
      , strokeColor: '#15f'
      });
      infoWindow.close(map);
    }
    google.maps.event.addListener(marker, 'mouseover', showPopup)
    google.maps.event.addListener(marker, 'mouseout', hidePopup);
    google.maps.event.addListener(marker, 'click', showPopup)
    google.maps.event.addListener(map, "click", hidePopup);
    // STEP 5: Listen for when the mouse stops hovering over the polygon.
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
    //var bounds = new google.maps.LatLngBounds();
    //cc.forEach(c=>bounds.extend(c))
    //infoWindow.setPosition(bounds.getCenter());
    infoWindow.setPosition(cc);
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

