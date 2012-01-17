# django imports
from django.contrib.auth.decorators import login_required
from django.core.cache import cache
from django.shortcuts import render,  get_object_or_404
from django.template.defaultfilters import slugify
from django.http import HttpResponse

# app imports
from django.template.loader import render_to_string
import zlib
from djangorestframework.views import InstanceModelView, ListOrCreateModelView
from models import Printout
from resources import PrintoutResource

@login_required
def printout_pdf_view(request, uuid):
	printout = get_object_or_404(Printout, uuid=uuid)

	pdf = printout.get_pdf()
	response = HttpResponse(pdf, mimetype='application/pdf')
	response['Content-Disposition'] = 'filename=%s.pdf' % slugify(printout.filename)
	return response

@login_required()
def printout_embed_view(request, uuid):
	return render(request, "embed.html", {
		"uuid": uuid
	})

@login_required
def printout_html_view(request, uuid):
	printout = get_object_or_404(Printout, uuid=uuid)

	return HttpResponse(printout.get_html())

def header_view(request):
	section = request.GET.get("section", "")
	cache_key = u"print-header-%s" % zlib.adler32(section.encode("utf-8"))
	cache_content = cache.get(cache_key)
	if cache_content:
		return HttpResponse(cache_content)
	cache_content = render_to_string("head.html", {
			"title": section,
		})
	cache.set(cache_key, cache_content)
	return HttpResponse(cache_content)

def footer_view(request):
	page = request.GET.get("page", "##")
	topage = request.GET.get("topage", "##")
	cache_key_string = u"%s,%s" %(page, topage)
	cache_key = u"print.footer-%s" % zlib.adler32(cache_key_string.encode("utf-8"))
	cache_content = cache.get(cache_key)
	if cache_content:
		return HttpResponse(cache_content)
	cache_content = render_to_string("footer.html", {
			"page": page,
			"topage": topage,
		})
	cache.set(cache_key, cache_content, 90)
	return HttpResponse(cache_content)

class PrintoutInstanceView(InstanceModelView):
	resource = PrintoutResource

class PrintoutListView(ListOrCreateModelView):
	resource = PrintoutResource
