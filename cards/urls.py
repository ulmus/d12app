from django.contrib.auth.decorators import login_required
from django.conf.urls.defaults import patterns, include, url
import views

urlpatterns = patterns('',
    url(r'^card/$', login_required(views.CardView.as_view())),
	url(r'^card/(?P<id>\d+)$', login_required(views.CardView.as_view())),

	url(r'^deck/$', login_required(views.DeckView.as_view())),
	url(r'^deck/(?P<id>\d+)$', login_required(views.DeckView.as_view())),

	url(r'^cardindeck/$', login_required(views.CardInDeckView.as_view())),
	url(r'^cardindeck/(?P<id>\d+)$', login_required(views.CardInDeckView.as_view())),
)
