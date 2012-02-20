(function() {
  var AllCardsView, Card, CardCollection, CardController, CardInDeck, CardInDeckCollection, CardInDeckView, CardModuleMainView, CardRouter, CardSheetView, CardView, Deck, DeckCollection, Foundation, NavView, Printouts, SearchBoxView, UI, baseUrl, module,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  baseUrl = "/api/cards/";

  module = null;

  Foundation = window.Foundation;

  UI = Foundation.UI;

  Printouts = window.Printouts;

  Handlebars.registerHelper("cardActionDisplay", function(abbr) {
    switch (abbr) {
      case "ACTN":
        return "Primary";
      case "MOVE":
        return "Movement";
      case "SPRT":
        return "Support";
      case "REAC":
        return "Reaction";
    }
  });

  Handlebars.registerHelper("cardActionClassName", function(abbr) {
    switch (abbr) {
      case "ACTN":
        return "primary";
      case "MOVE":
        return "movement";
      case "SPRT":
        return "support";
      case "REAC":
        return "reaction";
    }
  });

  Handlebars.registerHelper("cardCategoryDisplay", function(abbr) {
    switch (abbr) {
      case "BASC":
        return "Basic";
      case "ADVN":
        return "Advanced";
    }
  });

  Handlebars.registerHelper("cardCategoryDisplaySymbol", function(abbr) {
    switch (abbr) {
      case "BASC":
        return "N";
      case "ADVN":
        return "O";
    }
  });

  Card = (function(_super) {

    __extends(Card, _super);

    function Card() {
      Card.__super__.constructor.apply(this, arguments);
    }

    Card.name = "card";

    Card.prototype.rootUrl = baseUrl + "card/";

    Card.prototype.defaults = function() {
      var defaults;
      defaults = {
        category: "BASC",
        title: "",
        type: "ACTN",
        body: "",
        disrupts: false,
        refresh: 0,
        keywords: [],
        published_status: "SGST"
      };
      if (currentUserIsAdmin) defaults["published_status"] = "DRFT";
      return defaults;
    };

    Card.prototype.schema = function() {
      var schema;
      schema = {
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
        disrupts: {
          type: "Checkbox",
          title: "Disrupts"
        },
        refresh: {
          type: "Number",
          title: "Refresh"
        }
      };
      if (currentUserIsAdmin) {
        schema["protected"] = {
          type: "Checkbox",
          title: "Protected"
        };
        schema["published_status"] = {
          type: "Select",
          title: "Publish Status",
          options: [
            {
              val: "SGST",
              label: "Suggestion"
            }, {
              val: "DRFT",
              label: "Draft"
            }, {
              val: "PUBL",
              label: "Published"
            }
          ]
        };
      }
      return schema;
    };

    Card.prototype.canUpdate = function() {
      return currentUserIsAdmin || !this.get("protected");
    };

    Card.prototype.canDelete = function() {
      return currentUserIsAdmin || !this.get("protected");
    };

    Card.prototype.toString = function() {
      return this.get("title");
    };

    return Card;

  })(Foundation.Model);

  CardCollection = (function(_super) {

    __extends(CardCollection, _super);

    function CardCollection() {
      CardCollection.__super__.constructor.apply(this, arguments);
    }

    CardCollection.prototype.model = Card;

    CardCollection.prototype.rootUrl = baseUrl + "card/";

    CardCollection.prototype.comparator = function(model) {
      return model.get("category") + model.get("type") + model.get("title");
    };

    return CardCollection;

  })(Foundation.Collection);

  Deck = (function(_super) {

    __extends(Deck, _super);

    function Deck() {
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

    Deck.prototype.mine = function() {
      return this.get("user") === currentUserId;
    };

    Deck.prototype.canDelete = function() {
      return this.mine() || currentUserIsAdmin;
    };

    Deck.prototype.canUpdate = function() {
      return this.mine() || currentUserIsAdmin;
    };

    return Deck;

  })(Foundation.Model);

  DeckCollection = (function(_super) {

    __extends(DeckCollection, _super);

    function DeckCollection() {
      DeckCollection.__super__.constructor.apply(this, arguments);
    }

    DeckCollection.prototype.model = Deck;

    DeckCollection.prototype.rootUrl = baseUrl + "deck/";

    return DeckCollection;

  })(Foundation.Collection);

  CardInDeck = (function(_super) {

    __extends(CardInDeck, _super);

    function CardInDeck() {
      CardInDeck.__super__.constructor.apply(this, arguments);
    }

    CardInDeck.prototype.rootUrl = baseUrl + "cardindeck/";

    CardInDeck.prototype.defaults = {
      deck: 0,
      card: 0,
      order: 0
    };

    CardInDeck.prototype.getCard = function() {
      return module.getCard(this.get("card"));
    };

    CardInDeck.prototype.getDeck = function() {
      return module.getDeck(this.get("deck"));
    };

    CardInDeck.prototype.toString = function() {
      return this.get("title");
    };

    return CardInDeck;

  })(Foundation.Model);

  CardInDeckCollection = (function(_super) {

    __extends(CardInDeckCollection, _super);

    function CardInDeckCollection() {
      CardInDeckCollection.__super__.constructor.apply(this, arguments);
    }

    CardInDeckCollection.prototype.model = CardInDeck;

    CardInDeckCollection.prototype.rootUrl = baseUrl + "cardindeck/";

    return CardInDeckCollection;

  })(Foundation.Collection);

  CardView = (function(_super) {

    __extends(CardView, _super);

    function CardView() {
      CardView.__super__.constructor.apply(this, arguments);
    }

    CardView.prototype.className = function() {
      return CardView.__super__.className.call(this) + " card clickable";
    };

    CardView.template = Handlebars.compile('\
		<div class="contents {{cardActionClassName attr.type}}">\
			<h2 class="title">\
				{{attr.title}}\
			</h2>\
			{{#if attr.protected }}<div class="noprint lock"><i class="icon-lock"></i></div>{{/if }}\
			<div class="cardtext">\
				<div class="body">\
					{{{markdown attr.body}}}\
				</div>\
			</div>\
			<ul class="icons left">\
				<li class="action-type">{{cardActionDisplay attr.type}}</li>\
			</ul>\
			<ul class="icons right">\
				<li><span class="websymbol">{{cardCategoryDisplaySymbol attr.category}}</span></li>\
				{{#if attr.refresh }}<li>{{attr.refresh}}</li>{{/if}}\
				{{#if attr.disrupts }}<li>D</li>{{/if}}\
			</ul>\
		</div>\
	');

    CardView.modelName = "card";

    CardView.prototype.events = function() {
      var events;
      events = CardView.__super__.events.call(this);
      _.extend(events, {
        "click": "editCard"
      });
      return events;
    };

    CardView.prototype.editCard = function() {
      return UI.editModel(this.model);
    };

    return CardView;

  })(Foundation.ModelView);

  CardInDeckView = (function(_super) {

    __extends(CardInDeckView, _super);

    function CardInDeckView() {
      CardInDeckView.__super__.constructor.apply(this, arguments);
    }

    CardInDeckView.prototype.className = function() {
      return CardInDeckView.__super__.className.call(this) + "card clickable";
    };

    CardInDeckView.template = Handlebars.compile('\
			<div class="contents {{cardActionClassName card.attributes.type}}">\
				<h2 class="title">\
					{{card.attributes.title}}\
				</h2>\
				<div class="cardtext">\
					<div class="body">\
						{{{markdown card.attributes.body}}}\
					</div>\
				</div>\
				<ul class="icons left">\
					<li class="action-type">{{cardActionDisplay card.attributes.type}}</li>\
				</ul>\
				<ul class="icons right">\
					<li><span class="websymbol">{{cardCategoryDisplaySymbol card.attributes.category}}</span></li>\
				</ul>\
			</div>\
	');

    CardInDeckView.prototype.events = function() {
      var events;
      events = CardInDeckView.__super__.events.call(this);
      _.extend(events, {
        "click": "removeFromDeck"
      });
      return events;
    };

    CardInDeckView.prototype.getContext = function() {
      return {
        attr: this.model.toJSON(),
        model: this.model,
        card: this.model.getCard(),
        deck: this.model.getDeck()
      };
    };

    CardInDeckView.prototype.render = function() {
      CardInDeckView.__super__.render.call(this);
      /*
      		$(@el).draggable(
      			appendTo: "body"
      			helper: "clone"
      			delay: 50
      			cursorAt:
      				left: 120
      				top: 170
      		)
      */
      return this;
    };

    CardInDeckView.prototype.removeFromDeck = function() {
      if (confirm("Remove card from deck?")) return this.model.destroy();
    };

    return CardInDeckView;

  })(Foundation.ModelView);

  AllCardsView = (function(_super) {

    __extends(AllCardsView, _super);

    function AllCardsView() {
      AllCardsView.__super__.constructor.apply(this, arguments);
    }

    return AllCardsView;

  })(Foundation.CollectionView);

  SearchBoxView = (function(_super) {

    __extends(SearchBoxView, _super);

    function SearchBoxView() {
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
        return app.cards.shownView.showAll();
      } else {
        term = term.toUpperCase();
        if (app.cards.shownView === app.cards.allCardsView) {
          app.cards.shownView.hideSome(function(model) {
            var title;
            title = model.get("title");
            title = title.toUpperCase();
            return title.indexOf(term);
          });
        }
        if (app.cards.shownView === app.cards.cardSheetView) {
          return app.cards.shownView.hideSome(function(model) {
            var title;
            title = model.getCard().get("title");
            title = title.toUpperCase();
            return title.indexOf(term);
          });
        }
      }
    };

    return SearchBoxView;

  })(Foundation.View);

  CardSheetView = (function(_super) {

    __extends(CardSheetView, _super);

    function CardSheetView() {
      CardSheetView.__super__.constructor.apply(this, arguments);
    }

    CardSheetView.cardDisplayTemplate = Handlebars.compile("{{attr.title}} <small>{{#if attr.description}}{{attr.description}}{{else}}&nbsp;{{/if}}</small>");

    CardSheetView.prototype.initialize = function() {
      this.options.headerView = new Foundation.ModelView({
        tagName: "h2",
        className: "noprint",
        template: this.constructor.cardDisplayTemplate,
        model: new Deck()
      });
      return CardSheetView.__super__.initialize.call(this);
    };

    CardSheetView.prototype.setDeck = function(deck) {
      var _this = this;
      this.deck = deck;
      this.setFilter(function(model) {
        return model.get("deck") === deck.get("id");
      });
      return this.headerView.setModel(deck);
    };

    return CardSheetView;

  })(Foundation.FilteredCollectionView);

  CardRouter = (function(_super) {

    __extends(CardRouter, _super);

    function CardRouter() {
      CardRouter.__super__.constructor.apply(this, arguments);
    }

    CardRouter.prototype.routes = {
      "/cards": "showAllCards",
      "/cards/deck/:deck_id": "showCardSheet"
    };

    CardRouter.prototype.printOut = function() {
      var printout;
      printout = new Foundation.Modules.Printouts.Printout({
        body: $(this.shownView.el).html(),
        title: "Cards",
        filename: "cards.pdf"
      });
      return printout.save().then(function() {
        return window.open("/api/export/pdf/" + (printout.get("uuid")) + "/", "_new");
      });
    };

    CardRouter.prototype.showAllCards = function() {
      app.showModule("Cards");
      return module.mainView.showAllCards();
    };

    CardRouter.prototype.showCardSheet = function(deck_id) {
      var intId;
      app.showModule("Cards");
      intId = parseInt(deck_id);
      return module.mainView.showDeck(intId);
    };

    CardRouter.prototype.showError = function(errorData) {
      return $("<div>" + errorData.error + "<p><button class='btn cancel'>Ok</button></p></div>").modal({
        title: "Validation error"
      });
    };

    return CardRouter;

  })(Foundation.Router);

  NavView = (function(_super) {

    __extends(NavView, _super);

    function NavView() {
      NavView.__super__.constructor.apply(this, arguments);
    }

    NavView.prototype.className = function() {
      return "nav nav-list";
    };

    NavView.template = Handlebars.compile('\
		<li><a href="#/cards"><i class="icon-book"></i> All Cards</a></li>\
		<li class="nav-header">Decks</li>\
		{{#each models}}\
		<li><a href="#/cards/deck/{{#if this.id}}{{this.id}}{{/if}}"><i class="icon-file"></i>{{this.attributes.title}}{{#if this.mine}} <em>[Your Deck]</em>{{/if}}</a></li>\
		{{/each}}\
	');

    NavView.prototype.activeRow = 0;

    NavView.prototype.initialize = function() {
      NavView.__super__.initialize.call(this);
      return this.model.bind("remove", this.gotoAllCards, this);
    };

    NavView.prototype.render = function() {
      NavView.__super__.render.call(this);
      return this.showActiveRow();
    };

    NavView.prototype.setActiveRow = function(newRow) {
      this.activeRow = newRow;
      return this.showActiveRow();
    };

    NavView.prototype.showActiveRow = function() {
      var $row, i, row, rows, _len, _results;
      rows = this.$("li");
      _results = [];
      for (i = 0, _len = rows.length; i < _len; i++) {
        row = rows[i];
        $row = $(row);
        if (i === this.activeRow) {
          _results.push($row.addClass("active"));
        } else {
          _results.push($row.removeClass("active"));
        }
      }
      return _results;
    };

    NavView.prototype.gotoAllCards = function() {
      return module.router.navigate("/cards", {
        trigger: true
      });
    };

    return NavView;

  })(Foundation.ModelView);

  CardModuleMainView = (function(_super) {

    __extends(CardModuleMainView, _super);

    function CardModuleMainView() {
      CardModuleMainView.__super__.constructor.apply(this, arguments);
    }

    CardModuleMainView.prototype.className = function() {
      return CardModuleMainView.__super__.className.call(this) + " row-fluid";
    };

    CardModuleMainView.prototype.content = '<div class="span2 module-sidebar">\
			<h3>Cards and decks</h3>\
			<ul class="nav nav-list side-nav-list">\
			</ul>\
			<div class="btn-toolbar side-toolbar well">\
			</div>\
\
		</div>\
		<div class="span10 module-content">\
			<div class="allCardsView"></div>\
			<div class="cardSheetView" style="display:none;"></div>\
		</div>';

    CardModuleMainView.prototype.render = function() {
      CardModuleMainView.__super__.render.call(this);
      if (!this.allCardsView) {
        this.allCardsView = new Foundation.CollectionView({
          headerView: new Foundation.StaticView({
            tagName: "h2",
            className: "noprint",
            content: "All Cards <small>All the cards in the database</small>"
          }),
          prependNew: true,
          el: this.$(".allCardsView"),
          collection: module.cards,
          modelViewClass: CardView
        });
      }
      if (!this.cardSheetView) {
        this.cardSheetView = new CardSheetView({
          el: this.$(".cardSheetView"),
          collection: module.cardsInDecks,
          modelViewClass: CardInDeckView,
          filter: function(model) {
            return false;
          }
        });
      }
      if (!this.navView) {
        this.navView = new NavView({
          el: this.$(".side-nav-list"),
          model: module.decks
        });
      }
      if (!this.toolbarView) {
        this.toolbarView = new UI.ToolbarView({
          el: this.$(".side-toolbar"),
          modelViewClass: UI.ButtonView,
          collection: module.tools
        });
      }
      this.allCardsView.render();
      this.cardSheetView.render();
      this.navView.render();
      this.toolbarView.render();
      this.shownView = this.allCardsView;
      this.addToDeckButtons = new UI.ButtonCollection();
      this.resetAddToDeckButtons();
      return module.cards.on("add remove change reset", this.resetAddToDeckButtons, this);
    };

    CardModuleMainView.prototype.resetAddToDeckButtons = function() {
      var buttons,
        _this = this;
      buttons = module.cards.map(function(card) {
        return new UI.Button({
          label: card.get("title"),
          onClick: function() {
            return module.addCardInDeck(card, _this.cardSheetView.deck);
          }
        });
      });
      return this.addToDeckButtons.reset(buttons);
    };

    CardModuleMainView.prototype.showAllCards = function() {
      var _this = this;
      $(this.cardSheetView.el).hide();
      $(this.allCardsView.el).show();
      this.navView.setActiveRow(0);
      return module.tools.reset([
        {
          icon: "plus",
          label: "Add Card",
          onClick: function() {
            return module.addCard();
          }
        }, {
          icon: "plus",
          label: "Add Deck",
          onClick: function() {
            return module.addDeck();
          }
        }, {
          icon: "print",
          label: "Print Cards",
          onClick: function() {
            return _this.printAllCards();
          }
        }
      ]);
    };

    CardModuleMainView.prototype.showDeck = function(deckId) {
      var deck,
        _this = this;
      deck = module.getDeck(deckId);
      if (deck) {
        this.cardSheetView.setDeck(deck);
        this.navView.setActiveRow(module.decks.indexOf(deck) + 2);
        this.cardSheetView.$el.show();
        this.allCardsView.$el.hide();
        return module.tools.reset([
          {
            icon: "plus",
            label: "Add to Deck",
            type: "dropdown",
            menu: this.addToDeckButtons
          }, {
            icon: "pencil",
            label: "Edit Deck",
            onClick: function() {
              return UI.editModel(deck);
            }
          }, {
            icon: "print",
            label: "Print Cards",
            onClick: function() {
              return _this.printDeck();
            }
          }
        ]);
      } else {
        return module.router.navigate("/cards", {
          trigger: true
        });
      }
    };

    CardModuleMainView.prototype.printDeck = function() {
      return Printouts.printouts.createAndShow({
        body: this.cardSheetView.$el.html()
      });
    };

    CardModuleMainView.prototype.printAllCards = function() {
      return Printouts.printouts.createAndShow({
        body: this.allCardsView.$el.html()
      });
    };

    CardModuleMainView.prototype.remove = function() {
      this.allCardsView.remove();
      this.cardSheetView.remove();
      this.navView.remove();
      return this.toolbarView.remove();
    };

    return CardModuleMainView;

  })(Foundation.ModuleMainView);

  CardController = (function(_super) {

    __extends(CardController, _super);

    function CardController() {
      CardController.__super__.constructor.apply(this, arguments);
    }

    CardController.prototype.path = "/cards";

    CardController.prototype.label = "Cards";

    CardController.prototype.start = true;

    CardController.prototype.initialize = function() {
      module = this;
      this.cards = new CardCollection();
      this.cardsInDecks = new CardInDeckCollection();
      this.decks = new DeckCollection();
      this.tools = new UI.ButtonCollection();
      return CardController.__super__.initialize.call(this);
    };

    CardController.prototype.setup = function() {
      this.mainView = new CardModuleMainView();
      this.mainView.render();
      this.cards.fetch();
      this.cardsInDecks.fetch();
      this.decks.fetch();
      return this.router = new CardRouter();
    };

    CardController.prototype.addCard = function() {
      var card;
      card = new Card();
      UI.editModel(card);
      return this.cards.add(card);
    };

    CardController.prototype.addDeck = function() {
      var deck;
      deck = new Deck({
        user: currentUserId
      });
      UI.editModel(deck);
      return this.decks.add(deck, {
        silent: true
      });
    };

    CardController.prototype.addCardInDeck = function(card, deck) {
      return this.cardsInDecks.create({
        card: card.id,
        deck: deck.id
      });
    };

    CardController.prototype.getCard = function(cardId) {
      return this.cards.get(cardId);
    };

    CardController.prototype.getDeck = function(deckId) {
      return this.decks.get(deckId);
    };

    CardController.prototype.getCardInDeck = function(cardInDeckId) {
      return this.cardsInDecks.get(cardInDeckId);
    };

    return CardController;

  })(Foundation.ModuleController);

  Foundation.Modules.Cards = {
    ModuleController: CardController
  };

}).call(this);
