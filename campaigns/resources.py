from django import forms
from djangorestframework.resources import ModelResource
import models

__author__ = 'jens'


class GameResource(ModelResource):
	model = models.Game
	fields = (
		"id",
		"name",
		"description",
		"owner_id",
	)
	rename = {
		"owner_id" : "owner"
	}

class GameArticleResource(ModelResource):
	model = models.GameArticle
	fields = (
		"id",
		"title",
		"short",
		"body",
		"order",
		"author_id",
		"game_id"
	)
	rename = {
		"author_id" : "author",
		"game_id" : "game"
	}
