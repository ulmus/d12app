# -*- coding: utf-8 -*-
from django.core.serializers.json import DjangoJSONEncoder
from django.db import models
from django import forms
from django.utils import simplejson as json
from south.modelsinspector import add_introspection_rules

class JSONWidget(forms.Textarea):

	def render(self, name, value, attrs=None):
		if not isinstance(value, basestring):
			value = json.dumps(value, indent=2)
		return super(JSONWidget, self).render(name, value, attrs)

class JSONFormField(forms.CharField):

	def __init__(self, *args, **kwargs):
		kwargs['widget'] = JSONWidget
		super(JSONFormField, self).__init__(*args, **kwargs)

	def clean(self, value):
		return value

class JSONField(models.TextField):
	__metaclass__ = models.SubfieldBase

	def formfield(self, **kwargs):
		return super(JSONField, self).formfield(form_class=JSONFormField, **kwargs)

	def to_python(self, value):
		"""Convert our string value to JSON after we load it from the DB"""
		if value == "":
			return None
		try:
			if isinstance(value, basestring) and not value == "":
				return json.loads(value)
		except ValueError:
			pass

		return value

	def get_prep_value(self, value):
		"""Convert our JSON object to a string before we save"""
		if value == "":
			return None
		if isinstance(value, dict) or isinstance(value, dict):
			value = json.dumps(value, cls=DjangoJSONEncoder)
		value = super(JSONField, self).get_prep_value(value)
		return value


	def value_to_string(self, obj):
		"""
		called by the serializer.
		"""
		value = self._get_val_from_obj(obj)
		return self.get_prep_value(value)

add_introspection_rules([], ["^cards\.fields\.JSONField",])
