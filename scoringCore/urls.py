from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^querySection/$', views.querySection, name='querySection'),
    url(r'^queryTeacher/$', views.queryTeacher, name='queryTeacher'),
    url(r'^queryChapterAndSection/$', views.queryChapterAndSection, name='queryChapterAndSection'),
    url(r'^queryTask/$', views.queryTask, name='queryTask'),


    url(r'^login/$', views.user_login, name='user_login'),
    url(r'^user/$', views.user_home, name='user_home'),
    url(r'^$', views.welcome, name='welcome'),


]
