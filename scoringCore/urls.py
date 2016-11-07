from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^user_login/$', views.user_login, name='user_login'),
    url(r'^showTaskList/$', views.showTaskList, name='showTaskList'),
    url(r'^$', views.welcome, name='welcome'),
]
