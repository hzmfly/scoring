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
    _user = request.user
    _list = service.getTeacher_ClassesList(_user.teacher)
    return render(request, 'teacher_personal.html', {'teacher': _user.teacher,'teacher_classes':_list})


@login_required
def chapterList(request):
    logger.info("request for chapters")
    _school = request.GET.get('s')
    _grade=request.GET.get('g')
    _classes = request.GET.get('c')
    _textbook = request.GET.get('t')
    _chaptersList = service.getTextbook_ChaptersList(_textbook)

    return render(request, 'chapterList.html', {'chaptersList':_chaptersList,
                                                'textbook':_textbook,
                                             'banji_DESC':str(constant.GRADE_NAME[int(_grade)-1][1])+str(_classes)+"班",
                                            'school':_school,
                                             'grade':_grade,
                                                'classes':_classes
                                                }
                  )

@login_required
def taskList(request):

    _school = request.GET.get('s')
    _grade = request.GET.get('g')
    _classes = request.GET.get('c')
    _textbook = request.GET.get('t')
    _chapter = request.GET.get('ch')
    _section = request.GET.get('se')
    _order = request.GET.get('or')

    _topicList = service.getTopicStatisticsList(_textbook, _chapter, _section, _school, _grade, _classes,_order)
    _sectionName = service.getSectionName(_textbook, _chapter, _section)

    return render(request, 'taskList.html', {'topicList':_topicList,
                                             'banji_DESC': str(constant.GRADE_NAME[int(_grade) - 1][1]) + str(
                                                 _classes) + "班",
                                             'school':_school,
                                             'grade':_grade,
                                             'classes':_classes,
                                             'chapter':_chapter,
                                             'section':_section,
                                             'sectionName':_sectionName,
                                             'textbook': _textbook,

                                                }
                  )


def querySection(request):
    _textbook = request.GET.get('textbook')
    _chapter = request.GET.get('chapter')
    _sectionList =service.getChapter_SectionsList(_textbook, _chapter)
    return JsonResponse({'sectionList': _sectionList})