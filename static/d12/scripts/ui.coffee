
# Imports

Foundation = window.Foundation


# Models and collections

class Button extends Foundation.Model

	defaults: ->
		label: "Press me"
		icon: ""
		onClick: $.noop
		onClickArgs: {}
		enabled: true,
		buttonClass: ""
		type: "button"
		menu: new ButtonCollection()


class ButtonCollection extends Foundation.Collection

	model: Button


# Views

class ModalView extends Foundation.TemplateView

	fade: true
	okOnAltReturn: false
	removeOnHide: false

	className: ->
		className = super() + " modal"
		if @fade
			className += " fade"
		className

	@template: Handlebars.compile('
		<div class="modal-header">
			<a class="close" data-dismiss="modal">&times;</a>
			<h3>{{header}}</h3>
		</div>
		<div class="modal-body" data-anchor="bodyView">
		</div>
		<div class="modal-footer" data-anchor="footerView">
		</div>
	')

	events: ->
		'keydown' :		'keydown'
		'keyup' :		'keyup'

	initialize: ->
		super()
		@fade = @options.fade
		@buttons = new ButtonCollection(@options.buttons ? @getButtons())
		@header = @options.header ? "Modal"
		@bodyView = @addChildView(@options.bodyView, anchor : "bodyView", placement:"inside")
		@footerView = @addChildView(new Foundation.CollectionView(
			collection : @buttons
			modelViewClass : ButtonView
		), anchor : "footerView")
		@okOnAltReturn = @options.okOnAltReturn ? @okOnAltReturn
		@removeOnHide = @options.removeOnHide ? @removeOnHide
		@on("modal:ok", @okModal, @)
		@on("modal:close", @closeModal, @)

	keydown: (event) ->
		switch event.which
			when 13
				if @altPressed and @okOnAltReturn
					@trigger("modal:ok")
			when 18
				@altPressed = true

	keyup: (event) ->
		switch event.which
			when 18
				@altPressed = false

	getButtons: ->
		[
			{
				label: "OK",
				buttonClass: "primary"
				onClick: =>
					@trigger("modal:ok")
			}
			{
				label: "Cancel",
				onClick: =>
					@trigger("modal:close")
			}
		]

	getContext: ->
		context = super()
		_.extend(context, header: @header)

	showModal: ->
		@$el.modal(
			backdrop: true,
			keyboard: true
		)

	okModal: ->
		@hideModal()

	closeModal: ->
		@hideModal()

	hideModal: ->
		@$el.modal("hide")
		if @removeOnHide
			@remove()


class ModalEditView extends ModalView

	okOnAltReturn: true

	initialize: ->
		@options.header = "Edit #{@model.constructor.name}"
		@formView = @options.bodyView = new Backbone.Form(
			model: @model
		)
		super()

	getButtons: ->
		buttons = [
			{
				label: "Save [alt+enter]",
				buttonClass: "btn-primary"
				onClick:(modal) =>
					@trigger("modal:ok")
			}
			{
				label: "Close",
				onClick: (modal) =>
					@trigger("modal:close")
			}
		]
		if @model.canDelete()
			buttons.push(
				{
					label: "Delete",
					buttonClass: "btn-danger btn-left"
					onClick: (modal) =>
						if confirm("Delete #{@model.constructor.name}?")
							@model.destroy()
						@trigger("modal:close")
				}
			)
		buttons

	okModal: ->
		errors = @formView.commit()
		if not errors
			@model.save()
			@hideModal()

	showModal: ->
		super()
		@bodyView.$el.find(":input").first().focus()


class ButtonView extends Foundation.ModelView

	@template: Handlebars.compile('<a href="#" title="{{attr.label}}" class="btn {{attr.buttonClass}} {{#unless attr.enabled}}disabled{{/unless}}">{{#if attr.icon}}<i class="icon-{{attr.icon}}"></i> {{/if}}{{attr.label}}</a>')
	@dropDownTemplate: Handlebars.compile('<div class="btn-group">
		<a href="#" title="{{attr.label}}" class="btn dropdown-toggle {{attr.buttonClass}} {{#unless attr.enabled}}disabled{{/unless}}">{{#if attr.icon}}<i class="icon-{{attr.icon}}"></i> {{/if}}{{attr.label}} <span class="caret"></span></a>
		<ul class="dropdown-menu">
		{{#each attr.menu.models}}
			<li><a href="#" title="{{this.attributes.label}}" data-menuitem-cid="{{this.cid}}" class="menu-item {{#unless this.attributes.enabled}}disabled{{/unless}}">{{#if this.attributes.icon}}<i class="icon-{{this.attributes.icon}}"></i> {{/if}}{{this.attributes.label}}</a>
		{{/each}}
		</ul>
		</div>')

	events: ->
		events = super()
		_.extend(events, "click a.btn" : "onClick", "click a.menu-item" : "onMenuClick")
		events

	render: ->
		switch @model.get("type")
			when "button"
				@template = @constructor.template
			when "dropdown"
				@template = @constructor.dropDownTemplate
		super()
		switch @model.get("type")
			when "dropdown"
				@$(".dropdown-toggle").dropdown()
		@

	onClick: (event) ->
		if @model.get("enabled")
			@model.get("onClick")(@model.get("onClickArgs"))
		event.preventDefault()

	onMenuClick: (event) ->
		if @model.get("enabled")
			cid = $(event.currentTarget).data("menuitemCid")
			menuItem = @model.get("menu").getByCid(cid)
			menuItem?.get("onClick")((menuItem.get("onClickArgs")))
		event.preventDefault()


class ToolbarView extends Foundation.CollectionView

	className: "btn-toolbar well"
	modelViewClass: ButtonView


class EditableModelView extends Foundation.ModelView

	showEditOnNew : true

	remove: ->
		@unbindModel(@model)
		super()
		@formModal?.remove()

	render: ->
		if not @formModal
			@formModal = new ModalEditView(
				model: @model
			)
			@formModal.render()
		super()
		if @model.canUpdate()
			@$el.addClass("clickable")

	showEdit: ->
		if @model.canUpdate()
			@formModal?.showModal()

	hideEdit: ->
		@formModal?.hideModal()

	afterAdd: ->
		if @showEditOnNew and @model.isNew()
			@showEdit()


editModel = (model) ->
	modal = new ModalEditView(
		model: model
		removeOnHide: true
	)
	modal.render()
	modal.showModal()

Foundation.UI = {
	Button : Button
	ButtonCollection : ButtonCollection
	ButtonView : ButtonView
	ToolbarView : ToolbarView
	ModalView : ModalView
	ModalEditView : ModalEditView
	editModel: editModel
	EditableModelView : EditableModelView
}