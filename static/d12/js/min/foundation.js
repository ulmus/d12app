(function() {
  var AppController, Collection, CollectionView, FilteredCollectionView, Model, ModelView, ModuleController, ModuleMainView, Router, StaticView, TemplateView, View, addTemplate, generateTemplates, getTemplate, init, markdownConverter, templateHash,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  markdownConverter = Markdown.getSanitizingConverter();

  Handlebars.registerHelper("markdown", function(markdownText) {
    return markdownConverter.makeHtml(markdownText);
  });

  Handlebars.registerHelper("collectionCount", function(collection) {
    return collection.length;
  });

  Handlebars.registerHelper("anchor", function(anchorString) {
    if (anchorString && this.anchors && this.anchors[anchorString]) {
      return " data-anchor='" + this.anchors[anchorString] + "' ";
    } else {
      return "";
    }
  });

  templateHash = {};

  addTemplate = function(templateName, templateString) {
    return templateHash[templateName] = Handlebars.compile(templateString);
  };

  generateTemplates = function() {
    var scriptTag, scripts, tag, _i, _len, _results;
    scripts = $("script[type='text/x-template']");
    _results = [];
    for (_i = 0, _len = scripts.length; _i < _len; _i++) {
      scriptTag = scripts[_i];
      tag = $(scriptTag);
      _results.push(addTemplate(tag.attr("id"), tag.html()));
    }
    return _results;
  };

  getTemplate = function(templateName) {
    if (templateHash[templateName]) {
      return templateHash[templateName];
    } else {
      console && console.log("TemplateError: Couldn't find " + templateName);
      return $.noop;
    }
  };

  generateTemplates();

  Collection = (function(_super) {

    __extends(Collection, _super);

    function Collection() {
      Collection.__super__.constructor.apply(this, arguments);
    }

    Collection.storeName = "collection";

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

  Model = (function(_super) {

    __extends(Model, _super);

    function Model() {
      Model.__super__.constructor.apply(this, arguments);
    }

    Model.readonly = [];

    Model.prototype.schema = {};

    Model.prototype.initialize = function() {
      this._params = {};
      return Model.__super__.initialize.call(this);
    };

    Model.prototype.queryParams = function() {
      return this._params;
    };

    Model.prototype.setParam = function(key, value) {
      return this._params[key] = value;
    };

    Model.prototype.unsetParam = function(key) {
      return delete this._params[key];
    };

    Model.prototype.toString = function() {
      return "model";
    };

    Model.prototype.url = function() {
      if (this.isNew()) {
        return this.rootUrl;
      } else {
        return this.rootUrl + this.id;
      }
    };

    Model.prototype.canUpdate = function() {
      return true;
    };

    Model.prototype.canDelete = function() {
      return true;
    };

    Model.prototype.canCreate = function() {
      return true;
    };

    Model.prototype.canRead = function() {
      return true;
    };

    return Model;

  })(Backbone.Model);

  Router = (function(_super) {

    __extends(Router, _super);

    function Router() {
      Router.__super__.constructor.apply(this, arguments);
    }

    return Router;

  })(Backbone.Router);

  /*
  The basic Foundation View, includes functionality for handling subViews in the view, including hooks for
  anchors used among other places in Foundation.TemplateView
  */

  View = (function(_super) {

    __extends(View, _super);

    function View() {
      View.__super__.constructor.apply(this, arguments);
    }

    View.prototype.events = function() {
      return {};
    };

    View.prototype.attributes = function() {
      return {};
    };

    View.prototype.className = function() {
      return "";
    };

    View.prototype.initialize = function() {
      var _ref;
      this.childViews = (_ref = this.options.childViews) != null ? _ref : {};
      return View.__super__.initialize.call(this);
    };

    View.prototype.addChildView = function(newChildView, options) {
      if (!newChildView) return null;
      if (options == null) options = {};
      _.defaults(options, {
        render: true,
        anchor: null,
        placement: "set"
      });
      this.childViews[newChildView.cid] = {
        view: newChildView,
        options: options
      };
      return newChildView;
    };

    View.prototype.removeChildView = function(childView) {
      if (childView) return delete this.childViews[childView.cid];
    };

    View.prototype.getChildView = function(cid) {
      var _ref;
      return (_ref = this.childViews[cid]) != null ? _ref.view : void 0;
    };

    View.prototype.remove = function() {
      var childView, cid, _ref, _ref2;
      _ref = this.childViews;
      for (cid in _ref) {
        childView = _ref[cid];
        if ((_ref2 = childView.view) != null) _ref2.remove();
      }
      this.unbind();
      return View.__super__.remove.call(this);
    };

    View.prototype.render = function() {
      var anchorElement, childView, cid, _ref, _results;
      View.__super__.render.call(this);
      _ref = this.childViews;
      _results = [];
      for (cid in _ref) {
        childView = _ref[cid];
        if (childView.options.anchor) {
          anchorElement = this.$("[data-anchor='" + childView.options.anchor + "']");
          switch (childView.options.placement) {
            case "inside":
              anchorElement.empty();
              anchorElement.append(childView.view.el);
              break;
            case "replace":
              anchorElement.replaceWith(childView.view.el);
              break;
            default:
              childView.view.setElement(anchorElement);
          }
        }
        if (childView.options.render) {
          _results.push(childView.view.render());
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    return View;

  })(Backbone.View);

  Backbone.Form.editors.MultipleSelect = (function(_super) {

    __extends(MultipleSelect, _super);

    function MultipleSelect() {
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
      ChosenSelect.__super__.constructor.apply(this, arguments);
    }

    ChosenSelect.prototype.renderOptions = function(options) {
      ChosenSelect.__super__.renderOptions.call(this, options);
      return $(this.el).addClass("chosen-select");
    };

    return ChosenSelect;

  })(Backbone.Form.editors.Select);

  /*
  A static HTML view for static content, re-rendered on render
  */

  StaticView = (function(_super) {

    __extends(StaticView, _super);

    function StaticView() {
      StaticView.__super__.constructor.apply(this, arguments);
    }

    StaticView.prototype.content = "";

    StaticView.prototype.initialize = function() {
      var _ref;
      this.content = (_ref = this.options.content) != null ? _ref : this.content;
      this.$el.html(this.content);
      return StaticView.__super__.initialize.call(this);
    };

    StaticView.prototype.render = function() {
      this.$el.html(this.content);
      StaticView.__super__.render.call(this);
      return this;
    };

    StaticView.prototype.setContent = function(newContent) {
      this.content = newContent;
      this.$el.html(this.content);
      return this.render();
    };

    return StaticView;

  })(View);

  /*
  A view with a template, rendering the template content on render using the getContext method to get context to put into
  the template. Will take compiled template functions as an option.template or as a constructor on a child class.
  */

  TemplateView = (function(_super) {

    __extends(TemplateView, _super);

    function TemplateView() {
      TemplateView.__super__.constructor.apply(this, arguments);
    }

    TemplateView.prototype.initialize = function() {
      var _ref, _ref2, _ref3;
      this.context = (_ref = this.options.context) != null ? _ref : {};
      this.template = (_ref2 = (_ref3 = this.options.template) != null ? _ref3 : this.constructor.template) != null ? _ref2 : $.noop;
      return TemplateView.__super__.initialize.call(this);
    };

    TemplateView.prototype.render = function() {
      this.$el.html(this.template(this.getContext()));
      TemplateView.__super__.render.call(this);
      return this;
    };

    TemplateView.prototype.getContext = function() {
      return this.context;
    };

    return TemplateView;

  })(View);

  /*
  A TemplateView that takes its context from a model or a collection, if a Model is given in the options, the context
  is extended with 'model' and 'attr' keys with references to the model instance and its attributes respectively. If the
  model option points to a collection, the context instead gets the keys 'collection', 'models' and 'attrs' respectively
  referring to the collection, its models and the model attributes using toJSON on the collection
  The view is bound to "change", "add", "reset" and "remove" events on the model/collection and will
  re-render on those events.
  As a hook for the CollectionView, the ModelView has an "afterAdd" callback that can be overridden to provide functionality
  for when the modelView is added to a collectionView.
  */

  ModelView = (function(_super) {

    __extends(ModelView, _super);

    function ModelView() {
      ModelView.__super__.constructor.apply(this, arguments);
    }

    ModelView.prototype.className = function() {
      return "";
    };

    ModelView.prototype.attributes = function() {
      return {};
    };

    ModelView.prototype.initialize = function() {
      var _ref;
      this.bindModel(this.model);
      this.showEditOnNew = (_ref = this.options.showEditOnNew) != null ? _ref : this.showEditOnNew;
      return ModelView.__super__.initialize.call(this);
    };

    ModelView.prototype.render = function() {
      ModelView.__super__.render.call(this);
      this.setAttributes();
      return this;
    };

    ModelView.prototype.setAttributes = function() {
      var attr;
      if (this.model) {
        attr = this.attributes();
        attr["class"] = _.isFunction(this.className) ? this.className() : this.className;
        this.$el.attr(attr);
        this.$el.data("modelId", this.model.id);
        return this.$el.data("modelCid", this.model.cid);
      }
    };

    ModelView.prototype.setClassName = function() {
      return this.$el;
    };

    ModelView.prototype.getContext = function() {
      var context, _ref, _ref2, _ref3;
      context = ModelView.__super__.getContext.call(this);
      if (this.model && this.model instanceof Model) {
        _.extend(context, {
          model: this.model,
          attr: (_ref = (_ref2 = this.model) != null ? _ref2.toJSON() : void 0) != null ? _ref : {}
        });
      } else if (this.model instanceof Collection) {
        _.extend(context, {
          collection: this.model,
          models: (_ref3 = this.model) != null ? _ref3.models : void 0
        });
      }
      return context;
    };

    ModelView.prototype.setModel = function(newModel) {
      this.unbindModel(this.model);
      this.model = newModel;
      this.bindModel(this.model);
      return this.render();
    };

    ModelView.prototype.bindModel = function(model) {
      if (model && model instanceof Model) {
        return model.bind("change", this.render, this);
      } else if (model instanceof Collection) {
        model.bind("change", this.render, this);
        model.bind("add", this.render, this);
        model.bind("reset", this.render, this);
        return model.bind("remove", this.render, this);
      }
    };

    ModelView.prototype.unbindModel = function(model) {
      if (model && model instanceof Backbone.Model) {
        return model.unbind("change", this.render);
      } else if (model instanceof Backbone.Collection) {
        model.bind("change", this.render);
        model.unbind("add", this.render);
        model.unbind("reset", this.render);
        return model.unbind("remove", this.render);
      }
    };

    ModelView.prototype.remove = function() {
      this.unbindModel(this.model);
      return ModelView.__super__.remove.call(this);
    };

    ModelView.prototype.afterAdd = function() {
      if (this.showEditOnNew && this.model.isNew()) return this.showEdit();
    };

    return ModelView;

  })(TemplateView);

  CollectionView = (function(_super) {

    __extends(CollectionView, _super);

    function CollectionView() {
      CollectionView.__super__.constructor.apply(this, arguments);
    }

    CollectionView.prototype.modelViewClass = null;

    CollectionView.prototype.prependNew = false;

    CollectionView.prototype.initialize = function() {
      var _ref, _ref2, _ref3, _ref4, _ref5, _ref6;
      _(this.options).defaults({
        prependNew: this.prependNew
      });
      _.defaults(this, {});
      this.prependNew = (_ref = this.options.prependNew) != null ? _ref : this.prependNew;
      this.headerView = (_ref2 = this.options.headerView) != null ? _ref2 : null;
      this.footerView = (_ref3 = this.options.footerView) != null ? _ref3 : null;
      this.collection = (_ref4 = this.options.collection) != null ? _ref4 : null;
      this.modelViewClass = (_ref5 = this.options.modelViewClass) != null ? _ref5 : this.cmodelViewClass;
      this.modelViewOptions = (_ref6 = this.options.modelViewOptions) != null ? _ref6 : this.modelViewOptions;
      this.modelViews = {};
      this.setup();
      this.bindCollection(this.collection);
      return CollectionView.__super__.initialize.call(this);
    };

    CollectionView.prototype.bindCollection = function(collection) {
      this.collection.bind("add", this.addModel, this);
      this.collection.bind("remove", this.removeModel, this);
      this.collection.bind("sort", this.render, this);
      return this.collection.bind("reset", this.setupAndRender, this);
    };

    CollectionView.prototype.unbindCollection = function(collection) {
      this.collection.unbind("add", this.addModel, this);
      this.collection.unbind("remove", this.removeModel, this);
      this.collection.unbind("sort", this.render, this);
      return this.collection.unbind("reset", this.setupAndRender, this);
    };

    CollectionView.prototype.getModels = function() {
      return this.collection.models;
    };

    CollectionView.prototype.render = function() {
      var model, view, _i, _len, _ref;
      this.$el.empty();
      if (this.headerView) {
        this.$el.append(this.headerView.el);
        this.headerView.render();
      }
      _ref = this.getModels();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        model = _ref[_i];
        view = this.modelViews[model.cid];
        if (view) {
          this.$el.append(view.el);
          view.render();
          view.delegateEvents();
        } else {
          console && console.log("CollectionViewError: ModelView not found for ", model);
        }
      }
      if (this.footerView) {
        this.$el.append(this.footerView.el);
        this.footerView.render();
      }
      CollectionView.__super__.render.call(this);
      return this;
    };

    CollectionView.prototype.remove = function() {
      this.unbindCollection(this.collection);
      return CollectionView.__super__.remove.apply(this, arguments);
    };

    CollectionView.prototype.setup = function() {
      var model, view, _i, _j, _len, _len2, _ref, _ref2, _results;
      _ref = this.modelViews;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        view = _ref[_i];
        view.remove();
      }
      this.modelViews = {};
      _ref2 = this.getModels();
      _results = [];
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        model = _ref2[_j];
        _results.push(this.addModelView(model));
      }
      return _results;
    };

    CollectionView.prototype.setupAndRender = function() {
      this.setup();
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
        if (this.headerView) {
          $(view.el).insertAfter(this.headerView.el);
        } else {
          $(this.el).prepend(view.el);
        }
      } else {
        if (this.footerView) {
          $(view.el).insertBefore(this.footerView.el);
        } else {
          $(this.el).append(view.el);
        }
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

    CollectionView.prototype.setHeaderView = function(newHeaderView) {
      this.headerView.remove();
      this.headerView = newHeaderView;
      if (this.headerView) {
        $(this.el).prepend(this.headerView.el);
        return this.headerView.render();
      }
    };

    CollectionView.prototype.setFooterView = function(newFooterView) {
      this.footerView.remove();
      this.footerView = newFooterView;
      if (this.footerView) {
        $(this.el).prepend(this.footerView.el);
        return this.footerView.render();
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

  })(View);

  FilteredCollectionView = (function(_super) {

    __extends(FilteredCollectionView, _super);

    function FilteredCollectionView() {
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
      return this.setupAndRender();
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

  })(CollectionView);

  ModuleController = (function() {

    function ModuleController() {}

    ModuleController.name = "module";

    ModuleController.prototype.initialize = function() {
      this.name = this.constructor.name;
      return true;
    };

    ModuleController.prototype.setup = function() {
      return true;
    };

    return ModuleController;

  })();

  ModuleMainView = (function(_super) {

    __extends(ModuleMainView, _super);

    function ModuleMainView() {
      ModuleMainView.__super__.constructor.apply(this, arguments);
    }

    ModuleMainView.content = "<div class='span2 module-sidebar'></div><div class='span10 module-content'></div>";

    ModuleMainView.prototype.initialize = function() {
      var _ref;
      ModuleMainView.__super__.initialize.call(this);
      this.name = (_ref = this.options.moduleName) != null ? _ref : "module";
      return $(this.el).attr("id", "module-" + this.name);
    };

    return ModuleMainView;

  })(StaticView);

  AppController = (function() {

    function AppController() {}

    AppController.prototype.initialize = function() {
      var Module, moduleName, _ref;
      this.modules = {};
      this.modulesContainerElement = $("#app-main");
      this.modulesNavigationElement = $("#app-nav");
      this.startPath = "#/";
      _ref = Foundation.Modules;
      for (moduleName in _ref) {
        Module = _ref[moduleName];
        this.registerModule(moduleName, new Module.ModuleController());
      }
      if (Backbone.history) Backbone.history.start();
      return window.location.hash = this.startPath;
    };

    AppController.prototype.showModule = function(module) {
      var aModule, aModuleName, _ref, _results;
      if (_.isString(module)) module = this.modules[module];
      _ref = this.modules;
      _results = [];
      for (aModuleName in _ref) {
        aModule = _ref[aModuleName];
        if (aModule === module) {
          _results.push($(aModule.mainView.el).show());
        } else {
          _results.push($(aModule.mainView.el).hide());
        }
      }
      return _results;
    };

    AppController.prototype.registerModule = function(moduleName, module) {
      this.modules[moduleName] = module;
      module.initialize();
      module.setup();
      if (module.mainView) {
        $(module.mainView.el).appendTo(this.modulesContainerElement);
      }
      if (module.label) {
        this.modulesNavigationElement.append("<li><a href='#" + module.path + "'>" + module.label + "</a></li>");
      }
      if (module.start) return this.startPath = module.path;
    };

    AppController.prototype.deRegisterModule = function(moduleName) {
      modules[moduleName] = null;
      return delete modules[moduleName];
    };

    return AppController;

  })();

  init = function() {
    var app, csrfToken;
    csrfToken = $('input[name=csrfmiddlewaretoken]').val();
    $(document).ajaxSend(function(e, xhr, settings) {
      return xhr.setRequestHeader('X-CSRFToken', csrfToken);
    });
    $.ajaxSetup({
      cache: false
    });
    app = new AppController();
    window.app = app;
    return app.initialize();
  };

  window.Foundation = {
    Modules: {},
    Model: Model,
    Collection: Collection,
    Router: Router,
    View: View,
    TemplateView: TemplateView,
    ModelView: ModelView,
    CollectionView: CollectionView,
    FilteredCollectionView: FilteredCollectionView,
    StaticView: StaticView,
    ModuleMainView: ModuleMainView,
    ModuleController: ModuleController,
    init: init
  };

}).call(this);
