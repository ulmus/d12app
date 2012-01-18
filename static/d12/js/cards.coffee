# Namespace

window.Cards = {}

# Globals

baseUrl = "/api/cards/"

# The Card Models and Collections

class Cards.Card extends Foundation.Model

	@name: "card"

	rootUrl: baseUrl + "card/"
	
	defaults:
		category		: "BASC"
		title			: ""
		type			: "ACTN"
		body			: ""
		keywords		: []
		
	schema:
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
		protected:
			type: "Checkbox"
			title: "Protected"


	toString: =>
		@get("title")

class Cards.CardCollection extends Foundation.Collection

	model: Cards.Card
	rootUrl: baseUrl + "card/"

	comparator: (model) ->
		return model.get("category") + model.get("type") + model.get("title")


class Cards.Deck extends Foundation.Model
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

	toString: =>
		@get("title")


class Cards.DeckCollection extends Foundation.Collection

	model: Cards.Deck
	rootUrl: baseUrl + "deck/"


class Cards.CardInDeck extends Foundation.Model
	
	rootUrl: baseUrl + "cardindeck/"
	
	defaults:
		deck:		0
		card:		0
		order:		0
		

	getCard: =>
		return App.allCards.get(@.get("card"))
	
	getDeck: =>
		return App.decks.get(@.get("deck"))
	
	toString: =>
		@get("title")

class Cards.CardInDeckCollection extends Foundation.Collection

	model: Cards.CardInDeck
	rootUrl: baseUrl + "cardindeck/"

########################
# VIEWS                #
########################

class Cards.CardView extends Foundation.EditableTemplateView
		
	@template: Foundation.getTemplate("tmplCard")
	@modelName = "card"
	
	render: =>
		super()
		@$(".card").draggable(
			appendTo: "body"
			helper: "clone"
			delay: 50
			cursorAt:
				left: 120
				top: 170
		)
		@

	showEdit: =>
		super()
		@$(".editForm textarea#body").popover({
			title: => "Formatting help"
			content: => $("#markdown-help").html()
			html: true
			trigger: "focus"
		})


class Cards.CardInDeckView extends Foundation.TemplateView

	@template: Foundation.getTemplate("tmplCardInDeck")

	getContext: =>
		return {
			attr: @model.toJSON()
			model: @model
			card: App.allCards.get(@model.get("card"))
			deck: App.decks.get(@model.get("deck"))
		}

	render: =>
		super()
		@$(".card").draggable(
			appendTo: "body"
			helper: "clone"
			delay: 50
			cursorAt:
				left: 120
				top: 170
		)
		@

class Cards.DeckView extends Foundation.TemplateView

	events:
		"click": 	"showDeck"

	@template: Handlebars.compile(
		'<div class="contents">
			<div class="number-of-cards"></div>
			<h2 class="title">
				{{attr.title}}
			</h2>
		</div>'
	)

	className: "deck display clickable visual-drop-target showDeck"

	initialize: =>
		super()
		App.allCardsInDecks.bind("reset", @updateNumberOfCards, @)
		App.allCardsInDecks.bind("add", @updateNumberOfCards, @)
		App.allCardsInDecks.bind("remove", @updateNumberOfCards, @)

	render: =>
		super()
		@$(".deck").droppable(
			tolerance: "pointer"
			accept: ".card"
			hoverClass: 'drophover'
			drop: (event, ui) =>
				@dropCard(event, ui)
		)
		@updateNumberOfCards()
		@

	dropCard: (event, ui) =>
		App.allCardsInDecks.create(
			card: ui.draggable.data("cardId")
			deck: @model.id
		)

	updateNumberOfCards: =>
		count = App.allCardsInDecks.filter((model)=>
			return (model.get("deck") == @model.id)
		).length
		@$(".number-of-cards").text(count)

	showDeck: =>
		App.navigate("cards/deck/#{@model.id}", true)


	remove: =>
		App.allCardsInDecks.unbind("reset", @updateNumberOfCards)
		App.allCardsInDecks.unbind("add", @updateNumberOfCards)
		App.allCardsInDecks.unbind("remove", @updateNumberOfCards)

class Cards.TrashView extends Backbone.View

	render: =>
		super()
		@$(".content").droppable(
			tolerance: "pointer"
			accept: ".card",
			hoverClass: 'drophover'
			drop: (event, ui) =>
				@dropCard(event, ui)
		)

	dropCard: (event, ui) =>
		modelId = ui.draggable.data("modelId")
		modelType = ui.draggable.data("modelType")
		isProtected = ui.draggable.data("protected")
		switch modelType
			when "card"
				object = App.allCards.get(modelId)
				if object and not isProtected
					@showDeleteModal(object)
			when "cardInDeck"
				object = App.allCardsInDecks.get(modelId)
				if object and not isProtected
					object.destroy()
		if object and isProtected
			@showProtectedModal(object)


	showDeleteModal: (model) =>
		modalString = Foundation.getTemplate("tmplDeleteModal")(
			modelName: model.constructor.name
			instanceName: model.toString()
		)
		deleteModal = $(modalString).modal(
			keyboard: true,
			backdrop: true,
		)
		deleteModal.bind('hidden', =>
			deleteModal.remove()
		)
		$(".do", deleteModal).click(=>
			model.destroy()
			deleteModal.modal("hide")
		)
		$(".cancel", deleteModal).click(=>
			deleteModal.modal("hide")
		)

		deleteModal.focus()
		deleteModal.modal("show")

	showProtectedModal: (model) =>
		modalString = Foundation.getTemplate("tmplProtectedModal")(
			modelName: model.constructor.name
			instanceName: model.toString()
		)
		protectedModal = $(modalString).modal(
			keyboard: true,
			backdrop: true,
		)
		protectedModal.bind('hidden', =>
			protectedModal.remove()
		)
		$(".cancel", protectedModal).click(=>
			protectedModal.modal("hide")
		)
		protectedModal.focus()
		protectedModal.modal("show")

class Cards.ShowCardsMenuView extends Backbone.View

	@itemTemplate: Handlebars.compile("<li><a class='show-menu-item' href='#cards/deck/{{ model.id }}' data-model-id='{{model.id}}'>{{attr.title}}</a></li>")

	shownId: 0

	initialize: =>
		super()
		@collection = @options.collection
		@collection.bind("reset", @render, @)
		@collection.bind("add", @render, @)
		@collection.bind("remove", @render, @)
		@collection.bind("change", @render, @)

	render: =>
		html = "<li><a class='show-menu-item' href='#cards/all' data-model-id='-1'>All cards</a></li>"
		for model in @collection.models
			html += @constructor.itemTemplate(
				attr: model.toJSON(),
				model: model
			)
		$(@el).html(html)

	remove: =>
		@collection.unbind("reset", @render)
		@collection.unbind("add", @render)
		@collection.unbind("remove", @render)
		@collection.unbind("change", @render)


class Cards.SearchBoxView extends Backbone.View

	events:
		"keyup input":		"doSearch"

	clear: =>
		@setSearch("")

	setSearch: (term) =>
		@$("input").val(term)
		@doSearch()

	doSearch: (event) =>
		term = @$("input").val()
		if term == ""
			App.shownView.showAll()
		else
			term = term.toUpperCase()
			if App.shownView == App.allCardsView
				App.shownView.hideSome((model)->
					title = model.get("title")
					title = title.toUpperCase()
					title.indexOf(term)
				)
			if App.shownView == App.cardSheetView
				App.shownView.hideSome((model)->
					title = model.getCard().get("title")
					title = title.toUpperCase()
					title.indexOf(term)
				)

class Cards.CardSheetView extends Foundation.FilteredCollectionView

	@cardDisplayTemplate = Handlebars.compile("{{attr.title}}")

	initialize: =>
		@headerView = new Foundation.TemplateView(
			tagName: "h2"
			template: @constructor.cardDisplayTemplate
		)
		super()

	setDeck:(deck) =>
		@setFilter((model) -> return model.get("deck") == deck.get("id"))
		@headerView.setModel(deck)


class Cards.DeckCollectionView extends Foundation.CollectionView

	events:
		"click .showAllCards"		: "showAllCards"
		"click .addNewDeck"			: "addNewDeck"

	initialize: =>
		@modelViewClass = Cards.DeckView
		@headerView = new Foundation.StaticView(
			className: "deck display clickable showAllCards noprint"
			content:
				'<div class="contents">
					<div class="number-of-cards"></div>
					<h2 class="title">
						All Cards
					</h2>
				</div>'
			)
		@footerView = new Foundation.StaticView(
			className: "deck display clickable addNewDeck"
			content:
					'<div class="contents">
						<div class="number-of-cards"></div>
						<h2 class="title">
							Add new deck
						</h2>
					</div>'
		)
		super()
		App.allCards.bind("reset", @updateNumberOfCards, @)
		App.allCards.bind("add", @updateNumberOfCards, @)
		App.allCards.bind("remove", @updateNumberOfCards, @)

	render: =>
		super()
		@updateNumberOfCards()

	showAllCards: =>
		App.navigate("cards/all", true)

	addNewDeck: =>
		App.decks.create(
			user: currentUserId
		)

	updateNumberOfCards: =>
		count = App.allCards.length
		@$(".showAllCards .number-of-cards").text(count)

	remove: =>
		App.allCards.unbind("reset", @updateNumberOfCards)
		App.allCards.unbind("add", @updateNumberOfCards)
		App.allCards.unbind("remove", @updateNumberOfCards)

# Router

class Cards.D12Router extends Backbone.Router

	routes:
		"cards/all" :			"showAllCards"
		"cards/deck/:deck_id" :	"showCardSheet"

	shownView = null

	setup: =>
		# General bindings
		@.bind("form:error", @.showError)

		# Views and general collections
		@allCards = new Cards.CardCollection()
		@allCards.fetch()

		@allCardsView = new Foundation.CollectionView({
			headerView: new Foundation.StaticView(
				tagName: "h2"
				className: "noprint"
				content: "All Cards"
			)
			prependNew: true,
			el: "#allCardsView",
			collection: @allCards,
			modelViewClass: Cards.CardView
		})

		@allCardsInDecks = new Cards.CardInDeckCollection()
		@allCardsInDecks.fetch()

		@cardsInDeck = new Cards.CardInDeckCollection()
		@cardSheetView = new Cards.CardSheetView({
			el: "#cardSheetView",
			collection: @allCardsInDecks,
			modelViewClass: Cards.CardInDeckView
			filter: (model)-> return false
		})

		@decks = new Cards.DeckCollection()
		@deckListView = new Cards.DeckCollectionView(
			el: "#decksView",
			collection: @decks,
		)
		@showMenu = new Cards.ShowCardsMenuView(
			el: $("#cards-showMenu")
			collection: @decks
		)
		@decks.fetch()

		# Trash can
		@trashView = new Cards.TrashView(
			el: "#trashView"
		)
		@trashView.render()

		# Navigation bar
		$("#cards-addCard").click(=>
			@showAllCards()
			@allCards.create()
		)

		$("#cards-refreshCards").click(=>
			@allCards.fetch()
			@decks.fetch()
			@cardsInDeck.fetch()
		)

		$("#cards-printout").click(=>
			@printOut()
		)

		# Search View

		@searchView = new Cards.SearchBoxView({
			el: $("#cards-searchBox")
		})

		@shownView = @allCardsView


	printOut: =>
		printout = new Printouts.Printout(
			body: $(@shownView.el).html()
			title: "Cards",
			filename: "cards.pdf",
		)
		printout.save().then(=>
			window.open("/api/export/pdf/#{printout.get("uuid")}/", "_new")
		)

	showAllCards: =>
		$(@cardSheetView.el).hide()
		$(@allCardsView.el).show()
		@shownView = @allCardsView
		@searchView.clear()

	showCardSheet: (deck_id) =>
		intId = parseInt(deck_id)
		deck = @decks.get(deck_id)
		$(@allCardsView.el).hide()
		@cardSheetView.setDeck(deck)
		$(@cardSheetView.el).show()
		@shownView = @cardSheetView
		@searchView.clear()

	showError: (errorData) =>
		$("<div>#{errorData.error}<p><button class='btn cancel'>Ok</button></p></div>").modal(
			title: "Validation error"
		)


# Initialization
window.Foundation.inits.push(->
	window.App = new Cards.D12Router()
	App.setup()
	window.location.hash=""
)