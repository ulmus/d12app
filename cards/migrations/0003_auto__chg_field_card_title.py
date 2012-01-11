# encoding: utf-8
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models

class Migration(SchemaMigration):

    def forwards(self, orm):
        
        # Changing field 'Card.title'
        db.alter_column('cards_card', 'title', self.gf('django.db.models.fields.CharField')(max_length=80, null=True))


    def backwards(self, orm):
        
        # Changing field 'Card.title'
        db.alter_column('cards_card', 'title', self.gf('django.db.models.fields.CharField')(max_length=80))


    models = {
        'cards.card': {
            'Meta': {'ordering': "('title',)", 'object_name': 'Card'},
            'body': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'phase_1': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'phase_2': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'phase_3': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'title': ('django.db.models.fields.CharField', [], {'max_length': '80', 'null': 'True', 'blank': 'True'}),
            'type': ('django.db.models.fields.CharField', [], {'default': "'ACTN'", 'max_length': '4'})
        }
    }

    complete_apps = ['cards']
