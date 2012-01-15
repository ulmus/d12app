from django.contrib.auth.decorators import login_required
from django.conf.urls.defaults import patterns, include, url
import views

urlpatterns = patterns('',
    url(r'^card/$', views.CardListView.as_view()),
	url(r'^card/(?P<id>\d+)$', views.CardInstanceView.as_view()),

	url(r'^deck/$', views.DeckListView.as_view()),
	url(r'^deck/(?P<id>\d+)$', views.DeckInstanceView.as_view()),

	url(r'^cardindeck/$', views.CardInDeckListView.as_view()),
	url(r'^cardindeck/(?P<id>\d+)$', views.CardInDeckInstanceView.as_view()),
)
