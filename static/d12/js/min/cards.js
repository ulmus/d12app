(function() {
  var baseUrl,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.Cards = {};

  baseUrl = "/api/cards/";

  Cards.CardText = (function(_super) {

    __extends(CardText, _super);

    function CardText() {
      CardText.__super__.constructor.apply(this, arguments);
    }

    CardText.prototype.defaults = {
      label: "Label",
      text: "Text"
    };

    return CardText;

  })(Backbone.Model);

  Cards.CardTextCollection = (function(_super) {

    __extends(CardTextCollection, _super);

    function CardTextCollection() {
      CardTextCollection.__super__.constructor.apply(this, arguments);
    }

    CardTextCollection.prototype.model = Cards.CardText;

    return CardTextCollection;

  })(Backbone.Collection);

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

    return Card;

  })(Backbone.Model);

  Cards.CardCollection = (function(_super) {

    __extends(CardCollection, _super);

    function CardCollection() {
      this.addCard = __bind(this.addCard, this);
      CardCollection.__super__.constructor.apply(this, arguments);
    }

    CardCollection.prototype.model = Cards.Card;

    CardCollection.prototype.url = baseUrl + "card/";

    CardCollection.prototype.comparator = function(model) {
      return model.get("title");
    };

    CardCollection.prototype.addCard = function() {
      return this.create();
    };

    return CardCollection;

  })(Backbone.Collection);

  Cards.CardView = (function(_super) {

    __extends(CardView, _super);

    function CardView() {
      this.afterAdd = __bind(this.afterAdd, this);
      this["delete"] = __bind(this["delete"], this);
      this.showDeleteModal = __bind(this.showDeleteModal, this);
      this.addTextItem = __bind(this.addTextItem, this);
      this.togglePhase3 = __bind(this.togglePhase3, this);
      this.togglePhase2 = __bind(this.togglePhase2, this);
      this.togglePhase1 = __bind(this.togglePhase1, this);
      this.nextActionType = __bind(this.nextActionType, this);
      CardView.__super__.constructor.apply(this, arguments);
    }

    CardView.template = Foundation.getTemplate("tmplCardContent");

    CardView.prototype.autoSave = true;

    CardView.prototype.events = {
      "click .showDelete": "showDeleteModal",
      "click .phase_1": "togglePhase1",
      "click .phase_2": "togglePhase2",
      "click .phase_3": "togglePhase3",
      "click .action-type": "nextActionType",
      "click .delete": "delete"
    };

    CardView.prototype.nextActionType = function() {
      switch (this.model.get("type")) {
        case "ACTN":
          return this.model.save({
            type: "MOVE"
          });
        case "MOVE":
          return this.model.save({
            type: "SPRT"
          });
        case "SPRT":
          return this.model.save({
            type: "REAC"
          });
        case "REAC":
          return this.model.save({
            type: "ACTN"
          });
      }
    };

    CardView.prototype.togglePhase1 = function() {
      return this.model.save({
        phase_1: !this.model.get("phase_1")
      });
    };

    CardView.prototype.togglePhase2 = function() {
      return this.model.save({
        phase_2: !this.model.get("phase_2")
      });
    };

    CardView.prototype.togglePhase3 = function() {
      return this.model.save({
        phase_3: !this.model.get("phase_3")
      });
    };

    CardView.prototype.addTextItem = function() {
      return this.model.get("body").add(new Cards.CardText());
    };

    CardView.prototype.showDeleteModal = function() {
      $(".deleteModal .cardTitle").text(this.model.get("title"));
      $(".deleteModal").modal("show");
      console.log(this.model.get("id"));
      $(".deleteModal .do").data({
        modelId: this.model.get("id")
      });
      return console.log($(".deleteModal .do").data("modelId"));
    };

    CardView.prototype["delete"] = function() {
      return this.model.destroy();
    };

    CardView.prototype.afterAdd = function() {
      return this.attributeEditStart("title");
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
      this.initialize = __bind(this.initialize, this);
      D12Router.__super__.constructor.apply(this, arguments);
    }

    D12Router.prototype.initialize = function() {
      var _this = this;
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
      $("body").on("click", ".deleteModal .do", function(event) {
        var card, cardId;
        cardId = $(".deleteModal .do").data("modelId");
        console.log(cardId);
        card = _this.cards.get(cardId);
        console.log(card);
        console.log(_this.cards.models);
        if (card) card.destroy();
        return $(event.target).parents(".modal").modal("hide");
      });
      $("body").on("click", ".modal .cancel", function(event) {
        return $(".deleteModal").modal("hide");
      });
      return D12Router.__super__.initialize.apply(this, arguments);
    };

    return D12Router;

  })(Backbone.Router);

  window.Foundation.inits.push(function() {
    return window.App = new Cards.D12Router();
  });

}).call(this);
