(function() {
  var Foundation, init, templateHash,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  window.Foundation = Foundation = {};

  window.Foundation.inits = [];

  Foundation.markdownConverter = Markdown.getSanitizingConverter();

  Handlebars.registerHelper("cardActionDisplay", function(abbr) {
    switch (abbr) {
      case "ACTN":
        return "Action";
      case "MOVE":
        return "Move";
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

  Foundation.TemplateView = (function(_super) {

    __extends(TemplateView, _super);

    function TemplateView() {
      this.remove = __bind(this.remove, this);
      this.unbindModel = __bind(this.unbindModel, this);
      this.bindModel = __bind(this.bindModel, this);
      this.setModel = __bind(this.setModel, this);
      this.postRender = __bind(this.postRender, this);
      this.preRender = __bind(this.preRender, this);
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
      this.preRender();
      if (this.model && this.constructor.template) {
        $(this.el).html(this.constructor.template({
          model: this.model.toJSON()
        }));
      }
      this.delegateEvents();
      TemplateView.__super__.render.apply(this, arguments);
      return this.postRender();
    };

    TemplateView.prototype.preRender = function() {};

    TemplateView.prototype.postRender = function() {};

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
      this.onShowClickable = __bind(this.onShowClickable, this);
      this.onShowEdit = __bind(this.onShowEdit, this);
      this.attributeEditKeypress = __bind(this.attributeEditKeypress, this);
      this.attributeEditDone = __bind(this.attributeEditDone, this);
      this.attributeEditDoneClick = __bind(this.attributeEditDoneClick, this);
      this.attributeEditStart = __bind(this.attributeEditStart, this);
      this.attributeEditStartClick = __bind(this.attributeEditStartClick, this);
      this.initialize = __bind(this.initialize, this);
      EditableTemplateView.__super__.constructor.apply(this, arguments);
    }

    EditableTemplateView.prototype.autoSave = false;

    EditableTemplateView.prototype.initialize = function() {
      this.events["click [data-attribute-editclick]"] = "attributeEditStartClick";
      this.events["blur [data-attribute-edit]"] = "attributeEditDoneClick";
      this.events["keypress input[type='text'][data-attribute-edit]"] = "attributeEditKeypress";
      this.delegateEvents();
      _(this.autoSave).defaults({
        autoSave: this.options.autoSave
      });
      return EditableTemplateView.__super__.initialize.call(this);
    };

    EditableTemplateView.prototype.attributeEditStartClick = function(event) {
      return this.attributeEditStart($(event.currentTarget).data("attributeEditclick"));
    };

    EditableTemplateView.prototype.attributeEditStart = function(attribute) {
      var clickable, editable;
      clickable = this.$("[data-attribute-editclick='" + attribute + "']");
      editable = this.$("[data-attribute-edit='" + attribute + "']");
      clickable.hide();
      editable.val(this.model.get(attribute));
      editable.show();
      editable.focus();
      editable.select();
      return this.onShowEdit(attribute);
    };

    EditableTemplateView.prototype.attributeEditDoneClick = function(event) {
      return this.attributeEditDone($(event.currentTarget).data("attributeEdit"));
    };

    EditableTemplateView.prototype.attributeEditDone = function(attribute) {
      var clickable, data, editable;
      clickable = this.$("[data-attribute-editclick='" + attribute + "']");
      editable = this.$("[data-attribute-edit='" + attribute + "']");
      clickable = this.$("[data-attribute-editclick='" + attribute + "']");
      editable.hide();
      clickable.show();
      this.onShowClickable(attribute);
      data = {};
      data[attribute] = editable.val();
      this.model.set(data);
      if (this.autoSave) return this.model.save();
    };

    EditableTemplateView.prototype.attributeEditKeypress = function(event) {
      if (event.which === 13) return event.target.blur();
    };

    EditableTemplateView.prototype.onShowEdit = function(attribute) {};

    EditableTemplateView.prototype.onShowClickable = function(attribute) {};

    return EditableTemplateView;

  })(Foundation.TemplateView);

  Foundation.CollectionView = (function(_super) {

    __extends(CollectionView, _super);

    function CollectionView() {
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
      var view,
        _this = this;
      view = this.addModelView(model);
      if (this.prependNew) {
        $(this.el).prepend(view.el);
      } else {
        $(this.el).append(view.el);
      }
      $(this.el).append(view.el);
      $(view.el).hide();
      view.render();
      return $(view.el).fadeIn(function() {
        if (view.afterAdd) return view.afterAdd();
      });
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

    return CollectionView;

  })(Backbone.View);

  Foundation.FilteredCollectionView = (function(_super) {

    __extends(FilteredCollectionView, _super);

    function FilteredCollectionView() {
      this.addModel = __bind(this.addModel, this);
      this.getModels = __bind(this.getModels, this);
      this.initialize = __bind(this.initialize, this);
      this.filter = __bind(this.filter, this);
      FilteredCollectionView.__super__.constructor.apply(this, arguments);
    }

    FilteredCollectionView.prototype.filter = function(model) {
      return true;
    };

    FilteredCollectionView.prototype.initialize = function() {
      if (this.options.filter) this.filter = this.options.filter;
      return FilteredCollectionView.__super__.initialize.call(this);
    };

    FilteredCollectionView.prototype.getModels = function() {
      return this.collection.filter(this.filter);
    };

    FilteredCollectionView.prototype.addModel = function(model) {
      if (this.filter(model)) {
        return FilteredCollectionView.__super__.addModel.call(this);
      }
    };

    return FilteredCollectionView;

  })(Foundation.CollectionView);

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
