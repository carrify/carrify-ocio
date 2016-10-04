CarrifyClient.Map = (function() {
  var map;

  var style = [
    {elementType: 'geometry', stylers: [{color: '#ebe3cd'}]},
    {elementType: 'labels.text.fill', stylers: [{color: '#523735'}]},
    {elementType: 'labels.text.stroke', stylers: [{color: '#f5f1e6'}]},
    {
      featureType: 'administrative',
      elementType: 'geometry.stroke',
      stylers: [{color: '#c9b2a6'}]
    },
    {
      featureType: 'administrative.land_parcel',
      elementType: 'geometry.stroke',
      stylers: [{color: '#dcd2be'}]
    },
    {
      featureType: 'administrative.land_parcel',
      elementType: 'labels.text.fill',
      stylers: [{color: '#ae9e90'}]
    },
    {
      featureType: 'landscape.natural',
      elementType: 'geometry',
      stylers: [{color: '#dfd2ae'}]
    },
    {
      featureType: 'poi',
      elementType: 'geometry',
      stylers: [{color: '#dfd2ae'}]
    },
    {
      featureType: 'poi',
      elementType: 'labels.text.fill',
      stylers: [{color: '#93817c'}]
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry.fill',
      stylers: [{color: '#a5b076'}]
    },
    {
      featureType: 'poi.park',
      elementType: 'labels.text.fill',
      stylers: [{color: '#447530'}]
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{color: '#f5f1e6'}]
    },
    {
      featureType: 'road.arterial',
      elementType: 'geometry',
      stylers: [{color: '#fdfcf8'}]
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [{color: '#f8c967'}]
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [{color: '#e9bc62'}]
    },
    {
      featureType: 'road.highway.controlled_access',
      elementType: 'geometry',
      stylers: [{color: '#e98d58'}]
    },
    {
      featureType: 'road.highway.controlled_access',
      elementType: 'geometry.stroke',
      stylers: [{color: '#db8555'}]
    },
    {
      featureType: 'road.local',
      elementType: 'labels.text.fill',
      stylers: [{color: '#806b63'}]
    },
    {
      featureType: 'transit.line',
      elementType: 'geometry',
      stylers: [{color: '#dfd2ae'}]
    },
    {
      featureType: 'transit.line',
      elementType: 'labels.text.fill',
      stylers: [{color: '#8f7d77'}]
    },
    {
      featureType: 'transit.line',
      elementType: 'labels.text.stroke',
      stylers: [{color: '#ebe3cd'}]
    },
    {
      featureType: 'transit.station',
      elementType: 'geometry',
      stylers: [{color: '#dfd2ae'}]
    },
    {
      featureType: 'water',
      elementType: 'geometry.fill',
      stylers: [{color: '#b9d3c2'}]
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [{color: '#92998d'}]
    }
  ];

  function init(callback) {
    // Create the map with no initial style specified.
    // It therefore has default styling.
    var container = document.getElementById('map');

    if (!container) {
      return;
    }

    map = new google.maps.Map(container, {
      center: {lat: 38.3429513, lng: -0.4808849},
      zoom: 16,
      mapTypeControl: false,
      disableDefaultUI: true
    });

    map.setOptions({styles: style});

    //geolocate(callback);
    callback();
  }

  function geolocate(callback) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        map.setCenter(pos);

        if (callback) {
          callback(pos);
        }
      }, function() {
        // Error
      });
    } else {
      // Error
    }
  }

  function loadPoints(points, onClick) {
    var length = points.length;

    for (var i = 0; i < length; i++) {
      var point = points[i];
      var id = point.id;
      var category = point.tags.length > 0 ? point.tags[0].name : '';

      var image = {
        url: '/images/pins/' + category + '.png',
        size: new google.maps.Size(34, 49),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 32)
      };

      var data = point.data;

      if (typeof data === 'string' || data instanceof String) {
        data = JSON.parse(data);
      }

      var marker = new google.maps.Marker({
        position: {
          lat: point.latitude,
          lng: point.longitude
        },
        map: map,
        icon: image,
        title: data.description,
        zIndex: 1
      });

      marker.addListener('click', function() {
        onClick(category, id);
      });
    }
  }

  return {
    "init": init,
    "loadPoints": loadPoints
  };
})();
