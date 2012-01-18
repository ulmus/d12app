# -*- coding: utf-8 -*-
from django.db import models
from django.contrib.auth.models import User
from foundation import fields

class Article(models.Model):
	title = models.CharField(max_length=100, blank=True, null=True)
	short = models.CharField(max_length=300, blank=True, null=True)
	changed_date = models.DateTimeField(auto_now=True, blank=True)
	created_date = models.DateTimeField(auto_now_add=True, blank=True)
	body = models.TextField(blank=True, null=True)
	order = models.PositiveIntegerField(blank=True, null=True)
	author = models.ForeignKey(User)

	class Meta:
		abstract = True


class Game(models.Model):
	name = models.CharField(max_length=100, blank=True, null=True)
	description = models.TextField(blank=True, null=True)
	owner = models.ForeignKey(User)

class GameArticle(Article):
	game = models.CharField

	class Meta:
		ordering = ("game", "order", "title")


class Character(models.Model):
	name = models.CharField(max_length=100, blank=True, null=True)
	description = models.TextField(blank=True, null=True)
	player = models.ForeignKey(User)
	campaign = models.ForeignKey("Campaign")