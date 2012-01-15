from djangorestframework.mixins import CreateModelMixin
from djangorestframework.views import ModelView
from mixins import QueryListModelMixin

__author__ = 'jens'

class QueryListOrCreateView(QueryListModelMixin, CreateModelMixin, ModelView):
	"""
	A view that lists models in a queryset. The queryset attribute can be a queryset
	or a function that takes request, *args and **kwargs from the dispatch and returns
	a queryset
	Filters may be provided in the dispatch args or, if defined in allowed_query_params,
	in the GET-query of the request
	"""
	_suffix = 'List'