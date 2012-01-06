from django.contrib.auth.decorators import login_required
from django.conf.urls.defaults import patterns, include, url
from views import CardView

urlpatterns = patterns('',
    url(r'^card/$', login_required(CardView.as_view())),
	url(r'^card/(?P<id>\d+)$', login_required(CardView.as_view())),

)
