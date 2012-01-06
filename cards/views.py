# -*- coding: utf-8 -*-

# Django imports
from djangbone.views import BackboneAPIView
from django.views.generic import TemplateView
from django import forms

# App imports
from models import Card

class AddCardForm(forms.ModelForm):
	class Meta:
		model = Card

class EditCardForm(forms.ModelForm):
	class Meta:
		model = Card

class CardView(BackboneAPIView):
	base_queryset = Card.objects.all()
	add_form_class = AddCardForm
	edit_form_class = EditCardForm
	serialize_fields = ("id", "title", "description", "body", "type", "phase_1", "phase_2", "phase_3")

class IndexView(TemplateView):
	template_name = "index.html"
