from django.conf.urls.defaults import patterns, include, url
from django.contrib.auth.decorators import login_required
from cards.views import IndexView

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    url(r'^$', login_required(IndexView.as_view()), name='index'),
    url(r'^api/cards/', include('cards.urls')),
	url(r'^api/export/', include('export.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),

	url(r'^login/$', 'django.contrib.auth.views.login', {'template_name': 'login.html'}),
	url(r'^logout/$', 'django.contrib.auth.views.logout', {'next_page': '/'})
)
