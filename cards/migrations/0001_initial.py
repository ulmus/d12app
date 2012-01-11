# encoding: utf-8
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models

class Migration(SchemaMigration):

    def forwards(self, orm):
        
        # Adding model 'Card'
        db.create_table('cards_card', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('title', self.gf('django.db.models.fields.CharField')(default='', max_length=80)),
            ('description', self.gf('django.db.models.fields.TextField')(null=True, blank=True)),
            ('body', self.gf('cards.fields.JSONField')(null=True, blank=True)),
            ('type', self.gf('django.db.models.fields.CharField')(default='ACTN', max_length=4)),
            ('phase_1', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('phase_2', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('phase_3', self.gf('django.db.models.fields.BooleanField')(default=False)),
        ))
        db.send_create_signal('cards', ['Card'])


    def backwards(self, orm):
        
        # Deleting model 'Card'
        db.delete_table('cards_card')


    models = {
        'cards.card': {
            'Meta': {'ordering': "('title',)", 'object_name': 'Card'},
            'body': ('cards.fields.JSONField', [], {'null': 'True', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'phase_1': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'phase_2': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'phase_3': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'title': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '80'}),
            'type': ('django.db.models.fields.CharField', [], {'default': "'ACTN'", 'max_length': '4'})
        }
    }

    complete_apps = ['cards']
