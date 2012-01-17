from djangorestframework.resources import ModelResource
from models import Printout


__author__ = 'jens'


class PrintoutResource(ModelResource):
	model = Printout
	fields = (
		"id",
	    "uuid",
	    "body",
	    "header",
	    "footer",
	    "title",
	    "filename",
	)