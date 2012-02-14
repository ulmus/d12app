# Module Globals

baseUrl = "/api/cards/"
module = null

# Imports

Foundation = window.Foundation
UI = Foundation.UI

# Template Helpers

Handlebars.registerHelper("cardActionDisplay", (abbr) ->
	switch abbr
		when "ACTN" then "Primary"
		when "MOVE" then "Movement"
		when "SPRT" then "Support"
		when "REAC" then "Reaction"
)

Handlebars.registerHelper("cardActionClassName", (abbr) ->
	switch abbr
		when "ACTN" then "primary"
		when "MOVE" then "movement"
		when "SPRT" then "support"
		when "REAC" then "reaction"
)

Handlebars.registerHelper("cardCategoryDisplay", (abbr) ->
	switch abbr
		when "BASC" then "Basic"
		when "ADVN" then "Advanced"
)

Handlebars.registerHelper("cardCategoryDisplaySymbol", (abbr) ->
	switch abbr
		when "BASC" then "N"
		when "ADVN" then "O"
)

# The Card Models and Collections

class Card extends Foundation.Model

	@name: "card"

	rootUrl: baseUrl + "card/"
	
	defaults:
		category		: "BASC"
		title			: ""
		type			: "ACTN"
		body			: ""
		disrupts		: false
		refresh			: 0
		keywords		: []
		
	schema: ->
		schema =
			title:
				type: "Text"
				title: "Title"
			category:
				type: "Select"
				title: "Card Category"
				options: [
					{val: "BASC", label: "Basic"},
					{val: "ADVN", label: "Advanced"},
				]
			body:
				type: "TextArea"
				title: "Card Text"
			type:
				type: "Select"
				title: "Card Type"
				options: [
					{val: "ACTN", label: "Main"},
					{val: "MOVE", label: "Positioning"},
					{val: "SPRT", label: "Support"},
					{val: "REAC", label: "Reaction"},
				]
			disrupts:
				type: "Checkbox"
				title: "Disrupts"
			refresh:
				type: "Number"
				title: "Refresh"

		if currentUserIsAdmin
			schema["protected"] =
				type: "Checkbox"
				title: "Protected"
		schema

	canUpdate: ->
		currentUserIsAdmin or not @get("protected")

	canDelete: ->
		currentUserIsAdmin or not @get("protected")

	toString: ->
		@get("title")

class CardCollection extends Foundation.Collection

	model: Card
	rootUrl: baseUrl + "card/"

	comparator: (model) ->
		return model.get("category") + model.get("type") + model.get("title")


class Deck extends Foundation.Model
	@name: "deck"

	rootUrl: baseUrl + "deck/"
	
	defaults:
		title:			"New deck"
		description:	""

	schema:
		title:
			type: "Text"
			title: "Title"
		description:
			type: "Text"
			title: "Description"

	toString: ->
		@get("title")

	mine: ->
		@get("user") == currentUserId

	canDelete: ->
		@mine() or currentUserIsAdmin

	canUpdate: ->
		@mine() or currentUserIsAdmin


class DeckCollection extends Foundation.Collection

	model: Deck
	rootUrl: baseUrl + "deck/"


class CardInDeck extends Foundation.Model
	
	rootUrl: baseUrl + "cardindeck/"
	
	defaults:
		deck:		0
		card:		0
		order:		0
		

	getCard: ->
		return module.getCard(@.get("card"))
	
	getDeck: ->
		return module.getDeck(@.get("deck"))
	
	toString: ->
		@get("title")

class CardInDeckCollection extends Foundation.Collection

	model: CardInDeck
	rootUrl: baseUrl + "cardindeck/"

########################
# VIEWS                #
########################

class CardView extends Foundation.ModelView

	className: -> super() + " card clickable"

	@template: Handlebars.compile('
		<div class="contents {{cardActionClassName attr.type}}">
			<h2 class="title">
				{{attr.title}}
			</h2>
			{{#if attr.protected }}<div class="noprint lock websymbol">x</div>{{/if }}
			<div class="cardtext">
				<div class="body">
					{{{markdown attr.body}}}
				</div>
			</div>
			<ul class="icons left">
				<li class="action-type">{{cardActionDisplay attr.type}}</li>
			</ul>
			<ul class="icons right">
				<li><span class="websymbol">{{cardCategoryDisplaySymbol attr.category}}</span></li>
				{{#if attr.refresh }}<li>{{attr.refresh}}</li>{{/if}}
				{{#if attr.disrupts }}<li>D</li>{{/if}}
			</ul>
		</div>
	')

	@modelName = "card"

	events: ->
		events = super()
		_.extend(events, "click" : "editCard")
		events

	editCard: ->
		UI.editModel(this.model)



class CardInDeckView extends Foundation.ModelView

	className: -> super() + "card clickable"

	@template: Handlebars.compile('
			<div class="contents {{cardActionClassName card.attributes.type}}">
				<h2 class="title">
					{{card.attributes.title}}
				</h2>
				<div class="cardtext">
					<div class="category">
							{{cardCategoryDisplay attr.category}}
					</div>
					<div class="body">
						{{{markdown card.attributes.body}}}
					</div>
				</div>
				<ul class="icons left">
					<li class="action-type">{{cardActionDisplay card.attributes.type}}</li>
				</ul>
				<ul class="icons right">
					<li><span class="websymbol">{{cardCategoryDisplaySymbol card.attributes.category}}</span></li>
				</ul>
			</div>
	')

	events: ->
		events = super()
		_.extend(events, "click" : "removeFromDeck")
		events

	getContext: ->
		return {
			attr: @model.toJSON()
			model: @model
			card: @model.getCard()
			deck: @model.getDeck()
		}

	render: ->
		super()
		$(@el).draggable(
			appendTo: "body"
			helper: "clone"
			delay: 50
			cursorAt:
				left: 120
				top: 170
		)
		@

	removeFromDeck: ->
		if confirm("Remove card from deck?")
			@model.destroy()

class AllCardsView extends Foundation.CollectionView



class SearchBoxView extends Foundation.View

	events:
		"keyup input":		"doSearch"

	clear: ->
		@setSearch("")

	setSearch: (term) ->
		@$("input").val(term)
		@doSearch()

	doSearch: (event) ->
		term = @$("input").val()
		if term == ""
			app.cards.shownView.showAll()
		else
			term = term.toUpperCase()
			if app.cards.shownView == app.cards.allCardsView
				app.cards.shownView.hideSome((model)->
					title = model.get("title")
					title = title.toUpperCase()
					title.indexOf(term)
				)
			if app.cards.shownView == app.cards.cardSheetView
				app.cards.shownView.hideSome((model)->
					title = model.getCard().get("title")
					title = title.toUpperCase()
					title.indexOf(term)
				)

class CardSheetView extends Foundation.FilteredCollectionView

	@cardDisplayTemplate = Handlebars.compile("{{attr.title}} <small>{{#if attr.description}}{{attr.description}}{{else}}&nbsp;{{/if}}</small>")

	initialize: ->
		@options.headerView = new Foundation.ModelView(
			tagName: "h2"
			className: "noprint"
			template: @constructor.cardDisplayTemplate
			model: new Deck()
		)
		super()

	setDeck:(deck) ->
		@deck = deck
		@setFilter((model) => return model.get("deck") == deck.get("id"))
		@headerView.setModel(deck)


# Router

class CardRouter extends Foundation.Router

	routes:
		"/cards" :					"showAllCards"
		"/cards/deck/:deck_id" :	"showCardSheet"

	printOut: ->
		printout = new Foundation.Modules.Printouts.Printout(
			body: $(@shownView.el).html()
			title: "Cards",
			filename: "cards.pdf",
		)
		printout.save().then(->
			window.open("/api/export/pdf/#{printout.get("uuid")}/", "_new")
		)

	showAllCards: ->
		app.showModule("Cards")
		module.mainView.showAllCards()

	showCardSheet: (deck_id) ->
		app.showModule("Cards")
		intId = parseInt(deck_id)
		module.mainView.showDeck(intId)

	showError: (errorData) ->
		$("<div>#{errorData.error}<p><button class='btn cancel'>Ok</button></p></div>").modal(
			title: "Validation error"
		)


class NavView extends Foundation.ModelView

	className: ->
		"nav nav-list"

	@template: Handlebars.compile('
		<li><a href="#/cards"><i class="icon-book"></i> All Cards</a></li>
		<li class="nav-header">Decks</li>
		{{#each models}}
		<li><a href="#/cards/deck/{{#if this.id}}{{this.id}}{{/if}}"><i class="icon-file"></i>{{this.attributes.title}}{{#if this.mine}} <em>[Your Deck]</em>{{/if}}</a></li>
		{{/each}}
	')

	activeRow: 0

	initialize: ->
		super()
		@model.bind("remove", @gotoAllCards, @)

	render: ->
		super()
		@showActiveRow()

	setActiveRow: (newRow) ->
		@activeRow = newRow
		@showActiveRow()

	showActiveRow: ->
		rows = @$("li")
		for row, i in rows
			$row = $(row)
			if i == @activeRow
				$row.addClass("active")
			else
				$row.removeClass("active")

	gotoAllCards: ->
		module.router.navigate("/cards", {trigger: true})

class CardModuleMainView extends Foundation.ModuleMainView

	className: -> super() + " row-fluid"

	content:
		'<div class="span2 module-sidebar">
			<h3>Cards and decks</h3>
			<ul class="nav nav-list side-nav-list">
			</ul>
			<div class="btn-toolbar side-toolbar well">
			</div>

		</div>
		<div class="span10 module-content">
			<div class="allCardsView"></div>
			<div class="cardSheetView" style="display:none;"></div>
		</div>'

	render: ->
		super()
		if not @allCardsView
			@allCardsView = new Foundation.CollectionView({
				headerView: new Foundation.StaticView(
					tagName: "h2"
					className: "noprint"
					content: "All Cards"
				)
				prependNew: true
				el: @$(".allCardsView")
				collection: module.cards
				modelViewClass: CardView
			})

		if not @cardSheetView
			@cardSheetView = new CardSheetView({
				el: @$(".cardSheetView")
				collection: module.cardsInDecks
				modelViewClass: CardInDeckView
				filter: (model)-> return false
			})

		if not @navView
			@navView = new NavView({
				el: @$(".side-nav-list")
				model: module.decks
			})

		if not @toolbarView
			@toolbarView = new UI.ToolbarView(
				el: @$(".side-toolbar")
				modelViewClass: UI.ButtonView
				collection: module.tools
			)

		@allCardsView.render()
		@cardSheetView.render()
		@navView.render()
		@toolbarView.render()
		@shownView = @allCardsView
		@addToDeckButtons = new UI.ButtonCollection()
		@resetAddToDeckButtons()
		module.cards.on("add remove change reset", @resetAddToDeckButtons, @)


	resetAddToDeckButtons: ->
		buttons = module.cards.map((card)=>
			new UI.Button(
				label: card.get("title")
				onClick: =>
					module.addCardInDeck(card, @cardSheetView.deck)
			)
		)
		@addToDeckButtons.reset(buttons)

	showAllCards: ->
		$(@cardSheetView.el).hide()
		$(@allCardsView.el).show()
		@navView.setActiveRow(0)
		module.tools.reset([
			{
				icon: "plus"
				label: "Add Card"
				onClick: ->
					module.addCard()
			},
			{
				icon: "plus"
				label: "Add Deck"
				onClick: ->
					module.addDeck()
			}
		])

	showDeck: (deckId) ->
		deck = module.getDeck(deckId)
		if deck
			@cardSheetView.setDeck(deck)
			@navView.setActiveRow(module.decks.indexOf(deck)+2)
			@cardSheetView.$el.show()
			@allCardsView.$el.hide()
			module.tools.reset([
				{
					icon: "plus"
					label: "Add to Deck"
					type: "dropdown"
					menu: @addToDeckButtons
				},
				{
					icon: "pencil"
					label: "Edit Deck"
					onClick: ->
						UI.editModel(deck)
				}
			])
		else
			module.router.navigate("/cards",{trigger:true})

	remove: ->
		@allCardsView.remove()
		@cardSheetView.remove()
		@navView.remove()
		@toolbarView.remove()



class CardController extends Foundation.ModuleController

	path: "/cards"
	label: "Cards"
	start: true

	initialize: ->
		module = @
		@cards = new CardCollection()
		@cardsInDecks = new CardInDeckCollection()
		@decks = new DeckCollection()
		@tools = new UI.ButtonCollection()
		super()

	setup: ->
		@mainView = new CardModuleMainView()
		@mainView.render()
		@cards.fetch()
		@cardsInDecks.fetch()
		@decks.fetch()
		@router = new CardRouter()

	addCard: ->
		card = new Card()
		UI.editModel(card)
		@cards.add(card)

	addDeck: ->
		deck = new Deck(user: currentUserId)
		UI.editModel(deck)
		@decks.add(deck, silent: true)

	addCardInDeck: (card, deck) ->
		@cardsInDecks.create(
			card: card.id
			deck: deck.id
		)

	getCard: (cardId) ->
		@cards.get(cardId)

	getDeck: (deckId) ->
		@decks.get(deckId)

	getCardInDeck: (cardInDeckId) ->
		@cardsInDecks.get(cardInDeckId)


# Exports

Foundation.Modules.Cards =
	# Attach the CardController to the Foundation.Modules to setup for initialization
	ModuleController: CardController