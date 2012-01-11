# -*- coding: utf-8 -*-

# Django imports
from djangbone.views import BackboneAPIView
from django.views.generic import TemplateView
from django import forms

# App imports
import models

class AddCardForm(forms.ModelForm):
	class Meta:
		model = models.Card

class EditCardForm(forms.ModelForm):
	class Meta:
		model = models.Card

class CardView(BackboneAPIView):
	base_queryset = models.Card.objects.all()
	add_form_class = AddCardForm
	edit_form_class = EditCardForm
	serialize_fields = ("id", "title", "description", "body", "type", "phase_1", "phase_2", "phase_3")

	def get_collection(self, request, *args, **kwargs):
		deck = request.GET.get("deck")
		if deck:
			self.base_queryset = self.base_queryset.filter(card_in_decks__deck_id = deck)
		return super(CardView, self).get_collection(request, *args, **kwargs)


class AddDeckForm(forms.ModelForm):
	class Meta:
		model = models.Deck

class EditDeckForm(forms.ModelForm):
	class Meta:
		model = models.Deck

class DeckView(BackboneAPIView):
	base_queryset = models.Deck.objects.all()
	add_form_class = AddDeckForm
	edit_form_class = EditDeckForm
	serialize_fields = ("id", "title", "description", "user")

	def get_collection(self, request, *args, **kwargs):
		user = request.GET.get("user", None)
		if user is not None:
			self.base_queryset = self.base_queryset.filter(user_id = user)
		return super(DeckView, self).get_collection(request, *args, **kwargs)


class AddCardInDeckForm(forms.ModelForm):
	class Meta:
		model = models.CardInDeck

class EditCardInDeckForm(forms.ModelForm):
	class Meta:
		model = models.CardInDeck

class CardInDeckView(BackboneAPIView):
	base_queryset = models.CardInDeck.objects.all()
	add_form_class = AddCardInDeckForm
	edit_form_class = EditCardInDeckForm
	serialize_fields = ("id", "card", "deck")

	def get_collection(self, request, *args, **kwargs):
		card = request.GET.get("card", None)
		deck = request.GET.get("deck", None)
		if card is not None:
			self.base_queryset = self.base_queryset.filter(card = card)
		if deck is not None:
			self.base_queryset = self.base_queryset.filter(deck = deck)
		return super(DeckView, self).get_collection(request, *args, **kwargs)


class IndexView(TemplateView):
	template_name = "index.html"
