from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^user_login/$', views.user_login, name='user_login'),
    url(r'^chapterList/$', views.chapterList, name='chapterList'),
    url(r'^taskList/$', views.taskList, name='taskList'),
    url(r'^$', views.welcome, name='welcome'),
]
