# -*- coding: utf-8 -*-
from django.db import models
from django.contrib.auth.models import User
from foundation import fields

CARD_CATEGORY_CHOICES = (
	("BASC", "Basic"),
	("ADVN", "Advanced"),
)

CARD_TYPE_CHOICES = (
	("ACTN", "Primary"),
	("MOVE", "Movement"),
	("SPRT", "Support"),
	("REAC", "Reaction"),
)

CARD_PUBLISH_STATUS_CHOICES = (
	("SGST", "Suggestion"),
	("DRFT", "Draft"),
	("PUBL", "Published"),
)


class Card(models.Model):
	title = models.CharField(max_length=80, blank=True, null=True)
	category = models.CharField(max_length=4, choices=CARD_CATEGORY_CHOICES, default="BASC")
	body = models.TextField(blank=True, null=True)
	keywords = fields.JSONField(blank=True, null=True)
	type = models.CharField(max_length=4, choices=CARD_TYPE_CHOICES, default="ACTN")
	protected = models.BooleanField(default=False, blank=True)
	disrupts = models.BooleanField(default=False, blank=True)
	refresh = models.PositiveSmallIntegerField(default=0, blank=True)
	published_status = models.CharField(max_length=4, choices=CARD_PUBLISH_STATUS_CHOICES, default="DRFT")

	class Meta:
		ordering = ("title",)

	def __unicode__(self):
		return self.title		

class CardInDeck(models.Model):
	card = models.ForeignKey("Card", related_name="card_in_decks", db_index=True)
	deck = models.ForeignKey("Deck", related_name="cards_in_deck", db_index=True)
	order = models.IntegerField(blank=True, null=True)
	
	class Meta:
		ordering = ("order",)


class Deck(models.Model):
	title = models.CharField(max_length=80, blank=True, null=True)
	description = models.TextField(blank=True, null=True)
	user = models.ForeignKey(User, related_name="decks", db_index=True)
