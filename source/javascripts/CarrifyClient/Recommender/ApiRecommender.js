CarrifyClient.Recommender = CarrifyClient.Recommender || {};

CarrifyClient.Recommender.ApiRecommender = (function() {
  return {
    getRecommendations: function(clientId, latitude, longitude, callback) {
      $.ajax({
        url: CarrifyClient.baseUrl + "/client/recommend",
        type: "get",
        data: {
          client_id: clientId,
          latitude: latitude,
          longitude: longitude,
          token: CarrifyClient.securityToken
        },
        success: function (data) {
          callback(data.recommendations);
        }
      });
    },
    getAdsByTag: function(clientId, tag, callback) {
      $.ajax({
        url: CarrifyClient.baseUrl + "/locations/" + CarrifyClient.locationId + "/points",
        type: "get",
        data: {
          client_id: clientId,
          token: CarrifyClient.securityToken,
          tags: tag
        },
        success: function (data) {
          callback(data.points);
        }
      });
    }
  };
})();
