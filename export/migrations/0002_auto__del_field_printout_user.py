# encoding: utf-8
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models

class Migration(SchemaMigration):

    def forwards(self, orm):
        
        # Deleting field 'Printout.user'
        db.delete_column('export_printout', 'user_id')


    def backwards(self, orm):
        
        # Adding field 'Printout.user'
        db.add_column('export_printout', 'user', self.gf('django.db.models.fields.related.ForeignKey')(default=1, to=orm['auth.User']), keep_default=False)


    models = {
        'export.printout': {
            'Meta': {'object_name': 'Printout'},
            'body': ('django.db.models.fields.TextField', [], {}),
            'filename': ('django.db.models.fields.CharField', [], {'default': "'export.pdf'", 'max_length': '200'}),
            'footer': ('django.db.models.fields.TextField', [], {'default': "''", 'null': 'True', 'blank': 'True'}),
            'header': ('django.db.models.fields.TextField', [], {'default': "''", 'null': 'True', 'blank': 'True'}),
            'html_head': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'timestamp': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'}),
            'title': ('django.db.models.fields.CharField', [], {'default': "'Export'", 'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'uuid': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '50', 'db_index': 'True'})
        }
    }

    complete_apps = ['export']
