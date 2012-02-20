# Namespace

baseUrl = "/api/export/"

class Printout extends Foundation.Model

	@name: "printout"

	rootUrl: baseUrl + "printout/"

	defaults:
		title: "Export"
		body: ""
		footer: ""
		header: ""
		filename: "export.pdf"
		uuid: ""

	toString: ->
		@get("title")

	getUrl: ->
		"#{baseUrl}pdf/#{@.get('uuid')}/"

	openWindow: ->
		window.open(@getUrl(),"_new")

class PrintoutCollection extends Foundation.Collection

	model: Printout

	createAndShow: (attributes) ->
		@create(attributes,
			{
			success: (model, response) ->
				model.openWindow()
			}
		)


window.Printouts = {
	Printout: Printout
	PrintoutCollection: PrintoutCollection
	printouts: new PrintoutCollection()
}