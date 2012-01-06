# Namespace

window.Cards = {}

# Globals

baseUrl = "/api/cards/"

# The Card Models and Collections

class Cards.CardText extends Backbone.Model

	defaults:
		label: "Label",
		text: "Text"

class Cards.CardTextCollection extends Backbone.Collection

	model: Cards.CardText

class Cards.Card extends Backbone.Model

	urlRoot: baseUrl + "card/"
	
	defaults:
		description		: "",
		title			: "",
		phase_1			: false,
		phase_2			: false,
		phase_3			: false,
		type			: "ACTN",
		body			: ""


class Cards.CardCollection extends Backbone.Collection

	model: Cards.Card
	
	url: baseUrl + "card/"
	
	comparator: (model) ->
		return model.get("title")
	
	addCard: =>
		@create()

# Views

class Cards.CardView extends Foundation.EditableTemplateView
		
	@template: Foundation.getTemplate("tmplCardContent")
	
	autoSave: true
	
	events:
		"click .showDelete"		: "showDeleteModal"
		"click .phase_1"		: "togglePhase1"
		"click .phase_2"		: "togglePhase2"
		"click .phase_3" 		: "togglePhase3"
		"click .action-type"	: "nextActionType"
		"click .delete"			: "delete"
		
	nextActionType: =>
		switch @model.get("type")
			when "ACTN" then @model.save(type:"MOVE")
			when "MOVE" then @model.save(type:"SPRT")
			when "SPRT" then @model.save(type:"REAC")
			when "REAC" then @model.save(type:"ACTN")

	togglePhase1: =>
		@model.save(phase_1 : not @model.get("phase_1"))

	togglePhase2: =>
		@model.save(phase_2 : not @model.get("phase_2"))

	togglePhase3: =>
		@model.save(phase_3 : not @model.get("phase_3"))
		
	addTextItem: =>
		@model.get("body").add(new Cards.CardText())
		
	showDeleteModal: =>
		$(".deleteModal .cardTitle").text(@model.get("title"))
		$(".deleteModal").modal("show")
		console.log(@model.get("id"))
		$(".deleteModal .do").data(modelId: @model.get("id"))
		console.log($(".deleteModal .do").data("modelId"))
		
	delete: =>
		@model.destroy()
		
	afterAdd: =>
		@attributeEditStart("title")
			

class Cards.CardListView extends Foundation.TemplateView
		
	@template: Foundation.getTemplate("tmplCardListContent")

# Router

class Cards.D12Router extends Backbone.Router

	initialize: =>
		@cards = new Cards.CardCollection()
		@cardSheetView = new Foundation.CollectionView({
			prependNew: true,
			el: "#cardSheetView",
			collection: @cards,
			modelViewClass: Cards.CardView
		})
		@cards.fetch()
		$("#cards-addCard").click(=>
			@cards.create()
		)
		$("#cards-refreshCards").click(=>@cards.fetch())
		$(".deleteModal").modal(
			keyboard: true,
			backdrop: true,
		)
		$("body").on("click", ".deleteModal .do", (event)=>
			cardId = $(".deleteModal .do").data("modelId")
			console.log(cardId)
			card = @cards.get(cardId)
			console.log(card)
			console.log(@cards.models)
			if card
				#@cards.remove(card)
				card.destroy()
			$(event.target).parents(".modal").modal("hide")
		)
		$("body").on("click",".modal .cancel", (event)=>
			$(".deleteModal").modal("hide")
		)
		super


# Initialization
window.Foundation.inits.push(->
	window.App = new Cards.D12Router()
)