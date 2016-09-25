CarrifyClient.Recommender = CarrifyClient.Recommender || {};

/**
 * Finds recommended offers based on the current location.
 */
CarrifyClient.Recommender.ArrayRecommender = (function() {

  var recommendations = [
    [], // We may not receive any recommendations,
    [{  // Single recommendation
      rank: 1,
      point: {
        radio: 2,
        name: "Test",
        longitude: 45.925,
        location_id: 4,
        latitude: 42.9904,
        id: 1,
        data: "Hola bebes"
      }
    }],
    [{ // Multiple recommendations
      rank: 0.98,
      point: {
        radio: 2,
        name: "Test",
        longitude: 45.925,
        location_id: 4,
        latitude: 42.9904,
        id: 1,
        data: "Hola bebes"
      }
    },
    {
      rank: 1,
      point: {
      radio: 2,
      name: "Test",
      longitude: 45.925,
      location_id: 4,
      latitude: 42.9904,
      id: 1,
      data: "Hola bebes"
      }
    }]
  ];
  var current = -1;

  return {
    getRecommendations: function(organizationId, clientId, latitude, longitude, callback) {
      current = (current + 1 < recommendations.length) ? current + 1 : 0;
      return callback(recommendations[current]);
    },
  };
})();