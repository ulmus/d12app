from django.contrib.auth.decorators import login_required
from django.conf.urls.defaults import patterns, include, url
import views

urlpatterns = patterns('',
	url(r'^game/$', views.GameListView.as_view()),
	url(r'^game/(?P<id>\d+)$', views.GameInstanceView.as_view()),

	url(r'^gamearticle/$', views.GameArticleListView.as_view()),
	url(r'^gamearticle/(?P<id>\d+)$', views.GameArticleInstanceView.as_view()),
)
