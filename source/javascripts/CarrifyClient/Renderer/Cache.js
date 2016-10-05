CarrifyClient.Renderer = CarrifyClient.Renderer || {};

CarrifyClient.Renderer.Cache = (function() {
  var set = {
    'client_id': null,
    'ref': {

    },
    'cache': {

    },
    'adList': {

    },
    'callbacks': {

    }
  };

  var Executer = function(callback, index) {
    function execute(data) {
      callback(index !== null ? data[index % data.length] : data);
    }

    return {
      'execute': execute
    };
  };

  function store(key, data) {
    set.cache[key] = data;

    var length = data.length;

    for (var i = 0; i < length; i++) {
      var element = data[i];
      set.adList[element.id] = element;
    }

    if (set.callbacks[key]) {
      var callbacks = set.callbacks[key];
      var length = callbacks.length;

      for (var i = 0; i < length; i++) {
        var executer = callbacks[i];
        executer.execute(data);
      }

      delete set.callbacks[key];
    }
  }

  function get(key, index, callback) {
    var cache = set.cache;

    if (!cache || !cache[key]) {
      if (!set.callbacks[key]) {
        set.callbacks[key] = [];
      }

      set.callbacks[key].push(Executer(callback, index));

      return [];
    }

    return cache[key];
  }

  function getAll(key, callback) {
    return get(key, null, callback);
  }

  function getByIndex(key, index, callback) {
    var all = get(key, index, callback);

    return all[index % all.length];
  }

  function getAdsByTag(tagId, tagKey) {
    var clientId = getClientId();

    CarrifyClient.Recommender.ApiRecommender.getAdsByTag(clientId, tagId, function (ads) {
      store(tagKey, ads);
    });
  }

  function loadCategories(categories) {
    for (var category in categories) {
      var data = categories[category];

      getAdsByTag(data.id, category);
    }
  }

  function getAd(id) {
    return set.adList[id];
  }

  function loadClientId(callback) {
    // Don't request a new ClientID if it is already cached.
    var afterClientIdFetched = function (client_id) {
      CarrifyClient.Renderer.Renderer.init();
      callback(client_id);
    }
    var client_id = null;
    if (client_id = getClientId()) {
      console.log("Using ClientID from localStorage");
      afterClientIdFetched(client_id);
    } else {
      console.log("Requesting a new ClientID");
      $.ajax({
        url: CarrifyClient.baseUrl + "/client/new_client_id",
        type: "POST",
        data: {
          token: CarrifyClient.securityToken
        },
        dataType: "json",
        success: function (data) {
          localStorage.setItem("CarrifyClient.client_id", data.id);
          afterClientIdFetched(data.id);
        }
      });
    }
  }

  function getClientId() {
    return localStorage.getItem("CarrifyClient.client_id");
  }

  return {
    'store': store,
    'getAll': getAll,
    'getByIndex': getByIndex,
    'loadCategories': loadCategories,
    'loadClientId': loadClientId,
    'getClientId': getClientId,
    'getAd': getAd
  };
})();
