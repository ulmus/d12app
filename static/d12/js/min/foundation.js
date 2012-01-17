(function() {
  var Foundation, getParams, getUrl, init, methodMap, templateHash, urlError,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  window.Foundation = Foundation = {};

  window.Foundation.inits = [];

  Foundation.markdownConverter = Markdown.getSanitizingConverter();

  Handlebars.registerHelper("cardActionDisplay", function(abbr) {
    switch (abbr) {
      case "ACTN":
        return "Main";
      case "MOVE":
        return "Positioning";
      case "SPRT":
        return "Support";
      case "REAC":
        return "Reaction";
    }
  });

  Handlebars.registerHelper("cardActionClassName", function(abbr) {
    switch (abbr) {
      case "ACTN":
        return "action";
      case "MOVE":
        return "move";
      case "SPRT":
        return "support";
      case "REAC":
        return "reaction";
    }
  });

  Handlebars.registerHelper("markdown", function(markdownText) {
    return Foundation.markdownConverter.makeHtml(markdownText);
  });

  Handlebars.registerHelper("collectionCount", function(collection) {
    return collection.length;
  });

  templateHash = {};

  Foundation.addTemplate = function(templateName, templateString) {
    return templateHash[templateName] = Handlebars.compile(templateString);
  };

  Foundation.generateTemplates = function() {
    var scriptTag, scripts, tag, _i, _len, _results;
    scripts = $("script[type='text/x-template']");
    _results = [];
    for (_i = 0, _len = scripts.length; _i < _len; _i++) {
      scriptTag = scripts[_i];
      tag = $(scriptTag);
      _results.push(Foundation.addTemplate(tag.attr("id"), tag.html()));
    }
    return _results;
  };

  Foundation.getTemplate = function(templateName) {
    if (templateHash[templateName]) {
      return templateHash[templateName];
    } else {
      console && console.log("TemplateError: Couldn't find " + templateName);
      return $.noop;
    }
  };

  Foundation.generateTemplates();

  Foundation.Collection = (function(_super) {

    __extends(Collection, _super);

    function Collection() {
      this.url = __bind(this.url, this);
      this.unsetParam = __bind(this.unsetParam, this);
      this.setParam = __bind(this.setParam, this);
      this.queryParams = __bind(this.queryParams, this);
      this.initialize = __bind(this.initialize, this);
      Collection.__super__.constructor.apply(this, arguments);
    }

    Collection.prototype.initialize = function(models, options) {
      options || (options = {});
      this._params = options.params ? options.params : {};
      return Collection.__super__.initialize.call(this, models, options);
    };

    Collection.prototype.queryParams = function() {
      return this._params;
    };

    Collection.prototype.setParam = function(key, value) {
      return this._params[key] = value;
    };

    Collection.prototype.unsetParam = function(key) {
      return delete this._params[key];
    };

    Collection.prototype.url = function() {
      return this.rootUrl;
    };

    return Collection;

  })(Backbone.Collection);

  Foundation.Model = (function(_super) {

    __extends(Model, _super);

    function Model() {
      this.toJSON = __bind(this.toJSON, this);
      this.toString = __bind(this.toString, this);
      this.queryParams = __bind(this.queryParams, this);
      Model.__super__.constructor.apply(this, arguments);
    }

    Model.prototype._params = {};

    Model.prototype.queryParams = function() {
      return this._params;
    };

    Model.prototype.toString = function() {
      return "model";
    };

    Model.prototype.toJSON = function() {
      var attr;
      attr = _(this.attributes).clone();
      delete attr.id;
      return attr;
    };

    return Model;

  })(Backbone.Model);

  Backbone.Form.editors.MultipleSelect = (function(_super) {

    __extends(MultipleSelect, _super);

    function MultipleSelect() {
      this.renderOptions = __bind(this.renderOptions, this);
      MultipleSelect.__super__.constructor.apply(this, arguments);
    }

    MultipleSelect.prototype.renderOptions = function(options) {
      MultipleSelect.__super__.renderOptions.call(this, options);
      return $(this.el).attr("multiple", "multiple");
    };

    return MultipleSelect;

  })(Backbone.Form.editors.Select);

  Backbone.Form.editors.ChosenMultipleSelect = (function(_super) {

    __extends(ChosenMultipleSelect, _super);

    function ChosenMultipleSelect() {
      this.renderOptions = __bind(this.renderOptions, this);
      ChosenMultipleSelect.__super__.constructor.apply(this, arguments);
    }

    ChosenMultipleSelect.prototype.renderOptions = function(options) {
      ChosenMultipleSelect.__super__.renderOptions.call(this, options);
      return $(this.el).addClass("chosen-select");
    };

    return ChosenMultipleSelect;

  })(Backbone.Form.editors.MultipleSelect);

  Backbone.Form.editors.ChosenSelect = (function(_super) {

    __extends(ChosenSelect, _super);

    function ChosenSelect() {
      this.renderOptions = __bind(this.renderOptions, this);
      ChosenSelect.__super__.constructor.apply(this, arguments);
    }

    ChosenSelect.prototype.renderOptions = function(options) {
      ChosenSelect.__super__.renderOptions.call(this, options);
      return $(this.el).addClass("chosen-select");
    };

    return ChosenSelect;

  })(Backbone.Form.editors.Select);

  Foundation.TemplateView = (function(_super) {

    __extends(TemplateView, _super);

    function TemplateView() {
      this.remove = __bind(this.remove, this);
      this.unbindModel = __bind(this.unbindModel, this);
      this.bindModel = __bind(this.bindModel, this);
      this.setModel = __bind(this.setModel, this);
      this.getContext = __bind(this.getContext, this);
      this.render = __bind(this.render, this);
      this.initialize = __bind(this.initialize, this);
      TemplateView.__super__.constructor.apply(this, arguments);
    }

    TemplateView.template = $.noop;

    TemplateView.prototype.initialize = function() {
      this.bindModel(this.model);
      return TemplateView.__super__.initialize.call(this);
    };

    TemplateView.prototype.render = function() {
      if (this.model && this.constructor.template) {
        $(this.el).html(this.constructor.template(this.getContext()));
      }
      this.delegateEvents();
      return TemplateView.__super__.render.call(this);
    };

    TemplateView.prototype.getContext = function() {
      return {
        model: this.model,
        attr: this.model.toJSON()
      };
    };

    TemplateView.prototype.setModel = function(newModel) {
      this.unbindModel(this.model);
      this.model = newModel;
      return this.bindModel(this.model);
    };

    TemplateView.prototype.bindModel = function(model) {
      if (model && model instanceof Backbone.Model) {
        return model.bind("change", this.render);
      } else if (model instanceof Backbone.Collection) {
        model.bind("add", this.render);
        model.bind("reset", this.render);
        return model.bind("remove", this.render);
      }
    };

    TemplateView.prototype.unbindModel = function(model) {
      if (model && model instanceof Backbone.Model) {
        return model.unbind("change", this.render);
      } else if (model instanceof Backbone.Collection) {
        model.unbind("add", this.render);
        model.unbind("reset", this.render);
        return model.unbind("remove", this.render);
      }
    };

    TemplateView.prototype.remove = function() {
      this.unbindModel(this.model);
      return TemplateView.__super__.remove.call(this);
    };

    return TemplateView;

  })(Backbone.View);

  Foundation.EditableTemplateView = (function(_super) {

    __extends(EditableTemplateView, _super);

    function EditableTemplateView() {
      this.afterAdd = __bind(this.afterAdd, this);
      this.editKeyUp = __bind(this.editKeyUp, this);
      this.commitEdit = __bind(this.commitEdit, this);
      this.showDisplay = __bind(this.showDisplay, this);
      this.showEdit = __bind(this.showEdit, this);
      this.render = __bind(this.render, this);
      this.delegateEvents = __bind(this.delegateEvents, this);
      EditableTemplateView.__super__.constructor.apply(this, arguments);
    }

    EditableTemplateView.modelName = "object";

    EditableTemplateView.prototype.delegateEvents = function() {
      var events, modelEvents;
      modelEvents = this.events || {};
      events = _(modelEvents).clone();
      _(events).extend({
        "click .display": "showEdit",
        "click .edit .cancel": "showDisplay",
        "click .edit .save": "commitEdit",
        "submit .editForm": "commitEdit",
        "keyup .edit": "editKeyUp"
      });
      return EditableTemplateView.__super__.delegateEvents.call(this, events);
    };

    EditableTemplateView.prototype.render = function() {
      EditableTemplateView.__super__.render.call(this);
      return this.form = new Backbone.Form({
        model: this.model,
        el: this.$(".editForm")
      }).render();
    };

    EditableTemplateView.prototype.showEdit = function() {
      var _this = this;
      this.$(".display").addClass("hide").removeClass("show");
      this.$(".edit").removeClass("hide").addClass("show");
      this.$(".chosen-select").chosen();
      setTimeout(function() {
        return _this.$(".edit").addClass("scale");
      }, 0);
      return setTimeout(function() {
        return _this.$('.edit form :input').eq(0).focus().select();
      }, 150);
    };

    EditableTemplateView.prototype.showDisplay = function() {
      var _this = this;
      this.$(".edit").removeClass("scale");
      return setTimeout(function() {
        _this.$(".edit").removeClass("show").addClass("hide");
        return _this.$(".display").removeClass("hide").addClass("show");
      }, 150);
    };

    EditableTemplateView.prototype.commitEdit = function(event) {
      var error, errors, _i, _len,
        _this = this;
      errors = this.form.validate();
      if (errors) {
        for (_i = 0, _len = errors.length; _i < _len; _i++) {
          error = errors[_i];
          App.trigger("form:error", {
            form: this.form,
            view: this,
            model: this.model,
            error: error
          });
        }
      } else {
        this.showDisplay();
        setTimeout(function() {
          _this.form.commit();
          return _this.model.save();
        }, 150);
      }
      return event.preventDefault();
    };

    EditableTemplateView.prototype.editKeyUp = function(event) {
      if (event.which === 27) return this.showDisplay();
    };

    EditableTemplateView.prototype.afterAdd = function() {
      return this.showEdit();
    };

    return EditableTemplateView;

  })(Foundation.TemplateView);

  Foundation.CollectionView = (function(_super) {

    __extends(CollectionView, _super);

    function CollectionView() {
      this.showAll = __bind(this.showAll, this);
      this.hideSome = __bind(this.hideSome, this);
      this.getModelView = __bind(this.getModelView, this);
      this.removeModel = __bind(this.removeModel, this);
      this.removeModelView = __bind(this.removeModelView, this);
      this.addModel = __bind(this.addModel, this);
      this.addModelView = __bind(this.addModelView, this);
      this.setup = __bind(this.setup, this);
      this.remove = __bind(this.remove, this);
      this.render = __bind(this.render, this);
      this.getModels = __bind(this.getModels, this);
      this.unbindCollection = __bind(this.unbindCollection, this);
      this.bindCollection = __bind(this.bindCollection, this);
      this.initialize = __bind(this.initialize, this);
      CollectionView.__super__.constructor.apply(this, arguments);
    }

    CollectionView.prototype.prependNew = false;

    CollectionView.prototype.initialize = function() {
      _(this.options).defaults({
        prependNew: this.prependNew
      });
      this.prependNew = this.options.prependNew;
      this.collection = this.options.collection;
      this.modelViewClass = this.options.modelViewClass;
      this.modelViews = {};
      this.setup;
      this.bindCollection(this.collection);
      return CollectionView.__super__.initialize.call(this);
    };

    CollectionView.prototype.bindCollection = function(collection) {
      this.collection.bind("add", this.addModel);
      this.collection.bind("remove", this.removeModel);
      this.collection.bind("sort", this.render);
      return this.collection.bind("reset", this.setup);
    };

    CollectionView.prototype.unbindCollection = function(collection) {
      this.collection.unbind("add", this.addModel);
      this.collection.unbind("remove", this.removeModel);
      this.collection.unbind("sort", this.render);
      return this.collection.unbind("reset", this.setup);
    };

    CollectionView.prototype.getModels = function() {
      return this.collection.models;
    };

    CollectionView.prototype.render = function() {
      var $el, model, view, _i, _len, _ref;
      $el = $(this.el);
      $el.empty();
      _ref = this.getModels();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        model = _ref[_i];
        view = this.modelViews[model.cid];
        if (view) {
          $el.append(view.el);
          view.render();
        } else {
          console && console.log("CollectionViewError: ModelView not found for ", model);
        }
      }
      return CollectionView.__super__.render.apply(this, arguments);
    };

    CollectionView.prototype.remove = function() {
      this.unbindCollection(this.collection);
      return CollectionView.__super__.remove.apply(this, arguments);
    };

    CollectionView.prototype.setup = function() {
      var model, view, _i, _j, _len, _len2, _ref, _ref2;
      _ref = this.modelViews;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        view = _ref[_i];
        view.remove();
      }
      this.modelViews = {};
      _ref2 = this.getModels();
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        model = _ref2[_j];
        this.addModelView(model);
      }
      return this.render();
    };

    CollectionView.prototype.addModelView = function(model) {
      this.removeModelView(model);
      return this.modelViews[model.cid] = new this.modelViewClass({
        model: model
      });
    };

    CollectionView.prototype.addModel = function(model) {
      var view;
      view = this.addModelView(model);
      if (this.prependNew) {
        $(this.el).prepend(view.el);
      } else {
        $(this.el).append(view.el);
      }
      view.render();
      if (view.afterAdd) return view.afterAdd();
    };

    CollectionView.prototype.removeModelView = function(model) {
      var view,
        _this = this;
      view = this.modelViews[model.cid];
      if (view) {
        return $(view.el).fadeOut(function() {
          _this.modelViews[model.cid].remove();
          return delete _this.modelViews[model.cid];
        });
      }
    };

    CollectionView.prototype.removeModel = function(model) {
      this.removeModelView(model);
      return this.render();
    };

    CollectionView.prototype.getModelView = function(model) {
      var view;
      view = this.modelViews[model.cid];
      if (view) {
        return view;
      } else {
        return console && console.log("CollectionViewError: ModelView not found for ", model);
      }
    };

    CollectionView.prototype.hideSome = function(hideFn) {
      var model, models, view, _i, _len, _results;
      models = this.getModels();
      _results = [];
      for (_i = 0, _len = models.length; _i < _len; _i++) {
        model = models[_i];
        view = this.getModelView(model);
        if (hideFn(model)) {
          _results.push($(view.el).hide());
        } else {
          _results.push($(view.el).show());
        }
      }
      return _results;
    };

    CollectionView.prototype.showAll = function() {
      var model, models, view, _i, _len, _results;
      models = this.getModels();
      _results = [];
      for (_i = 0, _len = models.length; _i < _len; _i++) {
        model = models[_i];
        view = this.getModelView(model);
        _results.push($(view.el).show());
      }
      return _results;
    };

    return CollectionView;

  })(Backbone.View);

  Foundation.FilteredCollectionView = (function(_super) {

    __extends(FilteredCollectionView, _super);

    function FilteredCollectionView() {
      this.addModel = __bind(this.addModel, this);
      this.getModels = __bind(this.getModels, this);
      this.setFilter = __bind(this.setFilter, this);
      this.initialize = __bind(this.initialize, this);
      FilteredCollectionView.__super__.constructor.apply(this, arguments);
    }

    FilteredCollectionView.prototype.filter = function(model) {
      return true;
    };

    FilteredCollectionView.prototype.initialize = function() {
      if (this.options.filter) this.filter = this.options.filter;
      return FilteredCollectionView.__super__.initialize.call(this);
    };

    FilteredCollectionView.prototype.setFilter = function(filter) {
      this.filter = filter;
      return this.setup();
    };

    FilteredCollectionView.prototype.getModels = function() {
      return this.collection.filter(this.filter);
    };

    FilteredCollectionView.prototype.addModel = function(model) {
      if (this.filter(model)) {
        return FilteredCollectionView.__super__.addModel.call(this, model);
      }
    };

    return FilteredCollectionView;

  })(Foundation.CollectionView);

  methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'delete': 'DELETE',
    'read': 'GET'
  };

  getUrl = function(object) {
    if (!(object && object.url)) return null;
    if (_.isFunction(object.url)) {
      return object.url();
    } else {
      return object.url;
    }
  };

  getParams = function(object) {
    var key, queryParams, queryString, value;
    if (!(object && object.url)) return "";
    queryParams = _.isFunction(object.queryParams) ? object.queryParams() : object.queryParams;
    queryString = "";
    if (queryParams && !_.isEmpty(queryParams)) {
      for (key in queryParams) {
        value = queryParams[key];
        queryString = "?" + ("" + key + "=" + value);
      }
    }
    return queryString;
  };

  urlError = function() {
    throw new Error('A "url" property or function must be specified');
  };

  Backbone.sync = function(method, model, options) {
    var params, type;
    type = methodMap[method];
    params = _.extend({
      type: type,
      dataType: 'json'
    }, options);
    if (!params.url) {
      params.url = getUrl(model) || urlError();
      params.url += getParams(model);
    }
    if (!params.data && model && (method === 'create' || method === 'update')) {
      params.contentType = 'application/json';
      params.data = JSON.stringify(model.toJSON());
    }
    if (params.type !== 'GET') params.processData = false;
    return $.ajax(params);
  };

  init = function() {
    var csrfToken, init, _i, _len, _ref;
    csrfToken = $('input[name=csrfmiddlewaretoken]').val();
    $(document).ajaxSend(function(e, xhr, settings) {
      return xhr.setRequestHeader('X-CSRFToken', csrfToken);
    });
    $.ajaxSetup({
      cache: false
    });
    _ref = Foundation.inits;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      init = _ref[_i];
      init();
    }
    if (Backbone.history) return Backbone.history.start();
  };

  $(document).ready(init);

}).call(this);
