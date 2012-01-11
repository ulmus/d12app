(function() {
  var baseUrl,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.Cards = {};

  baseUrl = "/api/cards/";

  Cards.Card = (function(_super) {

    __extends(Card, _super);

    function Card() {
      Card.__super__.constructor.apply(this, arguments);
    }

    Card.prototype.urlRoot = baseUrl + "card/";

    Card.prototype.defaults = {
      description: "",
      title: "",
      phase_1: false,
      phase_2: false,
      phase_3: false,
      type: "ACTN",
      body: ""
    };

    Card.prototype.schema = {
      title: {
        type: "Text",
        title: "Title"
      },
      description: {
        type: "Text",
        title: "Description"
      },
      body: {
        type: "TextArea",
        title: "Card Text"
      },
      type: {
        type: "Select",
        title: "Card Type",
        options: [
          {
            val: "ACTN",
            label: "Primary"
          }, {
            val: "MOVE",
            label: "Move"
          }, {
            val: "SPRT",
            label: "Support"
          }, {
            val: "REAC",
            label: "Reaction"
          }
        ]
      },
      phase_1: {
        title: "Phase 1",
        type: "Checkbox"
      },
      phase_2: {
        title: "Phase 2",
        type: "Checkbox"
      },
      phase_3: {
        title: "Phase 3",
        type: "Checkbox"
      }
    };

    return Card;

  })(Backbone.Model);

  Cards.CardCollection = (function(_super) {
    var favorites;

    __extends(CardCollection, _super);

    function CardCollection() {
      this.initialize = __bind(this.initialize, this);
      this.addCard = __bind(this.addCard, this);
      this.url = __bind(this.url, this);
      CardCollection.__super__.constructor.apply(this, arguments);
    }

    CardCollection.prototype.model = Cards.Card;

    favorites = false;

    CardCollection.prototype.url = function() {
      var param, parameters, url, _i, _len;
      url = baseUrl + "card/";
      parameters = [];
      if (this.deck) {
        parameters.push({
          key: "deck",
          value: this.deck
        });
      }
      if (!_(parameters).isEmpty()) url += "?";
      for (_i = 0, _len = parameters.length; _i < _len; _i++) {
        param = parameters[_i];
        url += "" + param.key + "=" + param.value + "&";
      }
      return url;
    };

    CardCollection.prototype.comparator = function(model) {
      return model.get("title");
    };

    CardCollection.prototype.addCard = function() {
      return this.create();
    };

    CardCollection.prototype.initialize = function(models, options) {
      if (options && options.deck) this.deck = options.deck;
      return CardCollection.__super__.initialize.call(this, models, options);
    };

    return CardCollection;

  })(Backbone.Collection);

  Cards.Deck = (function(_super) {

    __extends(Deck, _super);

    function Deck() {
      this.initialize = __bind(this.initialize, this);
      Deck.__super__.constructor.apply(this, arguments);
    }

    Deck.prototype.urlRoot = baseUrl + "deck/";

    Deck.prototype.defaults = {
      title: "",
      description: ""
    };

    Deck.prototype.initialize = function() {
      this.cardsInDeck = new Cards.CardInDeckCollection({
        deck: this.id
      });
      return this.cardsInDeck.fetch();
    };

    return Deck;

  })(Backbone.Model);

  Cards.DeckCollection = (function(_super) {

    __extends(DeckCollection, _super);

    function DeckCollection() {
      this.initialize = __bind(this.initialize, this);
      this.url = __bind(this.url, this);
      DeckCollection.__super__.constructor.apply(this, arguments);
    }

    DeckCollection.prototype.url = function() {
      var param, parameters, url, _i, _len;
      url = baseUrl + "deck/";
      parameters = [];
      if (this.user) {
        parameters.push({
          key: "user",
          value: this.user
        });
      }
      if (!_(parameters).isEmpty()) url += "?";
      for (_i = 0, _len = parameters.length; _i < _len; _i++) {
        param = parameters[_i];
        url += "" + param.key + "=" + param.value + "&";
      }
      return url;
    };

    DeckCollection.prototype.initialize = function(models, options) {
      if (options && options.user) this.user = options.user;
      return DeckCollection.__super__.initialize.call(this, models, options);
    };

    return DeckCollection;

  })(Backbone.Collection);

  Cards.CardInDeck = (function(_super) {

    __extends(CardInDeck, _super);

    function CardInDeck() {
      this.getDeck = __bind(this.getDeck, this);
      this.getCard = __bind(this.getCard, this);
      CardInDeck.__super__.constructor.apply(this, arguments);
    }

    CardInDeck.prototype.urlRoot = baseUrl + "cardindeck/";

    CardInDeck.prototype.defaults = {
      deck: 0,
      card: 0,
      order: 0
    };

    CardInDeck.prototype.getCard = function() {
      return App.cards.get(this.get("card"));
    };

    CardInDeck.prototype.getDeck = function() {
      return App.decks.get(this.get("deck"));
    };

    return CardInDeck;

  })(Backbone.Model);

  Cards.CardInDeckCollection = (function(_super) {

    __extends(CardInDeckCollection, _super);

    function CardInDeckCollection() {
      this.initialize = __bind(this.initialize, this);
      this.url = __bind(this.url, this);
      CardInDeckCollection.__super__.constructor.apply(this, arguments);
    }

    CardInDeckCollection.prototype.url = function() {
      var param, parameters, url, _i, _len;
      url = baseUrl + "cardindeck/";
      parameters = [];
      if (this.user) {
        parameters.push({
          key: "deck",
          value: this.deck
        });
      }
      if (!_(parameters).isEmpty()) url += "?";
      for (_i = 0, _len = parameters.length; _i < _len; _i++) {
        param = parameters[_i];
        url += "" + param.key + "=" + param.value + "&";
      }
      return url;
    };

    CardInDeckCollection.prototype.initialize = function(models, options) {
      if (options && options.deck) this.deck = options.deck;
      return CardInDeckCollection.__super__.initialize.call(this, models, options);
    };

    return CardInDeckCollection;

  })(Backbone.Collection);

  Cards.CardView = (function(_super) {

    __extends(CardView, _super);

    function CardView() {
      this.editKeyUp = __bind(this.editKeyUp, this);
      this.commitEdit = __bind(this.commitEdit, this);
      this.showDisplay = __bind(this.showDisplay, this);
      this.showEdit = __bind(this.showEdit, this);
      this.afterAdd = __bind(this.afterAdd, this);
      this["delete"] = __bind(this["delete"], this);
      this.showDeleteModal = __bind(this.showDeleteModal, this);
      this.render = __bind(this.render, this);
      CardView.__super__.constructor.apply(this, arguments);
    }

    CardView.template = Foundation.getTemplate("tmplCardContent");

    CardView.prototype.events = {
      "click .card.display": "showEdit",
      "click .card.edit .cancel": "showDisplay",
      "click .card.edit .save": "commitEdit",
      "click .card.edit .delete": "showDeleteModal",
      "submit .editForm": "commitEdit",
      "keyup .card.edit": "editKeyUp"
    };

    CardView.prototype.autoSave = true;

    CardView.prototype.render = function() {
      CardView.__super__.render.call(this);
      this.form = new Backbone.Form({
        model: this.model,
        el: this.$(".editForm")
      }).render();
      return $(this.el).draggable({
        helper: "clone",
        cursorAt: {
          left: 120,
          top: 170
        }
      });
    };

    CardView.prototype.showDeleteModal = function() {
      this.showDisplay();
      $(".deleteModal .cardTitle").text(this.model.get("title"));
      $(".deleteModal").modal("show");
      return $(".deleteModal .do").data({
        modelId: this.model.get("id")
      });
    };

    CardView.prototype["delete"] = function() {
      return this.model.destroy();
    };

    CardView.prototype.afterAdd = function() {
      return this.showEdit();
    };

    CardView.prototype.showEdit = function() {
      var _this = this;
      this.$(".card.display").addClass("hide").removeClass("show");
      this.$(".card.edit").removeClass("hide").addClass("show");
      setTimeout(function() {
        return _this.$(".card.edit").addClass("scale");
      }, 0);
      return setTimeout(function() {
        return _this.$('.card.edit :input').eq(3).focus().select();
      }, 150);
    };

    CardView.prototype.showDisplay = function() {
      var _this = this;
      this.$(".card.edit").removeClass("scale");
      return setTimeout(function() {
        _this.$(".card.edit").removeClass("show").addClass("hide");
        return _this.$(".card.display").removeClass("hide").addClass("show");
      }, 150);
    };

    CardView.prototype.commitEdit = function(event) {
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

    CardView.prototype.editKeyUp = function(event) {
      if (event.which === 27) return this.showDisplay();
    };

    return CardView;

  })(Foundation.EditableTemplateView);

  Cards.CardListView = (function(_super) {

    __extends(CardListView, _super);

    function CardListView() {
      CardListView.__super__.constructor.apply(this, arguments);
    }

    CardListView.template = Foundation.getTemplate("tmplCardListContent");

    return CardListView;

  })(Foundation.TemplateView);

  Cards.D12Router = (function(_super) {

    __extends(D12Router, _super);

    function D12Router() {
      this.showError = __bind(this.showError, this);
      this.deleteClick = __bind(this.deleteClick, this);
      this.initialize = __bind(this.initialize, this);
      D12Router.__super__.constructor.apply(this, arguments);
    }

    D12Router.prototype.initialize = function() {
      var _this = this;
      this.bind("form:error", this.showError);
      this.cards = new Cards.CardCollection();
      this.cardSheetView = new Foundation.CollectionView({
        prependNew: true,
        el: "#cardSheetView",
        collection: this.cards,
        modelViewClass: Cards.CardView
      });
      this.cards.fetch();
      $("#cards-addCard").click(function() {
        return _this.cards.create();
      });
      $("#cards-refreshCards").click(function() {
        return _this.cards.fetch();
      });
      $(".deleteModal").modal({
        keyboard: true,
        backdrop: true
      });
      $("body").on("click", ".deleteModal .do", this.deleteClick);
      $("body").on("click", ".modal .cancel", function(event) {
        return $(".deleteModal").modal("hide");
      });
      return D12Router.__super__.initialize.call(this);
    };

    D12Router.prototype.deleteClick = function(event) {
      var card, cardId;
      cardId = $(".deleteModal .do").data("modelId");
      card = this.cards.get(cardId);
      if (card) {
        this.cards.remove(card);
        card.destroy();
      }
      return $(".deleteModal").modal("hide");
    };

    D12Router.prototype.showError = function(errorData) {
      return $("<div>" + errorData.error + "<p><button class='btn cancel'>Ok</button></p></div>").modal({
        title: "Validation error"
      });
    };

    return D12Router;

  })(Backbone.Router);

  window.Foundation.inits.push(function() {
    return window.App = new Cards.D12Router();
  });

}).call(this);
