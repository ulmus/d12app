# -*- coding: utf-8 -*-

# Django imports
from djangorestframework.authentication import UserLoggedInAuthentication
from djangorestframework.mixins import AuthMixin
from djangorestframework.views import InstanceModelView
from django.views.generic import TemplateView

# App imports
from cards.resources import CardResource, CardInDeckResource, DeckResource
from foundation.views import QueryListOrCreateView


class CardListView(QueryListOrCreateView):
	authentication = (UserLoggedInAuthentication, )
	query_params = ("decks",)
	resource = CardResource

class CardInstanceView(InstanceModelView):
	authentication = (UserLoggedInAuthentication, )
	resource = CardResource

class DeckListView(QueryListOrCreateView):
	authentication = (UserLoggedInAuthentication, )
	resource = DeckResource

class DeckInstanceView(InstanceModelView):
	authentication = (UserLoggedInAuthentication, )
	resource = DeckResource

class CardInDeckListView(QueryListOrCreateView):
	authentication = (UserLoggedInAuthentication, )
	query_params = ("card", "deck")
	resource = CardInDeckResource

class CardInDeckInstanceView(InstanceModelView):
	authentication = (UserLoggedInAuthentication, )
	resource = CardInDeckResource


class IndexView(TemplateView):
	template_name = "index.html"
