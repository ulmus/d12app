# Namescape
window.Foundation = Foundation = {}
window.Foundation.inits = []

# Templates

Foundation.markdownConverter = Markdown.getSanitizingConverter()

Handlebars.registerHelper("cardActionDisplay", (abbr) ->
	switch abbr
		when "ACTN" then "Main"
		when "MOVE" then "Positioning"
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

Handlebars.registerHelper("collectionCount", (collection) ->
	return collection.length
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


# Model and Collection

class Foundation.Collection extends Backbone.Collection

	initialize: (models, options) =>
		options or (options = {})
		@_params = if options.params then options.params else {}
		super(models, options)

	queryParams: =>
		return @_params

	setParam: (key, value) =>
		@_params[key] = value

	unsetParam: (key) =>
		delete @_params[key]

	url: =>
		@rootUrl

class Foundation.Model extends Backbone.Model

	_params: {}

	queryParams: =>
		return @_params

	toString: =>
		return "model"

	toJSON: =>
		attr = _(@attributes).clone()
		delete attr.id
		attr

#  Form Fields

class Backbone.Form.editors.MultipleSelect extends Backbone.Form.editors.Select

	renderOptions: (options) =>
		super(options)
		$(@el).attr("multiple", "multiple")

class Backbone.Form.editors.ChosenMultipleSelect extends Backbone.Form.editors.MultipleSelect

	renderOptions: (options) =>
		super(options)
		$(@el).addClass("chosen-select")

class Backbone.Form.editors.ChosenSelect extends Backbone.Form.editors.Select

	renderOptions: (options) =>
		super(options)
		$(@el).addClass("chosen-select")


# Generic Views

class Foundation.TemplateView extends Backbone.View

	@template: $.noop
	
	initialize: =>
		@bindModel(@model)
		super()
	
	render: =>
		if @model and @constructor.template
			$(@el).html(@constructor.template(@getContext()))
		@delegateEvents()
		super()

	getContext: =>
		return {
			model: @model
			attr: @model.toJSON()
		}

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

	@modelName = "object"

	delegateEvents: =>
		modelEvents = @events || {};
		events = _(modelEvents).clone()
		_(events).extend(
			"click .display"		: "showEdit"
			"click .edit .cancel"	: "showDisplay"
			"click .edit .save"		: "commitEdit"
			"submit .editForm"		: "commitEdit"
			"keyup .edit"			: "editKeyUp"
		)
		super(events)

	render: =>
		super()
		@form = new Backbone.Form(
			model: @model,
			el: @.$(".editForm")
		).render()

	showEdit: =>
		@$(".display").addClass("hide").removeClass("show")
		@$(".edit").removeClass("hide").addClass("show")
		@$(".chosen-select").chosen()
		setTimeout(=>
			@.$(".edit").addClass("scale")
		,0)
		setTimeout(=>
			@.$('.edit form :input').eq(1).focus().select()
		,150)

	showDisplay: =>
		@.$(".edit").removeClass("scale")
		setTimeout(=>
			@.$(".edit").removeClass("show").addClass("hide")
			@.$(".display").removeClass("hide").addClass("show")
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

	afterAdd: =>
		@showEdit()


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

		view.render()
		if view.afterAdd
			view.afterAdd()

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

	setFilter: (filter) =>
		@filter = filter
		@setup()

	getModels: =>
		return @collection.filter(@filter)
			
	addModel: (model) =>
		if @filter(model)
			super()
			
# Backbone.sync

# Map from CRUD to HTTP for our default `Backbone.sync` implementation.
methodMap =
	'create': 'POST',
	'update': 'PUT',
	'delete': 'DELETE',
	'read'  : 'GET'

# Helper function to get a URL from a Model or Collection as a property
# or as a function.
getUrl = (object) ->
  if (not (object && object.url)) then return null
  return if _.isFunction(object.url) then object.url() else object.url

# If the collection or model has a queryParams attribute, cas a function or object literal
# use it to set the query-string

getParams = (object) ->
	if (not (object && object.url)) then return ""
	queryParams = if _.isFunction(object.queryParams) then object.queryParams() else object.queryParams
	queryString = ""
	if queryParams and not _.isEmpty(queryParams)
		queryString = "?" + "#{key}=#{value}" for key, value of queryParams
	return queryString

# Throw an error when a URL is needed, and none is supplied.
urlError = ->
	throw new Error('A "url" property or function must be specified')


Backbone.sync = (method, model, options) ->
	type = methodMap[method]

	# Default JSON-request options.
	params = _.extend({
	  type:         type
	  dataType:     'json'
	}, options)

	# Ensure that we have a URL.
	if not params.url
	  params.url = getUrl(model) or urlError()
	  params.url += getParams(model)


	# Ensure that we have the appropriate request data.
	if not params.data and model and (method == 'create' or method == 'update')
	  params.contentType = 'application/json';
	  params.data = JSON.stringify(model.toJSON());


	# Don't process data on a non-GET request.
	if (params.type != 'GET')
	  params.processData = false

	# Make the request.
	return $.ajax(params)


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
