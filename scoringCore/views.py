from django.shortcuts import render, redirect
from django.http import HttpResponse
from scoringCore import service
from django.http import JsonResponse
from django.http import HttpResponseRedirect
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required, user_passes_test
from django.core.urlresolvers import reverse
from scoringCore import constant
import logging
import json
# Create your views here.

logger = logging.getLogger('django')

def welcome(request):
    return render(request, 'login.html')

"""
 用户登录
"""
def user_login(request):
    if request.method == "POST":
        _username = request.POST['username']
        _password = request.POST['password']
        _user = authenticate(username=_username, password=_password)
        if _user is not None and _user.is_active:
            logger.info(_user.teacher.name+"log in")
            login(request, _user)
            return HttpResponseRedirect('/user/')
        else:
            logger.error(_username+' log failed' )
            return render(request, 'login.html', {'errorDesc':'用户名或密码不正确！'})
    else:
        return render(request, 'login.html')

@login_required
def user_home(request):

    return render(request, 'teacher.html')





@login_required
def queryTask(request):

    _school = request.GET.get('s')
    _grade = request.GET.get('g')
    _classes = request.GET.get('c')
    _textbook = request.GET.get('t')
    _chapter = request.GET.get('ch')
    _section = request.GET.get('se')
    _order = request.GET.get('or')

    _topicList = service.getTopicStatisticsList(_textbook, _chapter, _section, _school, _grade, _classes,_order)
    _topicCount = service.getTopicCount(_textbook, _chapter, _section)
    return JsonResponse({'LIST1':_topicList,'topicCount':_topicCount})


def querySection(request):
    _textbook = request.GET.get('textbook')
    _chapter = request.GET.get('chapter')
    _sectionList =service.getChapter_SectionsList(_textbook, _chapter)
    return JsonResponse({'LIST1': _sectionList})

def queryTeacher(request):
    _user = request.user
    _list = service.getTeacher_ClassesList(_user.teacher)

    return JsonResponse({'LIST1': _list})

def queryChapterAndSection(request):
    _textbookId = request.GET.get('textbookId')
    _list = service.getTextbookChapterTree(_textbookId)

    return JsonResponse({'LIST1': _list})