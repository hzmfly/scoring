from scoringCore.models import Teacher
from scoringCore.models import Teacher_Classes
from scoringCore.models import Card
from scoringCore.models import Card_Topic
from scoringCore.models import Student
from scoringCore.models import Task
from scoringCore.models import Topic
from scoringCore.models import ScoreRate
from scoringCore.models import Textbook_Section
from django.core.exceptions import ObjectDoesNotExist
import logging

logger = logging.getLogger('django')

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

    _obj = Teacher_Classes.objects.filter(teacher=_teacher).order_by("subjectCd") #查询多个对象
    if (_obj.exists()):
        return _obj
    else:
        return None

def insertTeacher_Classes(param):
    try:
        _teacher = Teacher.objects.get(teacher=param['teacher'])
    except ObjectDoesNotExist:
        logger.error('teacher id dose not exist when insert into Teacher_Clsses')
        return False
    #try:
    _obj = Teacher_Classes(_teacher, grade=param['grade'],
                               classes=param['classes'],school=param['school'],
                               subjectCd=param['subjectCd'],textbook=param['textbook'])
    _obj.save()
    #except




""" 按教辅查询章节列表"""
def chapterQueryByTextbook(_textbook):
    _obj = Textbook_Section.objects.filter(textbook=_textbook).order_by("chapter")
    if(_obj.exists()):
        return _obj
    else:
        logger.error('there is no chapter queryed by textbook %s', _textbook)
        return None

""" 按教辅和章节查询小节列表"""
def sectionQueryByTextbookAndChapter(_textbook, _chapter):

    _obj = Topic.objects.filter(textbook=_textbook, chapter=_chapter).order_by("section")
    if (_obj.exists()):
        return _obj
    else:
        logger.error('there is no section queryed by textbook %s chapter %s ', _textbook, _chapter)
        return None

"""
"""

def topicCountQuery(_textbook,_chapter,_section):
    try:
        _obj = Textbook_Section.objects.get(textbook=_textbook, chapter=_chapter, section=_section)
    except ObjectDoesNotExist:
        logger.error('there is no item queryed by textbook %s,chapter %s ,section %s', _textbook, _chapter, _section)
        return None
    return _obj

def topicQueryById(_id):
    try:
        _result = Topic.objects.filter(id=_id)
    except ObjectDoesNotExist:
        logger.debug('there is no topic queryed by id %d ', _id)
        return None
    return _result

""" 按小节查询题目，按题号排序"""
def topicQueryBySection(_textbook,_chapter,_section):
    _obj = Topic.objects.filter(textbook=_textbook, chapter=_chapter, section=_section).order_by("topicNum")
    if (_obj.exists()):
        return _obj
    else:
        logger.error('there is no topic queryed by textbook %s,chapter %s ,section %s', _textbook, _chapter, _section)
        return None


""" 获取某班 某题的得分率，记录唯一或不存在"""
def rateQueryByIdAndClasses(_topicId, _school, _grade, _classes):
    try:
        _result = ScoreRate.objects.get(topic=_topicId, school=_school, grade=_grade, classes=_classes)
    except ObjectDoesNotExist:
        logger.info('there is no rate queryed by topic %s,school %s,grade %s ,classes %s', _topicId, _school, _grade, _classes)
        return None
    return _result

""" 按班级和小节查询得分率，按得分率降序排序"""
def rateQueryBySectionAndClasses(_textbook, _chapter, _section, _school, _grade, _classes):
    _obj = ScoreRate.objects.filter(textbook=_textbook, chapter=_chapter, section=_section, school=_school, grade=_grade, classes=_classes).order_by("-rate")
    if (_obj.exists()):
        return _obj
    else:
        return None


""" 按题号查题目"""
def topicGetById(_topicId):
    try:
        _result = Topic.objects.get(id=_topicId)
    except ObjectDoesNotExist:
        logger.error('there is no topic queryed by topic id %s', _topicId)
        return None
    return _result

""" 按班级查询学生列表"""
def studentQueryByClasses(_school, _grade, _classes):
    _obj = Student.objects.filter( school=_school, grade=_grade, classes=_classes)
    if (_obj.exists()):
        return _obj
    else:
        logger.error('there is no student queryed by grade %s,classes %s ', _grade, _classes)
        return None

#add by jiangjiawei
def studentsQueryById(_id):
    try:
        _result = Student.objects.filter(id=_id).order_by("id")
    except ObjectDoesNotExist:
        logger.debug('there is no student queryed by id %d ', _id)
        return None
    return _result

def topicQueryByCardAndTopic(_card, _topic):
    try:
        _result = Card_Topic.objects.filter(card_id=_card, topic_id=_topic)
    except ObjectDoesNotExist:
        logger.debug('there is no topic queryed by card %d, topic %d ', _card, _topic)
        return None
    return _result

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

def updateScoreRate(id, submitNum, rate):
    try:
        ScoreRate.objects.filter(id=id).update(submitNum = submitNum)
        ScoreRate.objects.filter(id=id).update(rate = rate)
    except:
        return False

def scoreRateQueryByTopic(_topic):
    try:
        _result = ScoreRate.objects.filter(topic=_topic)
    except ObjectDoesNotExist:
        logger.debug('there is no scoreRate queryed by topic %d', _topic)
        return None
    return _result