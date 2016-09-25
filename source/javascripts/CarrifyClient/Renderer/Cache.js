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
    var clientId = set.client_id;

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
    $.ajax({
      url: CarrifyClient.baseUrl + "/client/new_client_id",
      type: "POST",
      data: {
        token: CarrifyClient.securityToken
      },
      dataType: "json",
      success: function (data) {
        var id = data.id
        set.client_id = id;

        CarrifyClient.Renderer.Renderer.init();

        callback(id);
      }
    });
  }

  function getClientId() {
    return set.client_id;
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
