# -*- coding: utf-8 -*-

# Django imports
from djangorestframework.authentication import UserLoggedInAuthentication
from djangorestframework.mixins import AuthMixin
from djangorestframework.views import InstanceModelView
from django.views.generic import TemplateView

# App imports
from foundation.views import QueryListOrCreateView
import resources

class GameListView(QueryListOrCreateView):
	authentication = (UserLoggedInAuthentication, )
	query_params = ("owner",)
	resource = resources.GameResource

class GameInstanceView(InstanceModelView):
	authentication = (UserLoggedInAuthentication, )
	resource = resources.GameResource

class GameArticleListView(QueryListOrCreateView):
	authentication = (UserLoggedInAuthentication, )
	query_params = ("author", "game")
	resource = resources.GameArticleResource

class GameArticleInstanceView(InstanceModelView):
	authentication = (UserLoggedInAuthentication, )
	resource = resources.GameArticleResource
