# -*- coding: utf-8 -*-
from django.contrib import admin
import models

__author__ = 'jens'

admin.site.register(models.Card)
admin.site.register(models.CardInDeck)
admin.site.register(models.Deck)