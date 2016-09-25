CarrifyClient.DI = (function() {
  var dependencies = {
    "locator": CarrifyClient.Locator.ArrayLocator,
    //"recommender": CarrifyClient.Recommender.ArrayRecommender,
    "recommender": CarrifyClient.Recommender.ApiRecommender,
    "renderer": CarrifyClient.Renderer.Renderer,
    "cache": CarrifyClient.Renderer.Cache
  };

  return {
    get: function(dependency) {
      return dependencies[dependency];
    }
  };
})();
