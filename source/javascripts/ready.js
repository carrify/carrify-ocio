$(function() {
  var locator = CarrifyClient.DI.get("locator");
  var recommender = CarrifyClient.DI.get("recommender");
  var renderer = CarrifyClient.DI.get("renderer");
  var cache = CarrifyClient.DI.get("cache");

  var coords = CarrifyClient.DI.get("locator").getLocation();

  function getInfo(clientId) {
    recommender.getRecommendations(clientId, coords[0], coords[1], function (recommendations) {
      CarrifyClient.Renderer.Cache.store('home', recommendations);
    });
  }

  CarrifyClient.Renderer.Cache.loadClientId(function(id) {
    var clientId = id;

    setInterval(function() {
      getInfo(clientId);
    }, 3000);

    getInfo(clientId);
  });
});
