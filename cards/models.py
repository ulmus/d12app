# -*- coding: utf-8 -*-
from django.db import models
import fields

CARD_TYPE_CHOICES = (
	("ACTN", "Action"),
	("MOVE", "Move"),
	("SPRT", "Support"),
	("REAC", "Reaction"),
)

class Card(models.Model):
	title = models.CharField(max_length=80, blank=True, null=True)
	description = models.TextField(blank=True, null=True)
	body = models.TextField(blank=True, null=True)
	type = models.CharField(max_length=4, choices=CARD_TYPE_CHOICES, default="ACTN")
	phase_1 = models.BooleanField(default=False)
	phase_2 = models.BooleanField(default=False)
	phase_3 = models.BooleanField(default=False)

	class Meta:
		ordering = ("title",)

	def __unicode__(self):
		return self.title