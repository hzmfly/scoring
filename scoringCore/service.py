from scoringCore import dbProcess
from scoringCore import constant
import logging

logger = logging.getLogger(__name__)

''' 获取老师授课的科目及班级列表
    输入： teacher：老师对象
    输出： 科目及班级列表的list：
            [
                {
                    'subjectCd':val
                    'subjectCd_DESC':desc
                    'banji':[
                                {
                                    'banji_DESC':desc
                                    'grade':val
                                    'classes':val
                                    'textbook':val
                                },
                                ...

                            ]
                },
                ...
            ]

'''
def getTeacher_ClassesList(teacher):
    _teacher_classes = dbProcess.classesQueryByTeacher(teacher)
    _result_list = []
    if _teacher_classes is not None:
        i = 0
        subjectCd = _teacher_classes[0].subjectCd
        json = {
            'subjectCd': _teacher_classes[0].subjectCd,
            'subjectCd_DESC': _teacher_classes[0].get_subjectCd_display(),
            'banji': []
        }
        _result_list.append(json)
        for item in _teacher_classes:
            if item.subjectCd == subjectCd:
                _result_list[i]['banji'].append({
                    'banji_DESC':item.get_grade_display() + str(item.classes) + "班",
                    'grade': item.grade,
                    'classes': item.classes,
                    'textbook': item.textbook.id,
                })
            else:
                subjectCd = item.subjectCd
                json_tmp = {
                    'subjectCd': item.subjectCd,
                    'subjectCd_DESC': item.get_subjectCd_display(),
                    'banji': [{
                        'banji_DESC': item.get_grade_display() + str(item.classes) + "班",
                        'grade': item.grade,
                        'classes': item.classes,
                        'textbook': item.textbook.id,
                    }]
                }
                _result_list.append(json_tmp)
                i = i + 1


        return _result_list
    else:
        logger.error(teacher.name+' have no classes')
        return None

""" 获取教辅的所有章节列表及章节名称
    输入： _textbook 教辅编号，int
    输出： 章节编号及章节名称列表的List,捎带上每个章节对应的答题纸编号:
            [
                {
                    'chapter' : val,
                    'chapterName' : val
                    'cards':[val,val...]
                }
            ]

"""
def getTextbook_ChaptersList(_textbook):
    _chapters = dbProcess.chapterQueryByTextbook(_textbook)
    if _chapters is None:
        return None
    else:
        _result_list = []
        i=-1
        currentChapter = -1
        for item in _chapters:
            if item.chapter != currentChapter:   #去重
                tmp = {
                    'chapter':item.chapter,
                    'chapterName':item.chapterName,
                    'cards':[item.id],
                }
                _result_list.append(tmp)
                currentChapter = item.chapter
                i=i+1
            else:
                _result_list[i]['cards'].append(item.id)


        return _result_list

""" 获取教辅某章节对应的答题纸编号
    输入： 教辅编号: textbook , 章节：chapter
    输出： 答题纸编号列表的list：[val,val...]

"""
def getChapter_CardsList(_textbook,_chapter):
    _cards = dbProcess.cardQueryByChapter(_textbook, _chapter)
    if _cards is None:
        return None
    else :
        return _cards


""" 获取答题纸对应的题目及学生完成情况
    输入：答题纸列表：cardsList
    输出：题目列表及完成情况List:
        [
            {
                'topicInfo':object 题目信息
                'performance':{
                                'finished':val
                                'average':val
                            }
            }
        ]
"""

def getTopic_PerformanceList(_cards, _grade, _classes):
    #查找学生信息
    _studentList = dbProcess.studentsQueryByClasses(_grade, _classes)
    if _studentList is None:
        logger.error("Error: there is no student exist in class: %d,%d! ",_grade,_classes)
        return None
    _studentNum = len(_studentList)
    _result_list = []
    for cardId in _cards:     #所有答题纸
        _topic = dbProcess.topicQueryByCard(cardId)  #某答题纸查出的题目
        if _topic is not None:
            for item in _topic:   #每个题目
                item.topic
                _result_list.append({
                    'topicInfo':item
                })


    return _result_list

def calculateScoringRateByClasses(_grade, _classes, _cardId, _topic):
    _studentList = dbProcess.studentsQueryByClasses(_grade, _classes)
    if _studentList is None:
        logger.error("Error: there is no student exist in class: %d,%d ",_grade,_classes)
        return -1
    _studentNum = len(_studentList)
    _topicInfo = dbProcess.topicQueryByCardAndTopic(_cardId, _topic)
    if _topicInfo is None:
        logger.error("Error: there is no topic exist : %d,%d ", _cardId, _topic)
        return -1
    _point = _topicInfo[1].point
    _taskList = dbProcess.taskQueryByGradeAndClasses(_grade,_classes,_cardId,_topic)
    if _taskList is None:
        logger.info("info: there is no task exist : %d,%d ", _cardId, _topic)
        return -1
    _submitStudentNum = len(_taskList)
    _totalpoints = 0
    for item in _taskList:
        _totalpoints = _totalpoints+item.score
    _scoringRate = _totalpoints/(_submitStudentNum*_point)
    return _scoringRate










