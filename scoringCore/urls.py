from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^querySection/$', views.querySection, name='querySection'),

    url(r'^login/$', views.user_login, name='user_login'),
    url(r'^user/$', views.user_home, name='user_home'),
    url(r'^chapterList/$', views.chapterList, name='chapterList'),
    url(r'^taskList/$', views.taskList, name='taskList'),
    url(r'^$', views.welcome, name='welcome'),


]
