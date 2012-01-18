(function() {
  var baseUrl,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  window.Cards = {};

  baseUrl = "/api/cards/";

  Cards.Card = (function(_super) {

    __extends(Card, _super);

    function Card() {
      this.toString = __bind(this.toString, this);
      Card.__super__.constructor.apply(this, arguments);
    }

    Card.name = "card";

    Card.prototype.rootUrl = baseUrl + "card/";

    Card.prototype.defaults = {
      category: "BASC",
      title: "",
      type: "ACTN",
      body: "",
      keywords: []
    };

    Card.prototype.schema = {
      title: {
        type: "Text",
        title: "Title"
      },
      category: {
        type: "Select",
        title: "Card Category",
        options: [
          {
            val: "BASC",
            label: "Basic"
          }, {
            val: "ADVN",
            label: "Advanced"
          }
        ]
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
            label: "Main"
          }, {
            val: "MOVE",
            label: "Positioning"
          }, {
            val: "SPRT",
            label: "Support"
          }, {
            val: "REAC",
            label: "Reaction"
          }
        ]
      },
      protected: {
        type: "Checkbox",
        title: "Protected"
      }
    };

    Card.prototype.toString = function() {
      return this.get("title");
    };

    return Card;

  })(Foundation.Model);

  Cards.CardCollection = (function(_super) {

    __extends(CardCollection, _super);

    function CardCollection() {
      CardCollection.__super__.constructor.apply(this, arguments);
    }

    CardCollection.prototype.model = Cards.Card;

    CardCollection.prototype.rootUrl = baseUrl + "card/";

    CardCollection.prototype.comparator = function(model) {
      return model.get("category") + model.get("type") + model.get("title");
    };

    return CardCollection;

  })(Foundation.Collection);

  Cards.Deck = (function(_super) {

    __extends(Deck, _super);

    function Deck() {
      this.toString = __bind(this.toString, this);
      Deck.__super__.constructor.apply(this, arguments);
    }

    Deck.name = "deck";

    Deck.prototype.rootUrl = baseUrl + "deck/";

    Deck.prototype.defaults = {
      title: "New deck",
      description: ""
    };

    Deck.prototype.schema = {
      title: {
        type: "Text",
        title: "Title"
      },
      description: {
        type: "Text",
        title: "Description"
      }
    };

    Deck.prototype.toString = function() {
      return this.get("title");
    };

    return Deck;

  })(Foundation.Model);

  Cards.DeckCollection = (function(_super) {

    __extends(DeckCollection, _super);

    function DeckCollection() {
      DeckCollection.__super__.constructor.apply(this, arguments);
    }

    DeckCollection.prototype.model = Cards.Deck;

    DeckCollection.prototype.rootUrl = baseUrl + "deck/";

    return DeckCollection;

  })(Foundation.Collection);

  Cards.CardInDeck = (function(_super) {

    __extends(CardInDeck, _super);

    function CardInDeck() {
      this.toString = __bind(this.toString, this);
      this.getDeck = __bind(this.getDeck, this);
      this.getCard = __bind(this.getCard, this);
      CardInDeck.__super__.constructor.apply(this, arguments);
    }

    CardInDeck.prototype.rootUrl = baseUrl + "cardindeck/";

    CardInDeck.prototype.defaults = {
      deck: 0,
      card: 0,
      order: 0
    };

    CardInDeck.prototype.getCard = function() {
      return App.allCards.get(this.get("card"));
    };

    CardInDeck.prototype.getDeck = function() {
      return App.decks.get(this.get("deck"));
    };

    CardInDeck.prototype.toString = function() {
      return this.get("title");
    };

    return CardInDeck;

  })(Foundation.Model);

  Cards.CardInDeckCollection = (function(_super) {

    __extends(CardInDeckCollection, _super);

    function CardInDeckCollection() {
      CardInDeckCollection.__super__.constructor.apply(this, arguments);
    }

    CardInDeckCollection.prototype.model = Cards.CardInDeck;

    CardInDeckCollection.prototype.rootUrl = baseUrl + "cardindeck/";

    return CardInDeckCollection;

  })(Foundation.Collection);

  Cards.CardView = (function(_super) {

    __extends(CardView, _super);

    function CardView() {
      this.showEdit = __bind(this.showEdit, this);
      this.render = __bind(this.render, this);
      CardView.__super__.constructor.apply(this, arguments);
    }

    CardView.template = Foundation.getTemplate("tmplCard");

    CardView.modelName = "card";

    CardView.prototype.render = function() {
      CardView.__super__.render.call(this);
      this.$(".card").draggable({
        appendTo: "body",
        helper: "clone",
        delay: 50,
        cursorAt: {
          left: 120,
          top: 170
        }
      });
      return this;
    };

    CardView.prototype.showEdit = function() {
      var _this = this;
      CardView.__super__.showEdit.call(this);
      return this.$(".editForm textarea#body").popover({
        title: function() {
          return "Formatting help";
        },
        content: function() {
          return $("#markdown-help").html();
        },
        html: true,
        trigger: "focus"
      });
    };

    return CardView;

  })(Foundation.EditableTemplateView);

  Cards.CardInDeckView = (function(_super) {

    __extends(CardInDeckView, _super);

    function CardInDeckView() {
      this.render = __bind(this.render, this);
      this.getContext = __bind(this.getContext, this);
      CardInDeckView.__super__.constructor.apply(this, arguments);
    }

    CardInDeckView.template = Foundation.getTemplate("tmplCardInDeck");

    CardInDeckView.prototype.getContext = function() {
      return {
        attr: this.model.toJSON(),
        model: this.model,
        card: App.allCards.get(this.model.get("card")),
        deck: App.decks.get(this.model.get("deck"))
      };
    };

    CardInDeckView.prototype.render = function() {
      CardInDeckView.__super__.render.call(this);
      this.$(".card").draggable({
        appendTo: "body",
        helper: "clone",
        delay: 50,
        cursorAt: {
          left: 120,
          top: 170
        }
      });
      return this;
    };

    return CardInDeckView;

  })(Foundation.TemplateView);

  Cards.DeckView = (function(_super) {

    __extends(DeckView, _super);

    function DeckView() {
      this.remove = __bind(this.remove, this);
      this.showDeck = __bind(this.showDeck, this);
      this.updateNumberOfCards = __bind(this.updateNumberOfCards, this);
      this.dropCard = __bind(this.dropCard, this);
      this.render = __bind(this.render, this);
      this.initialize = __bind(this.initialize, this);
      DeckView.__super__.constructor.apply(this, arguments);
    }

    DeckView.prototype.events = {
      "click": "showDeck"
    };

    DeckView.template = Handlebars.compile('<div class="contents">\
			<div class="number-of-cards"></div>\
			<h2 class="title">\
				{{attr.title}}\
			</h2>\
		</div>');

    DeckView.prototype.className = "deck display clickable visual-drop-target showDeck";

    DeckView.prototype.initialize = function() {
      DeckView.__super__.initialize.call(this);
      App.allCardsInDecks.bind("reset", this.updateNumberOfCards, this);
      App.allCardsInDecks.bind("add", this.updateNumberOfCards, this);
      return App.allCardsInDecks.bind("remove", this.updateNumberOfCards, this);
    };

    DeckView.prototype.render = function() {
      var _this = this;
      DeckView.__super__.render.call(this);
      this.$(".deck").droppable({
        tolerance: "pointer",
        accept: ".card",
        hoverClass: 'drophover',
        drop: function(event, ui) {
          return _this.dropCard(event, ui);
        }
      });
      this.updateNumberOfCards();
      return this;
    };

    DeckView.prototype.dropCard = function(event, ui) {
      return App.allCardsInDecks.create({
        card: ui.draggable.data("cardId"),
        deck: this.model.id
      });
    };

    DeckView.prototype.updateNumberOfCards = function() {
      var count,
        _this = this;
      count = App.allCardsInDecks.filter(function(model) {
        return model.get("deck") === _this.model.id;
      }).length;
      return this.$(".number-of-cards").text(count);
    };

    DeckView.prototype.showDeck = function() {
      return App.navigate("cards/deck/" + this.model.id, true);
    };

    DeckView.prototype.remove = function() {
      App.allCardsInDecks.unbind("reset", this.updateNumberOfCards);
      App.allCardsInDecks.unbind("add", this.updateNumberOfCards);
      return App.allCardsInDecks.unbind("remove", this.updateNumberOfCards);
    };

    return DeckView;

  })(Foundation.TemplateView);

  Cards.TrashView = (function(_super) {

    __extends(TrashView, _super);

    function TrashView() {
      this.showProtectedModal = __bind(this.showProtectedModal, this);
      this.showDeleteModal = __bind(this.showDeleteModal, this);
      this.dropCard = __bind(this.dropCard, this);
      this.render = __bind(this.render, this);
      TrashView.__super__.constructor.apply(this, arguments);
    }

    TrashView.prototype.render = function() {
      var _this = this;
      TrashView.__super__.render.call(this);
      return $(this.el).droppable({
        tolerance: "pointer",
        accept: ".card",
        hoverClass: 'drophover',
        drop: function(event, ui) {
          return _this.dropCard(event, ui);
        }
      });
    };

    TrashView.prototype.dropCard = function(event, ui) {
      var isProtected, modelId, modelType, object;
      modelId = ui.draggable.data("modelId");
      modelType = ui.draggable.data("modelType");
      isProtected = ui.draggable.data("protected");
      switch (modelType) {
        case "card":
          object = App.allCards.get(modelId);
          if (object && !isProtected) this.showDeleteModal(object);
          break;
        case "cardInDeck":
          object = App.allCardsInDecks.get(modelId);
          if (object && !isProtected) object.destroy();
      }
      if (object && isProtected) return this.showProtectedModal(object);
    };

    TrashView.prototype.showDeleteModal = function(model) {
      var deleteModal, modalString,
        _this = this;
      modalString = Foundation.getTemplate("tmplDeleteModal")({
        modelName: model.constructor.name,
        instanceName: model.toString()
      });
      deleteModal = $(modalString).modal({
        keyboard: true,
        backdrop: true
      });
      deleteModal.bind('hidden', function() {
        return deleteModal.remove();
      });
      $(".do", deleteModal).click(function() {
        model.destroy();
        return deleteModal.modal("hide");
      });
      $(".cancel", deleteModal).click(function() {
        return deleteModal.modal("hide");
      });
      deleteModal.focus();
      return deleteModal.modal("show");
    };

    TrashView.prototype.showProtectedModal = function(model) {
      var modalString, protectedModal,
        _this = this;
      modalString = Foundation.getTemplate("tmplProtectedModal")({
        modelName: model.constructor.name,
        instanceName: model.toString()
      });
      protectedModal = $(modalString).modal({
        keyboard: true,
        backdrop: true
      });
      protectedModal.bind('hidden', function() {
        return protectedModal.remove();
      });
      $(".cancel", protectedModal).click(function() {
        return protectedModal.modal("hide");
      });
      protectedModal.focus();
      return protectedModal.modal("show");
    };

    return TrashView;

  })(Backbone.View);

  Cards.ShowCardsMenuView = (function(_super) {

    __extends(ShowCardsMenuView, _super);

    function ShowCardsMenuView() {
      this.remove = __bind(this.remove, this);
      this.render = __bind(this.render, this);
      this.initialize = __bind(this.initialize, this);
      ShowCardsMenuView.__super__.constructor.apply(this, arguments);
    }

    ShowCardsMenuView.itemTemplate = Handlebars.compile("<li><a class='show-menu-item' href='#cards/deck/{{ model.id }}' data-model-id='{{model.id}}'>{{attr.title}}</a></li>");

    ShowCardsMenuView.prototype.shownId = 0;

    ShowCardsMenuView.prototype.initialize = function() {
      ShowCardsMenuView.__super__.initialize.call(this);
      this.collection = this.options.collection;
      this.collection.bind("reset", this.render, this);
      this.collection.bind("add", this.render, this);
      this.collection.bind("remove", this.render, this);
      return this.collection.bind("change", this.render, this);
    };

    ShowCardsMenuView.prototype.render = function() {
      var html, model, _i, _len, _ref;
      html = "<li><a class='show-menu-item' href='#cards/all' data-model-id='-1'>All cards</a></li>";
      _ref = this.collection.models;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        model = _ref[_i];
        html += this.constructor.itemTemplate({
          attr: model.toJSON(),
          model: model
        });
      }
      return $(this.el).html(html);
    };

    ShowCardsMenuView.prototype.remove = function() {
      this.collection.unbind("reset", this.render);
      this.collection.unbind("add", this.render);
      this.collection.unbind("remove", this.render);
      return this.collection.unbind("change", this.render);
    };

    return ShowCardsMenuView;

  })(Backbone.View);

  Cards.SearchBoxView = (function(_super) {

    __extends(SearchBoxView, _super);

    function SearchBoxView() {
      this.doSearch = __bind(this.doSearch, this);
      this.setSearch = __bind(this.setSearch, this);
      this.clear = __bind(this.clear, this);
      SearchBoxView.__super__.constructor.apply(this, arguments);
    }

    SearchBoxView.prototype.events = {
      "keyup input": "doSearch"
    };

    SearchBoxView.prototype.clear = function() {
      return this.setSearch("");
    };

    SearchBoxView.prototype.setSearch = function(term) {
      this.$("input").val(term);
      return this.doSearch();
    };

    SearchBoxView.prototype.doSearch = function(event) {
      var term;
      term = this.$("input").val();
      if (term === "") {
        return App.shownView.showAll();
      } else {
        term = term.toUpperCase();
        if (App.shownView === App.allCardsView) {
          App.shownView.hideSome(function(model) {
            var title;
            title = model.get("title");
            title = title.toUpperCase();
            return title.indexOf(term);
          });
        }
        if (App.shownView === App.cardSheetView) {
          return App.shownView.hideSome(function(model) {
            var title;
            title = model.getCard().get("title");
            title = title.toUpperCase();
            return title.indexOf(term);
          });
        }
      }
    };

    return SearchBoxView;

  })(Backbone.View);

  Cards.CardSheetView = (function(_super) {

    __extends(CardSheetView, _super);

    function CardSheetView() {
      this.setDeck = __bind(this.setDeck, this);
      this.initialize = __bind(this.initialize, this);
      CardSheetView.__super__.constructor.apply(this, arguments);
    }

    CardSheetView.cardDisplayTemplate = Handlebars.compile("{{attr.title}}");

    CardSheetView.prototype.initialize = function() {
      this.headerView = new Foundation.TemplateView({
        tagName: "h2",
        template: this.constructor.cardDisplayTemplate
      });
      return CardSheetView.__super__.initialize.call(this);
    };

    CardSheetView.prototype.setDeck = function(deck) {
      this.setFilter(function(model) {
        return model.get("deck") === deck.get("id");
      });
      return this.headerView.setModel(deck);
    };

    return CardSheetView;

  })(Foundation.FilteredCollectionView);

  Cards.DeckCollectionView = (function(_super) {

    __extends(DeckCollectionView, _super);

    function DeckCollectionView() {
      this.remove = __bind(this.remove, this);
      this.updateNumberOfCards = __bind(this.updateNumberOfCards, this);
      this.addNewDeck = __bind(this.addNewDeck, this);
      this.showAllCards = __bind(this.showAllCards, this);
      this.initialize = __bind(this.initialize, this);
      DeckCollectionView.__super__.constructor.apply(this, arguments);
    }

    DeckCollectionView.prototype.events = {
      "click .showAllCards": "showAllCards",
      "click .addNewDeck": "addNewDeck"
    };

    DeckCollectionView.prototype.initialize = function() {
      this.modelViewClass = Cards.DeckView;
      this.headerView = new Foundation.StaticView({
        className: "deck display clickable showAllCards noprint",
        content: '<div class="contents">\
					<div class="number-of-cards"></div>\
					<h2 class="title">\
						All Cards\
					</h2>\
				</div>'
      });
      this.footerView = new Foundation.StaticView({
        className: "deck display clickable addNewDeck",
        content: '<div class="contents">\
						<div class="number-of-cards"></div>\
						<h2 class="title">\
							Add new deck\
						</h2>\
					</div>'
      });
      DeckCollectionView.__super__.initialize.call(this);
      App.allCards.bind("reset", this.updateNumberOfCards, this);
      App.allCards.bind("add", this.updateNumberOfCards, this);
      return App.allCards.bind("remove", this.updateNumberOfCards, this);
    };

    DeckCollectionView.prototype.showAllCards = function() {
      return App.navigate("cards/all", true);
    };

    DeckCollectionView.prototype.addNewDeck = function() {
      return App.decks.create({
        user: currentUserId
      });
    };

    DeckCollectionView.prototype.updateNumberOfCards = function() {
      var count;
      count = App.allCards.length;
      return this.$(".showAllCards .number-of-cards").text(count);
    };

    DeckCollectionView.prototype.remove = function() {
      App.allCards.unbind("reset", this.updateNumberOfCards);
      App.allCards.unbind("add", this.updateNumberOfCards);
      return App.allCards.unbind("remove", this.updateNumberOfCards);
    };

    return DeckCollectionView;

  })(Foundation.CollectionView);

  Cards.D12Router = (function(_super) {
    var shownView;

    __extends(D12Router, _super);

    function D12Router() {
      this.showError = __bind(this.showError, this);
      this.showCardSheet = __bind(this.showCardSheet, this);
      this.showAllCards = __bind(this.showAllCards, this);
      this.printOut = __bind(this.printOut, this);
      this.setup = __bind(this.setup, this);
      D12Router.__super__.constructor.apply(this, arguments);
    }

    D12Router.prototype.routes = {
      "cards/all": "showAllCards",
      "cards/deck/:deck_id": "showCardSheet"
    };

    shownView = null;

    D12Router.prototype.setup = function() {
      var _this = this;
      this.bind("form:error", this.showError);
      this.allCards = new Cards.CardCollection();
      this.allCards.fetch();
      this.allCardsView = new Foundation.CollectionView({
        headerView: new Foundation.StaticView({
          tagName: "h2",
          className: "noprint",
          content: "All Cards"
        }),
        prependNew: true,
        el: "#allCardsView",
        collection: this.allCards,
        modelViewClass: Cards.CardView
      });
      this.allCardsInDecks = new Cards.CardInDeckCollection();
      this.allCardsInDecks.fetch();
      this.cardsInDeck = new Cards.CardInDeckCollection();
      this.cardSheetView = new Cards.CardSheetView({
        el: "#cardSheetView",
        collection: this.allCardsInDecks,
        modelViewClass: Cards.CardInDeckView,
        filter: function(model) {
          return false;
        }
      });
      this.decks = new Cards.DeckCollection();
      this.deckListView = new Cards.DeckCollectionView({
        el: "#decksView",
        collection: this.decks
      });
      this.showMenu = new Cards.ShowCardsMenuView({
        el: $("#cards-showMenu"),
        collection: this.decks
      });
      this.decks.fetch();
      this.trashView = new Cards.TrashView({
        el: "#trashView"
      });
      this.trashView.render();
      $("#cards-addCard").click(function() {
        _this.showAllCards();
        return _this.allCards.create();
      });
      $("#cards-refreshCards").click(function() {
        _this.allCards.fetch();
        _this.decks.fetch();
        return _this.cardsInDeck.fetch();
      });
      $("#cards-printout").click(function() {
        return _this.printOut();
      });
      this.searchView = new Cards.SearchBoxView({
        el: $("#cards-searchBox")
      });
      return this.shownView = this.allCardsView;
    };

    D12Router.prototype.printOut = function() {
      var printout,
        _this = this;
      printout = new Printouts.Printout({
        body: $(this.shownView.el).html(),
        title: "Cards",
        filename: "cards.pdf"
      });
      return printout.save().then(function() {
        return window.open("/api/export/pdf/" + (printout.get("uuid")) + "/", "_new");
      });
    };

    D12Router.prototype.showAllCards = function() {
      $(this.cardSheetView.el).hide();
      $(this.allCardsView.el).show();
      this.shownView = this.allCardsView;
      return this.searchView.clear();
    };

    D12Router.prototype.showCardSheet = function(deck_id) {
      var deck, intId;
      intId = parseInt(deck_id);
      deck = this.decks.get(deck_id);
      $(this.allCardsView.el).hide();
      this.cardSheetView.setDeck(deck);
      $(this.cardSheetView.el).show();
      this.shownView = this.cardSheetView;
      return this.searchView.clear();
    };

    D12Router.prototype.showError = function(errorData) {
      return $("<div>" + errorData.error + "<p><button class='btn cancel'>Ok</button></p></div>").modal({
        title: "Validation error"
      });
    };

    return D12Router;

  })(Backbone.Router);

  window.Foundation.inits.push(function() {
    window.App = new Cards.D12Router();
    App.setup();
    return window.location.hash = "";
  });

}).call(this);
