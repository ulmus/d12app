from django.conf.urls.defaults import patterns, include, url
from views import printout_pdf_view, printout_html_view, header_view, footer_view, PrintoutInstanceView, PrintoutListView, printout_embed_view

urlpatterns = patterns('',
	url(r"printout/(?P<pk>[0-9]+)/$", view=PrintoutInstanceView.as_view()),
	url(r"printout/$", view=PrintoutListView.as_view()),

	url(r"pdf/(?P<uuid>[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/$", view=printout_pdf_view, name="export_pdf"),
	url(r"html/(?P<uuid>[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/$", view=printout_html_view, name="export_html"),
	url(r"embed/(?P<uuid>[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/$", view=printout_embed_view, name="export_embed"),

	url(r"header/$", view=header_view, name="header"),
	url(r"footer/$", view=footer_view, name="footer"),
)
