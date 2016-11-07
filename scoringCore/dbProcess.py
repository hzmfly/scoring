from scoringCore.models import Teacher
from scoringCore.models import Teacher_Classes
from scoringCore.models import Card
from scoringCore.models import Card_Topic
from django.core.exceptions import ObjectDoesNotExist
import logging

logger = logging.getLogger(__name__)

def insert2Teacher(_teacher):
    try:
        _teacher.save()
    except :
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
        _teacher = Teacher.objects.get(teacherId=param['teacher'])
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
