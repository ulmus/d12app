# Namespace

window.Cards = {}

# Globals

baseUrl = "/api/cards/"

# The Card Models and Collections

class Cards.Card extends Backbone.Model

	urlRoot: baseUrl + "card/"
	
	defaults:
		description		: ""
		title			: ""
		phase_1			: false
		phase_2			: false
		phase_3			: false
		type			: "ACTN"
		body			: ""
		
	schema:
		title:
			type: "Text"
			title: "Title"
		description:
			type: "Text"
			title: "Description"
		body: 
			type: "TextArea"
			title: "Card Text"
		type:
			type: "Select"
			title: "Card Type"
			options: [
				{val: "ACTN", label: "Primary"},
				{val: "MOVE", label: "Move"},
				{val: "SPRT", label: "Support"},
				{val: "REAC", label: "Reaction"},				
			]
		phase_1:
			title: "Phase 1"
			type: "Checkbox"
		phase_2:
			title: "Phase 2"
			type: "Checkbox"
		phase_3:
			title: "Phase 3"
			type: "Checkbox"			

class Cards.CardCollection extends Backbone.Collection

	model: Cards.Card
	favorites = false

	url: =>
		url = baseUrl + "card/"
		parameters = []
		if @deck
			parameters.push(key: "deck", value: @deck)
		
		if not _(parameters).isEmpty()
			url += "?"
		for param in parameters
			url += "#{param.key}=#{param.value}&"
		
		return url
			
	comparator: (model) ->
		return model.get("title")
	
	addCard: =>
		@create()
		
	initialize: (models, options) =>
		if options and options.deck
			@deck = options.deck
		super(models, options)



class Cards.Deck extends Backbone.Model
	
	urlRoot: baseUrl + "deck/"
	
	defaults:
		title:			""
		description:	""

	initialize: =>
		@cardsInDeck = new Cards.CardInDeckCollection(deck: @id)
		@cardsInDeck.fetch()

class Cards.DeckCollection extends Backbone.Collection
	
	url: =>
		url = baseUrl + "deck/"
		parameters = []
		if @user
			parameters.push(key: "user", value: @user)
		
		if not _(parameters).isEmpty()
			url += "?"
		for param in parameters
			url += "#{param.key}=#{param.value}&"
		
		return url

	initialize: (models, options) =>
		if options and options.user
			@user = options.user
		super(models,options)


class Cards.CardInDeck extends Backbone.Model
	
	urlRoot: baseUrl + "cardindeck/"
	
	defaults:
		deck:		0
		card:		0
		order:		0
		
	getCard: =>
		return App.cards.get(@.get("card"))
	
	getDeck: =>
		return App.decks.get(@.get("deck"))
	
class Cards.CardInDeckCollection extends Backbone.Collection
		
	url: =>
		url = baseUrl + "cardindeck/"
		parameters = []
		if @user
			parameters.push(key: "deck", value: @deck)
		
		if not _(parameters).isEmpty()
			url += "?"
		for param in parameters
			url += "#{param.key}=#{param.value}&"
		
		return url

	initialize: (models, options) =>
		if options and options.deck
			@deck = options.deck
		super(models,options)

# Views

class Cards.CardView extends Foundation.EditableTemplateView
		
	@template: Foundation.getTemplate("tmplCardContent")
	
	events:
		"click .card.display"		: "showEdit"
		"click .card.edit .cancel"	: "showDisplay"
		"click .card.edit .save"	: "commitEdit"
		"click .card.edit .delete"	: "showDeleteModal"
		"submit .editForm"			: "commitEdit"
		"keyup .card.edit"			: "editKeyUp"
	
	autoSave: true
	
	render: =>
		super()
		@form = new Backbone.Form(
			model: @model,
			el: @.$(".editForm")
		).render()
		$(@el).draggable(
			helper: "clone"
			cursorAt:
				left: 120
				top: 170
		)

	showDeleteModal: =>
		@showDisplay()
		$(".deleteModal .cardTitle").text(@model.get("title"))
		$(".deleteModal").modal("show")
		$(".deleteModal .do").data(modelId: @model.get("id"))
		
	delete: =>
		@model.destroy()
		
	afterAdd: =>
		@showEdit()
	
	showEdit: =>
		@.$(".card.display").addClass("hide").removeClass("show")
		@.$(".card.edit").removeClass("hide").addClass("show")
		setTimeout(=>
			@.$(".card.edit").addClass("scale")
		,0)
		setTimeout(=>
			@.$('.card.edit :input').eq(3).focus().select()
		,150)
	
	showDisplay: =>
		@.$(".card.edit").removeClass("scale")
		setTimeout(=>
			@.$(".card.edit").removeClass("show").addClass("hide")
			@.$(".card.display").removeClass("hide").addClass("show")
		, 150)
	
	commitEdit: (event) =>
		errors = @form.validate()
		if errors
			for error in errors
				App.trigger("form:error", {
					form: @form,
					view: @,
					model: @model,
					error: error
				})
		else
			@showDisplay()
			setTimeout(=>
				@form.commit()
				@model.save()
			,150)
			
		return event.preventDefault()
		
	editKeyUp: (event) =>
		if event.which == 27
			@showDisplay()
			
	

class Cards.CardListView extends Foundation.TemplateView
		
	@template: Foundation.getTemplate("tmplCardListContent")

# Router

class Cards.D12Router extends Backbone.Router

	initialize: =>
		# General bindings
		@.bind("form:error", @.showError)
		
		# Views and general collections
		@cards = new Cards.CardCollection()
		
		@cardSheetView = new Foundation.CollectionView({
			prependNew: true,
			el: "#cardSheetView",
			collection: @cards,
			modelViewClass: Cards.CardView
		})
		@cards.fetch()
		
		# Navigation bar
		$("#cards-addCard").click(=>
			@cards.create()
		)
		$("#cards-refreshCards").click(=>@cards.fetch())

		# Generic app functions
		$(".deleteModal").modal(
			keyboard: true,
			backdrop: true,
		)
		$("body").on("click", ".deleteModal .do", @deleteClick)
		$("body").on("click",".modal .cancel", (event)=>
			$(".deleteModal").modal("hide")
		)	
		
		super()
	
	deleteClick: (event) =>
			cardId = $(".deleteModal .do").data("modelId")
			card = @cards.get(cardId)
			if card
				@cards.remove(card)
				card.destroy()
			$(".deleteModal").modal("hide")
					
	showError: (errorData) =>
		$("<div>#{errorData.error}<p><button class='btn cancel'>Ok</button></p></div>").modal(
			title: "Validation error"
		)


# Initialization
window.Foundation.inits.push(->
	window.App = new Cards.D12Router()
)