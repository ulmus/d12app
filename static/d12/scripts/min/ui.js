(function() {
  var Button, ButtonCollection, ButtonView, EditableModelView, Foundation, ModalEditView, ModalView, ToolbarView, editModel,
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

    ModalView.prototype.removeOnHide = false;

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
      var _ref, _ref2, _ref3, _ref4;
      ModalView.__super__.initialize.call(this);
      this.fade = this.options.fade;
      this.buttons = new ButtonCollection((_ref = this.options.buttons) != null ? _ref : this.getButtons());
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
      this.okOnAltReturn = (_ref3 = this.options.okOnAltReturn) != null ? _ref3 : this.okOnAltReturn;
      this.removeOnHide = (_ref4 = this.options.removeOnHide) != null ? _ref4 : this.removeOnHide;
      this.on("modal:ok", this.okModal, this);
      return this.on("modal:close", this.closeModal, this);
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

    ModalView.prototype.getButtons = function() {
      var _this = this;
      return [
        {
          label: "OK",
          buttonClass: "primary",
          onClick: function() {
            return _this.trigger("modal:ok");
          }
        }, {
          label: "Cancel",
          onClick: function() {
            return _this.trigger("modal:close");
          }
        }
      ];
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

    ModalView.prototype.okModal = function() {
      return this.hideModal();
    };

    ModalView.prototype.closeModal = function() {
      return this.hideModal();
    };

    ModalView.prototype.hideModal = function() {
      this.$el.modal("hide");
      if (this.removeOnHide) return this.remove();
    };

    return ModalView;

  })(Foundation.TemplateView);

  ModalEditView = (function(_super) {

    __extends(ModalEditView, _super);

    function ModalEditView() {
      ModalEditView.__super__.constructor.apply(this, arguments);
    }

    ModalEditView.prototype.okOnAltReturn = true;

    ModalEditView.prototype.initialize = function() {
      this.options.header = "Edit " + this.model.constructor.name;
      this.formView = this.options.bodyView = new Backbone.Form({
        model: this.model
      });
      return ModalEditView.__super__.initialize.call(this);
    };

    ModalEditView.prototype.getButtons = function() {
      var buttons,
        _this = this;
      buttons = [
        {
          label: "Save [alt+enter]",
          buttonClass: "btn-primary",
          onClick: function(modal) {
            return _this.trigger("modal:ok");
          }
        }, {
          label: "Close",
          onClick: function(modal) {
            return _this.trigger("modal:close");
          }
        }
      ];
      if (this.model.canDelete()) {
        buttons.push({
          label: "Delete",
          buttonClass: "btn-danger btn-left",
          onClick: function(modal) {
            if (confirm("Delete " + _this.model.constructor.name + "?")) {
              _this.model.destroy();
            }
            return _this.trigger("modal:close");
          }
        });
      }
      return buttons;
    };

    ModalEditView.prototype.okModal = function() {
      var errors;
      errors = this.formView.commit();
      if (!errors) {
        this.model.save();
        return this.hideModal();
      }
    };

    ModalEditView.prototype.showModal = function() {
      ModalEditView.__super__.showModal.call(this);
      return this.bodyView.$el.find(":input").first().focus();
    };

    return ModalEditView;

  })(ModalView);

  ButtonView = (function(_super) {

    __extends(ButtonView, _super);

    function ButtonView() {
      ButtonView.__super__.constructor.apply(this, arguments);
    }

    ButtonView.template = Handlebars.compile('<a href="#" title="{{attr.label}}" class="btn {{attr.buttonClass}} {{#unless attr.enabled}}disabled{{/unless}}">{{#if attr.icon}}<i class="icon-{{attr.icon}}"></i> {{/if}}{{attr.label}}</a>');

    ButtonView.dropDownTemplate = Handlebars.compile('<div class="btn-group">\
		<a href="#" title="{{attr.label}}" class="btn dropdown-toggle {{attr.buttonClass}} {{#unless attr.enabled}}disabled{{/unless}}">{{#if attr.icon}}<i class="icon-{{attr.icon}}"></i> {{/if}}{{attr.label}} <span class="caret"></span></a>\
		<ul class="dropdown-menu">\
		{{#each attr.menu.models}}\
			<li><a href="#" title="{{this.attributes.label}}" data-menuitem-cid="{{this.cid}}" class="menu-item {{#unless this.attributes.enabled}}disabled{{/unless}}">{{#if this.attributes.icon}}<i class="icon-{{this.attributes.icon}}"></i> {{/if}}{{this.attributes.label}}</a>\
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
      if (!this.formModal) {
        this.formModal = new ModalEditView({
          model: this.model
        });
        this.formModal.render();
      }
      EditableModelView.__super__.render.call(this);
      if (this.model.canUpdate()) return this.$el.addClass("clickable");
    };

    EditableModelView.prototype.showEdit = function() {
      var _ref;
      if (this.model.canUpdate()) {
        return (_ref = this.formModal) != null ? _ref.showModal() : void 0;
      }
    };

    EditableModelView.prototype.hideEdit = function() {
      var _ref;
      return (_ref = this.formModal) != null ? _ref.hideModal() : void 0;
    };

    EditableModelView.prototype.afterAdd = function() {
      if (this.showEditOnNew && this.model.isNew()) return this.showEdit();
    };

    return EditableModelView;

  })(Foundation.ModelView);

  editModel = function(model) {
    var modal;
    modal = new ModalEditView({
      model: model,
      removeOnHide: true
    });
    modal.render();
    return modal.showModal();
  };

  Foundation.UI = {
    Button: Button,
    ButtonCollection: ButtonCollection,
    ButtonView: ButtonView,
    ToolbarView: ToolbarView,
    ModalView: ModalView,
    ModalEditView: ModalEditView,
    editModel: editModel,
    EditableModelView: EditableModelView
  };

}).call(this);
