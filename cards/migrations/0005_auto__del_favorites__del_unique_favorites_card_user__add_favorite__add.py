# encoding: utf-8
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models

class Migration(SchemaMigration):

    def forwards(self, orm):
        
        # Removing unique constraint on 'Favorites', fields ['card', 'user']
        db.delete_unique('cards_favorites', ['card_id', 'user_id'])

        # Deleting model 'Favorites'
        db.delete_table('cards_favorites')

        # Adding model 'Favorite'
        db.create_table('cards_favorite', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('card', self.gf('django.db.models.fields.related.ForeignKey')(related_name='favorited', to=orm['cards.Card'])),
            ('user', self.gf('django.db.models.fields.related.ForeignKey')(related_name='favorites', to=orm['auth.User'])),
            ('favorite', self.gf('django.db.models.fields.BooleanField')(default=False)),
        ))
        db.send_create_signal('cards', ['Favorite'])

        # Adding unique constraint on 'Favorite', fields ['card', 'user']
        db.create_unique('cards_favorite', ['card_id', 'user_id'])


    def backwards(self, orm):
        
        # Removing unique constraint on 'Favorite', fields ['card', 'user']
        db.delete_unique('cards_favorite', ['card_id', 'user_id'])

        # Adding model 'Favorites'
        db.create_table('cards_favorites', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('card', self.gf('django.db.models.fields.related.ForeignKey')(related_name='favorited', to=orm['cards.Card'])),
            ('user', self.gf('django.db.models.fields.related.ForeignKey')(related_name='favorites', to=orm['auth.User'])),
        ))
        db.send_create_signal('cards', ['Favorites'])

        # Adding unique constraint on 'Favorites', fields ['card', 'user']
        db.create_unique('cards_favorites', ['card_id', 'user_id'])

        # Deleting model 'Favorite'
        db.delete_table('cards_favorite')


    models = {
        'auth.group': {
            'Meta': {'object_name': 'Group'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '80'}),
            'permissions': ('django.db.models.fields.related.ManyToManyField', [], {'to': "orm['auth.Permission']", 'symmetrical': 'False', 'blank': 'True'})
        },
        'auth.permission': {
            'Meta': {'ordering': "('content_type__app_label', 'content_type__model', 'codename')", 'unique_together': "(('content_type', 'codename'),)", 'object_name': 'Permission'},
            'codename': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'content_type': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['contenttypes.ContentType']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        },
        'auth.user': {
            'Meta': {'object_name': 'User'},
            'date_joined': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'email': ('django.db.models.fields.EmailField', [], {'max_length': '75', 'blank': 'True'}),
            'first_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'groups': ('django.db.models.fields.related.ManyToManyField', [], {'to': "orm['auth.Group']", 'symmetrical': 'False', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_active': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'is_staff': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'is_superuser': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'last_login': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'last_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'password': ('django.db.models.fields.CharField', [], {'max_length': '128'}),
            'user_permissions': ('django.db.models.fields.related.ManyToManyField', [], {'to': "orm['auth.Permission']", 'symmetrical': 'False', 'blank': 'True'}),
            'username': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '30'})
        },
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
        },
        'cards.favorite': {
            'Meta': {'unique_together': "(('card', 'user'),)", 'object_name': 'Favorite'},
            'card': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'favorited'", 'to': "orm['cards.Card']"}),
            'favorite': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'user': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'favorites'", 'to': "orm['auth.User']"})
        },
        'contenttypes.contenttype': {
            'Meta': {'ordering': "('name',)", 'unique_together': "(('app_label', 'model'),)", 'object_name': 'ContentType', 'db_table': "'django_content_type'"},
            'app_label': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'model': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        }
    }

    complete_apps = ['cards']
