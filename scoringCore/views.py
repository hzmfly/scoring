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

logger = logging.getLogger(__name__)
"""
 用户登录
"""
def user_login(request):

    _username = request.POST['username']
    _password = request.POST['password']
    _user = authenticate(username=_username, password=_password)
    if _user is not None and _user.is_active:
        logger.info(_user.teacher.name+"log in")
        login(request, _user)
        _list = service.getTeacher_ClassesList(_user.teacher)
        return render(request, 'teacher_personal.html', {'teacher': _user.teacher,'teacher_classes':_list})

    else:
        logger.error(_username+' log failed' )
        return render(request, 'login.html', {'errorDesc':'用户名或密码不正确！'})


def welcome(request):
    return render(request, 'login.html')

def showTaskList(request):
    _subjectCd = request.GET.get('s')
    _grade=request.GET.get('g')
    _classes = request.GET.get('c')
    _textbook = request.GET.get('t')
    _chaptersList = service.getTextbook_ChaptersList(_textbook)

    return render(request, 'taskList.html', {'chaptersList':_chaptersList,
                                             'banji_DESC':str(constant.GRADE_NAME[int(_grade)-1][1])+str(_classes)+"班",
                                             }
                  )


