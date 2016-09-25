CarrifyClient.Renderer = CarrifyClient.Renderer || {};

CarrifyClient.Renderer.Renderer = (function() {
  var set = {
    'ref': {
      'template_container': document.getElementById('template_container')
    },
    'compiledTemplates': {},
    'runtime': {},
    'handlers': {
      '[data-link-list]': function() {
        var category = this.getAttribute('data-link-list');

        renderTemplate({
          'template': 'list',
          'data': {
            category: category
          }
        });
      },
      '[data-link-home]': function() {
        renderTemplate({
          'template': 'home'
        });
      },
      '[data-link-detail]': function() {
        var category = this.getAttribute('data-link-detail');

        var id = this.getAttribute('data-link-id');
        var data = CarrifyClient.Renderer.Cache.getAd(id);
        content = data.data ? JSON.parse(data.data) : {};

        if (!category) {
          category = data.tags && data.tags.length > 0 ? data.tags[0].name : null;

          if (!category) {
            category = 'home';
          }
        }

        renderTemplate({
          'template': 'detail',
          'data': {
            category: category,
            content: content
          },
          'ignoreTemplate': true
        });
      },
      '[data-link-close]': function() {
        var templateFrom = this.getAttribute('data-template-from');
        var category = this.getAttribute('data-category');

        renderTemplate({
          'template': templateFrom,
          'data': {
            category: category
          }
        });
      }
    },
    'helpers': {
      'getCategoryProperty': function(category, property) {
        category = CarrifyClient.categories[category] || {};
        var value = category[property] || "";

        return new Handlebars.SafeString(value);
      },
      'getAd': function(category, index, theClass) {
        var id = guid();

        var ad = CarrifyClient.Renderer.Cache.getByIndex(category, index, function (advert) {
          var container = document.getElementById(id);

          var data = getAdInfo(advert, 'small', category, theClass);

          container.className = "";
          container.parentNode.className = "";

          container.parentNode.setAttribute("data-link-id", advert.id);
          container.innerHTML = !advert ? "" : data;

          manageLinks(set.runtime.currentTemplate);
        });

        if (!ad) {
          return "<div class='" + theClass + "'><div id='" + id + "' class='advert-loading'></div></div>";
        }

        return getAdInfo(ad, 'small', category, theClass);
      },
      'short': function(text) {
        return text.substring(0, 20);
      }
    }
  };

  function getAdInfo(advert, size, category, theClass) {
    advert = advert || {};
    var data = advert.data || {};

    if (typeof data === "string") {
      data = JSON.parse(advert.data);
    }

    var content = data && data.content ? data.content[size] : "";
    category = category === 'home' ? '' : category

    var background = data.image ? data.image : "";
    var id = advert.id;

    if (background !== "") {
      background = "background-image:url('" + background + "');"
    }

    return '<a href="javascript:void(0);" class="' + theClass + '" data-link-detail="' + category + '" data-link-id="' + id + '" style="' + background + '">' + content + '</a>';
  }

  function fillCarousel(category, template, adverts) {
    // Fill array when it has less than 12 elements.
    // We need at least 12 elements to fill the list view.
    adverts = fillArray(adverts, 12);

    // First 5 elements are rendered in the left size of the view.
    adverts = adverts.slice(5, adverts.length);

    var container = document.getElementById(template + '_container');

    renderTemplate({
      'template': template,
      'data': {
        'adverts': adverts,
        'category': category
      },
      'container': container,
      'ignoreTemplate': true
    });

    new Swiper ('.swiper-container', {
      slidesPerView: 3,
      loop: true
    });
  }

  function fillArray(elements, size) {
    elements = elements || [{}];

    if (elements.length < 1) {
      elements = [{}];
    }

    var index = 0;

    while (elements.length < size) {
      elements.push(elements[index]);
      index++;
    }

    var length = elements.length;

    for (var i = 0; i < length; i++) {
      var data = elements[i].data;

      if (typeof data === "string") {
        elements[i].data = JSON.parse(data);
      }
    }

    return elements;
  }

  function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }

    return 'id' + s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }

  function compileTemplates() {
    var templates = document.querySelectorAll('[type="text/x-handlebars-template"]');
    var templatesLength = templates.length;

    for (var i = 0; i < templatesLength; i++) {
      var template = templates[i];
      var id = template.id;
      var source = template.innerHTML;

      set.compiledTemplates[id] = Handlebars.compile(source);
    }
  }

  function renderTemplate(options) {
    var templateName = options.template;
    var data = options.data || {};
    var template_container = options.container || set.ref.template_container;
    var callback = options.callback;
    var ignoreTemplate = options.ignoreTemplate;

    data = data || {};
    data.set = set;
    data.categories = CarrifyClient.categories;

    var fullTemplateName = templateName + '_template';
    var compiledTemplate = set.compiledTemplates[fullTemplateName];

    template_container.innerHTML = compiledTemplate(data);
    manageLinks(set.runtime.currentTemplate);
    manageCarousels();

    if (!ignoreTemplate) {
      set.runtime.currentTemplate = templateName;
    }

    if (callback) {
      callback();
    }

    if (CarrifyClient.Map) {
      CarrifyClient.Map.init();
    }
  }

  function home(data) {
    renderTemplate({
      'template': 'home',
      'data': data
    });
  }

  function isHome() {
    return document.querySelector('[data-is-home]') !== null;
  }

  function manageLinks(previousTemplate) {
    previousTemplate = previousTemplate || "";

    for (var handler in set.handlers) {
      var handlerFunction = set.handlers[handler];
      assignHandlers(handler, handlerFunction, previousTemplate);
    }
  }

  function manageCarousels() {
    var carousels = document.querySelectorAll('[data-carousel]');
    var length = carousels.length;

    for (var i = 0; i < length; i++) {
      var carousel = carousels[i];
      var carouselCategory = carousel.getAttribute('data-carousel');
      var template = carousel.getAttribute('data-template');

      carousel.removeAttribute('data-carousel'); // Prevent recursion

      var adverts = CarrifyClient.Renderer.Cache.getAll(carouselCategory, function(adverts) {
        fillCarousel(carouselCategory, template, adverts);
      });

      if (adverts) {
        fillCarousel(carouselCategory, template, adverts);
      }
    }
  }

  function assignHandlers(selector, handler, previousTemplate) {
    var links = document.querySelectorAll(selector);
    var linksLength = links.length;

    for (var i = 0; i < linksLength; i++) {
      var link = links[i];
      link.setAttribute('data-template-from', previousTemplate);
      link.onclick = handler;
    }
  }

  function registerHelpers() {
    for (var helper in set.helpers) {
      var helperFunction = set.helpers[helper];
      Handlebars.registerHelper(helper, helperFunction);
    }
  }

  function init() {
    registerHelpers();
    compileTemplates();
    home();

    CarrifyClient.Renderer.Cache.loadCategories(CarrifyClient.categories);
  }

  return {
    'home': home,
    'categories': CarrifyClient.categories,
    'init': init
  };
})();
