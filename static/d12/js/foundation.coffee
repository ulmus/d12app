# Namescape
window.Foundation = Foundation = {}
window.Foundation.inits = []

# Templates

Foundation.markdownConverter = Markdown.getSanitizingConverter()

Handlebars.registerHelper("cardActionDisplay", (abbr) ->
	switch abbr
		when "ACTN" then "Action"
		when "MOVE" then "Move"
		when "SPRT" then "Support"
		when "REAC" then "Reaction"
)

Handlebars.registerHelper("cardActionClassName", (abbr) ->
	switch abbr
		when "ACTN" then "action"
		when "MOVE" then "move"
		when "SPRT" then "support"
		when "REAC" then "reaction"
)

Handlebars.registerHelper("markdown", (markdownText) ->
	return Foundation.markdownConverter.makeHtml(markdownText)
)

templateHash = {}

Foundation.addTemplate = (templateName, templateString) ->
	# Add a single template
	templateHash[templateName] = Handlebars.compile(templateString)

Foundation.generateTemplates = ->
	# auto-generate templates from script tags with the text/template type, using id as template id
	scripts = $("script[type='text/x-template']")
	for scriptTag in scripts
		tag = $(scriptTag)
		Foundation.addTemplate(tag.attr("id"), tag.html())

Foundation.getTemplate = (templateName) ->
	if templateHash[templateName]
		return templateHash[templateName]
	else
		console and console.log("TemplateError: Couldn't find #{templateName}")
		return $.noop

Foundation.generateTemplates()

# Generic Views

class Foundation.TemplateView extends Backbone.View

	@template: $.noop
	
	initialize: =>
		@bindModel(@model)
		super()
	
	render: =>
		@preRender();
		if @model and @constructor.template
			$(@el).html(@constructor.template({model: @model.toJSON()}))
		@delegateEvents()
		super
		@postRender();
		
	preRender: =>
		
	postRender: =>
		
	setModel: (newModel) =>
		@unbindModel(@model)
		@model = newModel
		@bindModel(@model)
		
	bindModel: (model) =>
		if model and model instanceof Backbone.Model
			model.bind("change", @render)
		else if model instanceof Backbone.Collection
			model.bind("add", @render)
			model.bind("reset", @render)
			model.bind("remove", @render)
		
	unbindModel: (model) =>
		if model and model instanceof Backbone.Model
			model.unbind("change", @render)
		else if model instanceof Backbone.Collection
			model.unbind("add", @render)
			model.unbind("reset", @render)
			model.unbind("remove", @render)
	
	remove: =>
		@unbindModel(@model)
		super()


class Foundation.EditableTemplateView extends Foundation.TemplateView
	
	autoSave : false
	
	initialize: () =>
		@events["click [data-attribute-editclick]"] = "attributeEditStartClick"
		@events["blur [data-attribute-edit]"] = "attributeEditDoneClick"
		@events["keypress input[type='text'][data-attribute-edit]"] = "attributeEditKeypress"
		@delegateEvents()
		_(@autoSave).defaults(
			autoSave: @options.autoSave
		)
		super()
	
	attributeEditStartClick: (event) =>
		@attributeEditStart($(event.currentTarget).data("attributeEditclick"))
		
			
	attributeEditStart: (attribute) =>
		clickable = @.$("[data-attribute-editclick='#{attribute}']")
		editable = @.$("[data-attribute-edit='#{attribute}']")
		clickable.hide()
		editable.val(@model.get(attribute))
		editable.show()
		editable.focus()
		editable.select()
		@onShowEdit(attribute)
		
	attributeEditDoneClick: (event) =>
		@attributeEditDone($(event.currentTarget).data("attributeEdit"))
		
	attributeEditDone: (attribute) =>
		clickable = @.$("[data-attribute-editclick='#{attribute}']")
		editable = @.$("[data-attribute-edit='#{attribute}']")
		clickable = @.$("[data-attribute-editclick='#{attribute}']")
		editable.hide()
		clickable.show()
		@onShowClickable(attribute)
		data = {}
		data[attribute] = editable.val()
		@model.set(data)
		if @autoSave
			@model.save()
	
	attributeEditKeypress: (event) =>
		if event.which == 13
			(event.target).blur()
	
	onShowEdit: (attribute) =>
	
	onShowClickable: (attribute) =>

class Foundation.CollectionView extends Backbone.View
	
	prependNew: false
	
	initialize: =>
		_(@options).defaults(
			prependNew: @prependNew
		)
		@prependNew = @options.prependNew
		@collection = @options.collection
		@modelViewClass = @options.modelViewClass
		@modelViews = {}
		@setup
		@bindCollection(@collection)
		super()
	
	bindCollection: (collection) =>
		@collection.bind("add", @addModel)
		@collection.bind("remove", @removeModel)
		@collection.bind("sort", @render)
		@collection.bind("reset", @setup)

	unbindCollection: (collection ) =>
		@collection.unbind("add", @addModel)
		@collection.unbind("remove", @removeModel)
		@collection.unbind("sort", @render)
		@collection.unbind("reset", @setup)
		
	getModels: =>
		return @collection.models
		
	render: =>
		$el = $(@el)
		$el.empty()
		for model in @getModels()
			view = @modelViews[model.cid]
			if view
				$el.append(view.el)
				view.render()					
			else
			 	console and console.log("CollectionViewError: ModelView not found for ", model)
		super
	
	remove: =>
		@unbindCollection(@collection)
		super
		
	setup: =>
		for view in @modelViews
			view.remove()
		@modelViews = {}
		for model in @getModels()
			@addModelView(model)
		@render()

	addModelView: (model) =>
		@removeModelView(model)
		@modelViews[model.cid] = new @modelViewClass(model: model)
	
	addModel: (model) =>
		view = @addModelView(model)
		if @prependNew
			$(@el).prepend(view.el)
		else
			$(@el).append(view.el)

		$(@el).append(view.el)
		$(view.el).hide()
		view.render()
		$(view.el).fadeIn(=>
			if view.afterAdd
				view.afterAdd()
		)
	
	removeModelView: (model) =>
		view = @modelViews[model.cid]
		if view
			$(view.el).fadeOut(=>
				@modelViews[model.cid].remove()
				delete @modelViews[model.cid]
			)
		
	removeModel: (model) =>
		@removeModelView(model)
		@render()

	
class Foundation.FilteredCollectionView extends Foundation.CollectionView
	
	filter: (model) =>
		return true
	
	initialize: =>
		if @options.filter
			@filter = @options.filter
		super()

	getModels: =>
		return @collection.filter(@filter)
			
	addModel: (model) =>
		if @filter(model)
			super()
			

# Initialization

init = ->
	csrfToken = $('input[name=csrfmiddlewaretoken]').val()
	$(document).ajaxSend((e, xhr, settings) ->
    	xhr.setRequestHeader('X-CSRFToken', csrfToken)
	)
	$.ajaxSetup(cache:false)
	for init in Foundation.inits
		init()
	if Backbone.history
		Backbone.history.start()

$(document).ready(init)
