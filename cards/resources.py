from django import forms
from djangorestframework.resources import ModelResource
from cards import models

__author__ = 'jens'


class CardForm(forms.ModelForm):
	class Meta:
		model = models.Card

class CardResource(ModelResource):
	model = models.Card
	form = CardForm
	fields = (
		"id",
		"title",
		"category",
		"body",
		"type",
		"keywords",
		"protected"
	)


class DeckForm(forms.ModelForm):
	class Meta:
		model = models.Deck

class DeckResource(ModelResource):
	model = models.Deck
	form = DeckForm
	fields = (
		"id",
		"title",
		"description",
		"user_id"
	)
	rename = {
		"user_id" : "user"
	}


class CardInDeckForm(forms.ModelForm):
	class Meta:
		model = models.CardInDeck

class CardInDeckResource(ModelResource):
	model = models.CardInDeck
	form = CardInDeckForm
	fields = (
		"id",
		"deck_id",
		"card_id"
	)
	rename = {
		"deck_id": "deck",
		"card_id": "card"
	}
