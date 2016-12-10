#!/usr/bin/python
#coding: UTF-8

from scoringCore.models import Teacher
from scoringCore.models import Teacher_Classes
from scoringCore.models import Card
from scoringCore.models import Card_Topic
from scoringCore.models import Student
from scoringCore.models import Task
from django.core.exceptions import ObjectDoesNotExist
import logging

logger = logging.getLogger(__name__)

def insert2Teacher(_teacher):
    try:
        _teacher.save()
    except :
        return False

def insertTask(_task):
    try:
        _task.save()
    except:
        return False;

def insertScoreRate(_score_rate):
    try:
        _score_rate.save()
    except:
        return False

def teacherQueryByUsername(_user):
    try:
        _obj = Teacher.objects.get(username=_user)  # 查询单个对象
    except ObjectDoesNotExist:
        return None
    return _obj


def classesQueryByTeacher(_teacher):
    try:
        _obj = Teacher_Classes.objects.filter(teacher=_teacher).order_by("subjectCd") #查询多个对象
    except ObjectDoesNotExist:
        return None
    return _obj

def insertTeacher_Classes(param):
    try:
        _teacher = Teacher.objects.get(teacher=param['teacher'])
    except ObjectDoesNotExist:
        logger.debug('teacher id dose not exist when insert into Teacher_Clsses')
        return False
    #try:
    _obj = Teacher_Classes(_teacher, grade=param['grade'],
                               classes=param['classes'],school=param['school'],
                               subjectCd=param['subjectCd'],textbook=param['textbook'])
    _obj.save()
    #except

def chapterQueryByTextbook(_textbook):
    try:
        _chapterList = Card.objects.filter(textbook=_textbook).order_by("chapter")
    except ObjectDoesNotExist:
        logger.debug('there is no chapter queryed by textbook %d', _textbook)
        return None
    return _chapterList

def cardQueryByChapter(_textbook,_chapter):
    try:
        _cardsList = Card.objects.filter(textbook=_textbook,chapter=_chapter).order_by("id")
    except ObjectDoesNotExist:
        logger.debug('there is no cards queryed by textbook %d chapter %d', _textbook,_chapter)
        return None
    return _cardsList

def topicQueryByCard(_card):
    try:
        _topicList = Card.objects.filter(card=_card).order_by("topic")
    except ObjectDoesNotExist:
        logger.debug('there is no topic queryed by card %d ', _card)
        return None
    return _topicList

def studentsQueryByClasses(_grade,_classes):
    try:
        _result = Student.objects.filter(grade=_grade, classes=_classes).order_by("id")
    except ObjectDoesNotExist:
        logger.debug('there is no student queryed by grade %d,classes %d ', _grade,_classes)
        return None
    return _result

def studentsQueryById(_id):
    try:
        _result = Student.objects.filter(id=_id).order_by("id")
    except ObjectDoesNotExist:
        logger.debug('there is no student queryed by id %d ', _id)
        return None
    return _result

def topicQueryByCardAndTopic(_card, _topic):
    try:
        _result = Card_Topic.objects.filter(card=_card, topic=_topic)
    except ObjectDoesNotExist:
        logger.debug('there is no topic queryed by card %d, topic %d ', _card, _topic)
        return None
    return _result

def taskQueryByGradeAndClasses(_grade, _classes, _card, _topic):
    try:
        _result = Task.objects.filter(grade=_grade, classes=_classes, card=_card, topic=_topic).order_by("id")
    except ObjectDoesNotExist:
        logger.debug('there is no task queryed by grade %d,classes %d ,card %d,topic %d', _grade, _classes,_card,_topic)
        return None
    return _result

def scoreRateQueryByTopic(_topic):
    try:
        _result = ScoreRate.objects.filter(topic=_topic)
    except ObjectDoesNotExist:
        logger.debug('there is no scoreRate queryed by topic %d', _topic)
        return None
    return _result