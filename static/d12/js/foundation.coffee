# Templates

markdownConverter = Markdown.getSanitizingConverter()

Handlebars.registerHelper("markdown", (markdownText) ->
	return markdownConverter.makeHtml(markdownText)
)

Handlebars.registerHelper("collectionCount", (collection) ->
	return collection.length
)

Handlebars.registerHelper("anchor", (anchorString) ->
	if anchorString and @anchors and @anchors[anchorString]
		return " data-anchor='#{@anchors[anchorString]}' "
	else
		return ""
)

templateHash = {}

addTemplate = (templateName, templateString) ->
	# Add a single template
	templateHash[templateName] = Handlebars.compile(templateString)

generateTemplates = ->
	# auto-generate templates from script tags with the text/template type, using id as template id
	scripts = $("script[type='text/x-template']")
	for scriptTag in scripts
		tag = $(scriptTag)
		addTemplate(tag.attr("id"), tag.html())

getTemplate = (templateName) ->
	if templateHash[templateName]
		return templateHash[templateName]
	else
		console and console.log("TemplateError: Couldn't find #{templateName}")
		return $.noop


generateTemplates()

# Store for looking up models

# Model and Collection

class Collection extends Backbone.Collection

	@storeName: "collection"

	initialize: (models, options) ->
		options or (options = {})
		@_params = if options.params then options.params else {}
		super(models, options)

	queryParams: ->
		return @_params

	setParam: (key, value) ->
		@_params[key] = value

	unsetParam: (key) ->
		delete @_params[key]

	url: ->
		@rootUrl


class Model extends Backbone.Model

	@readonly: []

	initialize: ->
		@_params = {}
		super()

	queryParams: ->
		return @_params

	setParam: (key, value) ->
		@_params[key] = value

	unsetParam: (key) ->
		delete @_params[key]

	toString: ->
		return "model"

	url: ->
		if @isNew()
			return @rootUrl
		else
			return @rootUrl + @id

class Router extends Backbone.Router

###
The basic Foundation View, includes functionality for handling subViews in the view, including hooks for
anchors used among other places in Foundation.TemplateView
###
class View extends Backbone.View

	events: ->
		{}

	attributes: ->
		{}

	className: ->
		""

	initialize: ->
		@childViews = @options.childViews ? {}
		super()

	addChildView: (newChildView, options) ->
		if not newChildView
			return null
		options ?= {}
		_.defaults(options, render: true, anchor: null, placement: "set")
		@childViews[newChildView.cid] = view: newChildView, options: options
		newChildView

	removeChildView: (childView) ->
		if childView
			delete @childViews[childView.cid]

	getChildView: (cid) ->
		@childViews[cid]?.view

	remove: ->
		for cid, childView of @childViews
			childView.view?.remove()
		@unbind()
		super()

	render: ->
		super()
		for cid, childView of @childViews
			if childView.options.anchor
				anchorElement = @$("[data-anchor='#{childView.options.anchor}']")
				switch childView.options.placement
					when "inside"
						anchorElement.empty()
						anchorElement.append(childView.view.el)
					when "replace"
						anchorElement.replaceWith(childView.view.el)
					else # "set"
						childView.view.setElement(anchorElement)
			if childView.options.render
				childView.view.render()


#  Form Fields

class Backbone.Form.editors.MultipleSelect extends Backbone.Form.editors.Select

	renderOptions: (options) ->
		super(options)
		$(@el).attr("multiple", "multiple")

class Backbone.Form.editors.ChosenMultipleSelect extends Backbone.Form.editors.MultipleSelect

	renderOptions: (options) ->
		super(options)
		$(@el).addClass("chosen-select")

class Backbone.Form.editors.ChosenSelect extends Backbone.Form.editors.Select

	renderOptions: (options) ->
		super(options)
		$(@el).addClass("chosen-select")


# Generic Views

###
A static HTML view for static content, re-rendered on render
###
class StaticView extends View

	content: ""

	initialize: ->
		@content = @options.content ? @content
		@$el.html(@content)
		super()

	render: ->
		@$el.html(@content)
		super()
		@

	setContent: (newContent) ->
		@content = newContent
		@$el.html(@content)
		@render()


###
A view with a template, rendering the template content on render using the getContext method to get context to put into
the template. Will take compiled template functions as an option.template or as a constructor on a child class.
###
class TemplateView extends View

	initialize: ->
		@context = @options.context ? {}
		@template = @options.template ? @constructor.template ? $.noop
		super()

	render: ->
		@$el.html(@template(@getContext()))
		# Super is called after generating the html, to attach potential childViews
		super()
		@

	getContext: ->
		return @context



###
A TemplateView that takes its context from a model or a collection, if a Model is given in the options, the context
is extended with 'model' and 'attr' keys with references to the model instance and its attributes respectively. If the
model option points to a collection, the context instead gets the keys 'collection', 'models' and 'attrs' respectively
referring to the collection, its models and the model attributes using toJSON on the collection
The view is bound to "change", "add", "reset" and "remove" events on the model/collection and will
re-render on those events.
As a hook for the CollectionView, the ModelView has an "afterAdd" callback that can be overridden to provide functionality
for when the modelView is added to a collectionView.
###
class ModelView extends TemplateView

	className: -> ""

	attributes: -> {}

	initialize: ->
		@bindModel(@model)
		@showEditOnNew = @options.showEditOnNew ? @showEditOnNew
		super()

	render: ->
		super()
		@setAttributes()
		@

	setAttributes: ->
		if @model
			attr = @attributes()
			attr["class"] = @className()
			@$el.attr(attr)
			@$el.data("modelId", @model.id)
			@$el.data("modelCid", @model.cid)

	setClassName: ->
		@$el

	getContext: ->
		context = super()
		if @model and @model instanceof Model
			_.extend(context,
			{
				model: @model
				attr: @model?.toJSON() ? {}
			})
		else if @model instanceof Collection
			_.extend(context,
			{
				collection: @model
				models: @model?.models
				attrs: @model?.toJSON() ? {}
			})
		context

	setModel: (newModel) ->
		@unbindModel(@model)
		@model = newModel
		@bindModel(@model)
		@render()

	bindModel: (model) ->
		if model and model instanceof Model
			model.bind("change", @render, @)
		else if model instanceof Collection
			model.bind("add", @render, @)
			model.bind("reset", @render, @)
			model.bind("remove", @render, @)

	unbindModel: (model) ->
		if model and model instanceof Backbone.Model
			model.unbind("change", @render)
		else if model instanceof Backbone.Collection
			model.unbind("add", @render)
			model.unbind("reset", @render)
			model.unbind("remove", @render)

	remove: ->
		@unbindModel(@model)
		super()

	afterAdd: ->
		if @showEditOnNew and @model.isNew()
			@showEdit()


class CollectionView extends View

	modelViewClass : null
	prependNew : false

	initialize: ->
		_(@options).defaults(
			prependNew: @prependNew
		)
		_.defaults(@, {

		})
		@prependNew = @options.prependNew ? @prependNew
		@headerView = @options.headerView  ? null
		@footerView = @options.footerView ? null
		@collection = @options.collection ? null
		@modelViewClass = @options.modelViewClass ? @cmodelViewClass
		@modelViewOptions = @options.modelViewOptions ? @modelViewOptions
		@modelViews = {}
		@setup()
		@bindCollection(@collection)
		super()

	bindCollection: (collection) ->
		@collection.bind("add", @addModel, @)
		@collection.bind("remove", @removeModel, @)
		@collection.bind("sort", @render, @)
		@collection.bind("reset", @setupAndRender, @)

	unbindCollection: (collection ) ->
		@collection.unbind("add", @addModel, @)
		@collection.unbind("remove", @removeModel, @)
		@collection.unbind("sort", @render, @)
		@collection.unbind("reset", @setupAndRender, @)

	getModels: ->
		return @collection.models

	render: ->
		@$el.empty()
		if @headerView
			@$el.append(@headerView.el)
			@headerView.render()
		for model in @getModels()
			view = @modelViews[model.cid]
			if view
				@$el.append(view.el)
				view.render()
				view.delegateEvents()
			else
			 	console and console.log("CollectionViewError: ModelView not found for ", model)
		if @footerView
			@$el.append(@footerView.el)
			@footerView.render()
		super()
		@

	remove: ->
		@unbindCollection(@collection)
		super

	setup: ->
		for view in @modelViews
			view.remove()
		@modelViews = {}
		for model in @getModels()
			@addModelView(model)

	setupAndRender: ->
		@setup()
		@render()

	addModelView: (model) ->
		@removeModelView(model)
		@modelViews[model.cid] = new @modelViewClass(model: model)

	addModel: (model) ->
		view = @addModelView(model)
		if @prependNew
			if @headerView
				$(view.el).insertAfter(@headerView.el)
			else
				$(@el).prepend(view.el)
		else
			if @footerView
				$(view.el).insertBefore(@footerView.el)
			else
				$(@el).append(view.el)

		view.render()
		if view.afterAdd
			view.afterAdd()

	removeModelView: (model) ->
		view = @modelViews[model.cid]
		if view
			$(view.el).fadeOut(=>
				@modelViews[model.cid].remove()
				delete @modelViews[model.cid]
			)

	removeModel: (model) ->
		@removeModelView(model)
		@render()

	getModelView: (model) ->
		view = @modelViews[model.cid]
		if view
			return view
		else
		 	console and console.log("CollectionViewError: ModelView not found for ", model)

	setHeaderView: (newHeaderView) ->
		@headerView.remove()
		@headerView = newHeaderView
		if @headerView
			$(@el).prepend(@headerView.el)
			@headerView.render()

	setFooterView: (newFooterView) ->
		@footerView.remove()
		@footerView = newFooterView
		if @footerView
			$(@el).prepend(@footerView.el)
			@footerView.render()

	hideSome: (hideFn) ->
		models = @getModels()
		for model in models
			view = @getModelView(model)
			if hideFn(model)
				$(view.el).hide()
			else
				$(view.el).show()

	showAll: ->
		models = @getModels()
		for model in models
			view = @getModelView(model)
			$(view.el).show()


class FilteredCollectionView extends CollectionView

	filter: (model) ->
		return true

	initialize: ->
		if @options.filter
			@filter = @options.filter
		super()

	setFilter: (filter) ->
		@filter = filter
		@setup()

	getModels: ->
		return @collection.filter(@filter)

	addModel: (model) ->
		if @filter(model)
			super(model)


class ModuleController

	@name: "module"

	initialize: ->
		@name = @constructor.name
		true

	setup: ->
		true

class ModuleMainView extends StaticView

	@content: "<div class='span2 module-sidebar'></div><div class='span10 module-content'></div>"

	initialize: ->
		super()
		@name = @options.moduleName ? "module"
		$(@el).attr("id", "module-#{@name}")


class AppController

	initialize: ->
		@modules = {}
		@modulesContainerElement = $("#app-main")
		@modulesNavigationElement = $("#app-nav")

		# Register all modules that have attached themselves to the Module object
		for moduleName, Module of Foundation.Modules
			@registerModule(moduleName, new Module.ModuleController())

		# Start all the routers
		if Backbone.history
			Backbone.history.start()

	showModule: (module) ->
		if _.isString(module)
			module = @modules[moduleName]
		for aModuleName, aModule of @modules
			if aModule == module
				$(aModule.mainView.el).show()
			else
				$(aModule.mainView.el).hide()

	registerModule: (moduleName, module) ->
		@modules[moduleName] = module
		module.initialize()
		module.setup()
		if module.mainView
			# If the module provides a mainView, attach it to the mainView list
			$(module.mainView.el).appendTo(@modulesContainerElement)
		if module.label
			# If the module provides a label, display it in the main Navigation
			@modulesNavigationElement.append("<li><a href='#/#{module.name}'>#{module.label}</a></li>")

	deRegisterModule: (moduleName) ->
		modules[moduleName] = null
		delete modules[moduleName]


init = ->
	csrfToken = $('input[name=csrfmiddlewaretoken]').val()
	$(document).ajaxSend((e, xhr, settings) ->
    	xhr.setRequestHeader('X-CSRFToken', csrfToken)
	)
	$.ajaxSetup(cache:false)
	app = new AppController()
	window.app = app
	app.initialize()

# Module Exports

window.Foundation =
	Modules: {}
	Model : Model
	Collection : Collection
	Router : Router
	View : View
	TemplateView: TemplateView
	ModelView : ModelView
	CollectionView : CollectionView
	FilteredCollectionView : FilteredCollectionView
	StaticView : StaticView
	ModuleMainView: ModuleMainView
	ModuleController: ModuleController
	init : init


