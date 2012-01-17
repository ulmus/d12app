# Namespace

window.Printouts = {}

baseUrl = "/api/export/"

class Printouts.Printout extends Foundation.Model

	@name: "printout"

	rootUrl: baseUrl + "printout/"

	defaults:
		title: "Export"
		body: ""
		footer: ""
		header: ""
		filename: "export.pdf"
		uuid: ""

	toString: =>
		@get("title")

class Printouts.PrintoutCollection extends Foundation.Collection

	model: Printouts.Printout



