(function() {
  var Button, ButtonCollection, ButtonView, EditableModelView, Foundation, ModalView, ToolbarView, WithButtonView,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Foundation = window.Foundation;

  Button = (function(_super) {

    __extends(Button, _super);

    function Button() {
      Button.__super__.constructor.apply(this, arguments);
    }

    Button.prototype.defaults = function() {
      return {
        label: "Press me",
        icon: "",
        onClick: $.noop,
        onClickArgs: {},
        enabled: true,
        buttonClass: "",
        type: "button",
        menu: new ButtonCollection()
      };
    };

    return Button;

  })(Foundation.Model);

  ButtonCollection = (function(_super) {

    __extends(ButtonCollection, _super);

    function ButtonCollection() {
      ButtonCollection.__super__.constructor.apply(this, arguments);
    }

    ButtonCollection.prototype.model = Button;

    return ButtonCollection;

  })(Foundation.Collection);

  ModalView = (function(_super) {

    __extends(ModalView, _super);

    function ModalView() {
      ModalView.__super__.constructor.apply(this, arguments);
    }

    ModalView.prototype.fade = true;

    ModalView.prototype.okOnAltReturn = false;

    ModalView.prototype.className = function() {
      var className;
      className = ModalView.__super__.className.call(this) + " modal";
      if (this.fade) className += " fade";
      return className;
    };

    ModalView.template = Handlebars.compile('\
		<div class="modal-header">\
			<a class="close" data-dismiss="modal">&times;</a>\
			<h3>{{header}}</h3>\
		</div>\
		<div class="modal-body" data-anchor="bodyView">\
		</div>\
		<div class="modal-footer" data-anchor="footerView">\
		</div>\
	');

    ModalView.prototype.events = function() {
      return {
        'keydown': 'keydown',
        'keyup': 'keyup'
      };
    };

    ModalView.prototype.initialize = function() {
      var defaultButtons, _ref, _ref2, _ref3,
        _this = this;
      ModalView.__super__.initialize.call(this);
      defaultButtons = [
        {
          label: "OK",
          buttonClass: "primary",
          onClick: function() {
            return _this.trigger("modal:ok");
          }
        }, {
          label: "Cancel",
          onClick: function() {
            _this.trigger("modal:cancel");
            return _this.hideModal();
          }
        }
      ];
      this.fade = this.options.fade;
      this.buttons = new ButtonCollection((_ref = this.options.buttons) != null ? _ref : defaultButtons);
      this.header = (_ref2 = this.options.header) != null ? _ref2 : "Modal";
      this.bodyView = this.addChildView(this.options.bodyView, {
        anchor: "bodyView",
        placement: "inside"
      });
      this.footerView = this.addChildView(new Foundation.CollectionView({
        collection: this.buttons,
        modelViewClass: ButtonView
      }), {
        anchor: "footerView"
      });
      return this.okOnAltReturn = (_ref3 = this.options.okOnAltReturn) != null ? _ref3 : this.okOnAltReturn;
    };

    ModalView.prototype.keydown = function(event) {
      switch (event.which) {
        case 13:
          if (this.altPressed && this.okOnAltReturn) {
            return this.trigger("modal:ok");
          }
          break;
        case 18:
          return this.altPressed = true;
      }
    };

    ModalView.prototype.keyup = function(event) {
      switch (event.which) {
        case 18:
          return this.altPressed = false;
      }
    };

    ModalView.prototype.getContext = function() {
      var context;
      context = ModalView.__super__.getContext.call(this);
      return _.extend(context, {
        header: this.header
      });
    };

    ModalView.prototype.showModal = function() {
      return this.$el.modal({
        backdrop: true,
        keyboard: true
      });
    };

    ModalView.prototype.hideModal = function() {
      return this.$el.modal("hide");
    };

    return ModalView;

  })(Foundation.TemplateView);

  ButtonView = (function(_super) {

    __extends(ButtonView, _super);

    function ButtonView() {
      ButtonView.__super__.constructor.apply(this, arguments);
    }

    ButtonView.template = Handlebars.compile('<a href="#" title="{{attr.label}}" class="btn {{attr.buttonClass}} {{#unless attr.enabled}}disabled{{/unless}}">{{#if attr.icon}}<i class="{{attr.icon}}"></i>{{/if}}{{attr.label}}</a>');

    ButtonView.dropDownTemplate = Handlebars.compile('<div class="btn-group">\
		<a href="#" title="{{attr.label}}" class="btn dropdown-toggle {{attr.buttonClass}} {{#unless attr.enabled}}disabled{{/unless}}">{{#if attr.icon}}<i class="{{attr.icon}}"></i>{{/if}}{{attr.label}} <span class="caret"></span></a>\
		<ul class="dropdown-menu">\
		{{#each attr.menu.models}}\
			<li><a href="#" title="{{this.attributes.label}}" data-menuitem-cid="{{this.cid}}" class="menu-item {{#unless this.attributes.enabled}}disabled{{/unless}}">{{#if this.attributes.icon}}<i class="{{this.attributes.icon}}"></i>{{/if}}{{this.attributes.label}}</a>\
		{{/each}}\
		</ul>\
		</div>');

    ButtonView.prototype.events = function() {
      var events;
      events = ButtonView.__super__.events.call(this);
      _.extend(events, {
        "click a.btn": "onClick",
        "click a.menu-item": "onMenuClick"
      });
      return events;
    };

    ButtonView.prototype.render = function() {
      switch (this.model.get("type")) {
        case "button":
          this.template = this.constructor.template;
          break;
        case "dropdown":
          this.template = this.constructor.dropDownTemplate;
      }
      ButtonView.__super__.render.call(this);
      switch (this.model.get("type")) {
        case "dropdown":
          this.$(".dropdown-toggle").dropdown();
      }
      return this;
    };

    ButtonView.prototype.onClick = function(event) {
      if (this.model.get("enabled")) {
        this.model.get("onClick")(this.model.get("onClickArgs"));
      }
      return event.preventDefault();
    };

    ButtonView.prototype.onMenuClick = function(event) {
      var cid, menuItem;
      if (this.model.get("enabled")) {
        cid = $(event.currentTarget).data("menuitemCid");
        menuItem = this.model.get("menu").getByCid(cid);
        if (menuItem != null) menuItem.get("onClick")(menuItem.get("onClickArgs"));
      }
      return event.preventDefault();
    };

    return ButtonView;

  })(Foundation.ModelView);

  WithButtonView = (function(_super) {

    __extends(WithButtonView, _super);

    function WithButtonView() {
      WithButtonView.__super__.constructor.apply(this, arguments);
    }

    WithButtonView.prototype.className = function() {
      return "relative";
    };

    WithButtonView.prototype.initialize = function() {
      WithButtonView.__super__.initialize.call(this);
      this.addChildView(this.options.mainView);
      return this.addChildView(new ButtonView({
        className: "anchored-button",
        model: this.options.button
      }));
    };

    return WithButtonView;

  })(Foundation.View);

  ToolbarView = (function(_super) {

    __extends(ToolbarView, _super);

    function ToolbarView() {
      ToolbarView.__super__.constructor.apply(this, arguments);
    }

    ToolbarView.prototype.className = "btn-toolbar well";

    ToolbarView.prototype.modelViewClass = ButtonView;

    return ToolbarView;

  })(Foundation.CollectionView);

  EditableModelView = (function(_super) {

    __extends(EditableModelView, _super);

    function EditableModelView() {
      EditableModelView.__super__.constructor.apply(this, arguments);
    }

    EditableModelView.prototype.showEditOnNew = true;

    EditableModelView.prototype.remove = function() {
      var _ref;
      this.unbindModel(this.model);
      EditableModelView.__super__.remove.call(this);
      return (_ref = this.formModal) != null ? _ref.remove() : void 0;
    };

    EditableModelView.prototype.render = function() {
      var _this = this;
      if (!this.formModal) {
        this.formView = new Backbone.Form({
          model: this.model
        });
        this.formModal = new ModalView({
          header: "Edit " + this.model.constructor.name,
          bodyView: this.formView,
          okOnAltReturn: true,
          buttons: [
            {
              label: "OK [alt+enter]",
              buttonClass: "btn-primary",
              onClick: function(modal) {
                return _this.hideEditAndSave();
              }
            }, {
              label: "Delete",
              buttonClass: "btn-danger btn-left",
              onClick: function(modal) {
                if (confirm("Delete " + _this.model.constructor.name + "?")) {
                  _this.model.destroy();
                }
                return _this.hideEdit();
              }
            }, {
              label: "Cancel",
              onClick: function(modal) {
                return _this.hideEdit();
              }
            }
          ]
        });
        this.formModal.bind("modal:ok", this.hideEditAndSave, this);
        this.formModal.render();
      }
      return EditableModelView.__super__.render.call(this);
    };

    EditableModelView.prototype.showEdit = function() {
      var _ref, _ref2;
      if ((_ref = this.formView) != null) _ref.render();
      if ((_ref2 = this.formModal) != null) _ref2.showModal();
      return this.formView.$el.find(":input").first().focus();
    };

    EditableModelView.prototype.hideEdit = function() {
      var _ref;
      return (_ref = this.formModal) != null ? _ref.hideModal() : void 0;
    };

    EditableModelView.prototype.hideEditAndSave = function() {
      var errors, _ref;
      errors = (_ref = this.formView) != null ? _ref.commit() : void 0;
      if (!errors) {
        this.model.save();
        return this.hideEdit();
      }
    };

    EditableModelView.prototype.afterAdd = function() {
      if (this.showEditOnNew && this.model.isNew()) return this.showEdit();
    };

    return EditableModelView;

  })(Foundation.ModelView);

  Foundation.UI = {
    Button: Button,
    ButtonCollection: ButtonCollection,
    ButtonView: ButtonView,
    ToolbarView: ToolbarView,
    ModalView: ModalView,
    EditableModelView: EditableModelView
  };

}).call(this);
