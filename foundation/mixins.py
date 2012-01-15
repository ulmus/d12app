from djangorestframework.utils import as_tuple

__author__ = 'jens'

class QueryListModelMixin(object):
	"""
	Behavior to list a set of `model` instances on GET requests
	"""

	queryset = None
	query_params = []


	def get(self, request, *args, **kwargs):
		model = self.resource.model

		queryset = self.queryset if self.queryset is not None else model.objects.all()

		if hasattr(queryset, "__call__"):
			queryset = queryset(request, *args, **kwargs)

		for param in self.query_params:
			if request.GET.has_key(param):
				filter = {param:request.GET.get(param)}
				queryset = queryset.filter(**filter)

		if hasattr(self, 'resource'):
			ordering = getattr(self.resource, 'ordering', None)
		else:
			ordering = None

		if ordering:
			args = as_tuple(ordering)
			queryset = queryset.order_by(*args)
		return queryset.filter(**kwargs)

