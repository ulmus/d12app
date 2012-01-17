from logging import log
import subprocess
import uuid
from django.conf import settings
from django.contrib.auth.models import User
from django.core.cache import cache
from django.db import models
from django.template.loader import render_to_string
import sys

__author__ = 'jens'

class PDFExportError(Exception):
	error_code = None

	def __init__(self, error_code, *args, **kwargs):
		self.error_code = error_code
		super(Exception,self).__init__(*args, **kwargs)

	def __unicode__(self):
		return u"PDF Export fail, error: %s" %  self.error_code

class Printout(models.Model):
	uuid = models.CharField(max_length=50, unique=True, db_index=True, blank=True)
	timestamp = models.DateTimeField(auto_now=True)
	body = models.TextField()
	html_head = models.TextField(blank=True, null=True)
	header = models.TextField(default="", blank=True, null=True)
	footer = models.TextField(default="", blank=True, null=True)
	title = models.CharField(max_length=200, default="Export", blank=True, null=True)
	filename = models.CharField(max_length=200, default="export.pdf")

	def save(self, *args, **kwargs):
		if not self.uuid:
			self.uuid = unicode(uuid.uuid4())
		super(Printout, self).save(*args, **kwargs)

	def __unicode__(self):
		return u"%s (%s)" %(self.title, self.user)

	def get_body_html(self, path = settings.BASE_PATH + "/static"):
		body = render_to_string("pdf_export.html", {
			"title": self.title,
			"html": self.body,
			"html_head": self.html_head,
			"path": path
		})
		return body

	def get_header_html(self):
		return self.header

	def get_footer_html(self):
		return self.footer

	def get_pdf(self):
		pdf = cache.get("printout-pdf-"+self.uuid)
		if pdf:
			return pdf
		server = "http://localhost/api/export"
		command = settings.BASE_PATH + "/export/lib/%s/wkhtmltopdf" % sys.platform

		args = [
			{
				"arg": "--page-size",
				"val": "A4"
			},
			{
				"arg": "--orientation",
				"val": "Landscape"
			},
			{
				"arg": "--margin-top",
				"val": "15"
			},
			{
				"arg": "--margin-bottom",
				"val": "15"
			},
		]

		if self.footer:
			args.append({
				"arg": "--footer-html",
				"val": u'"%s/footer/"' % server
			})
			args.append({
				"arg": "--footer-spacing",
				"val": "0"
			})

		if self.header:
			args.append({
				"arg": "--header-html",
				"val": u'"%s/header/"' % server
			})
			args.append({
				"arg": "--header-spacing",
				"val": "10"
			})

		arg_string = ""
		for arg in args:
			arg_string += " %s %s" %(arg["arg"], arg["val"])

		command_args = '%s%s - -' % (command, arg_string)

		# print command_args
		try:
			p = subprocess.Popen(command_args,
								 shell=True,
								 bufsize= 4096,
								 close_fds=True,
								 cwd=settings.BASE_PATH + "/static",
								 stdout=subprocess.PIPE,
								 stdin=subprocess.PIPE,
								 stderr=subprocess.PIPE)
			pdf_content, err = p.communicate(self.get_body_html(path=settings.BASE_PATH + "/static").encode("utf-8"))
			print err
			retcode = p.returncode

			if not retcode:
				cache.set("printout-pdf-"+self.uuid, pdf_content, 120)
				return pdf_content
			else:
				raise PDFExportError(err)
		except OSError, exc:
			log(0,OSError)
			raise

	def get_html(self):
		return self.get_body_html(path= settings.BASE_PATH + "/static")

	def can_create(self, user):
		return True

	def can_delete(self, user):
		return user == self.user

	def can_read(self, user):
		return user == self.user

	def can_update(self, user):
		return user == self.user