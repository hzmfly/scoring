from scoringCore import dbProcess
from scoringCore import constant
import logging

logger = logging.getLogger('django')

''' 获取老师授课的科目及班级列表
    输入： teacher：老师对象
    输出： 科目及班级列表的list：
            [
                {
                    'subjectCd':val
                    'subjectCd_DESC':desc
                    'banji':[
                                {
                                    'banji_DESC':desc,
                                    'school':val,
                                    'grade':val
                                    'classes':val
                                    'textbook':
                                        [
                                            'textbookId':val,
                                            'textbookName':val
                                        ]
                                },
                                ...

                            ]
                },
                ...
            ]

'''
def getTeacher_ClassesList(teacher):
    _result_list=[]
    _teacher_classesQuerySet = dbProcess.classesQueryByTeacher(teacher)
    if _teacher_classesQuerySet is None:
        logger.error(teacher.name + ' have no classes')
        return None

    _subjectCdList=distinct(_teacher_classesQuerySet,"subjectCd")
    print(_subjectCdList)
    i = 0
    for item in _subjectCdList:
        _result_list.append({
            'subjectCd':item.subjectCd,
            'subjectCd_DESC':item.get_subjectCd_display(),
            'banji':[]
        })


        #选中科目后，按班级去重，school,grade,classes
        _banjiQuerySet = _teacher_classesQuerySet.filter(subjectCd=item.subjectCd)
        banjiList=[]
        for item2 in _banjiQuerySet:
            banji = str(item2.school)+'-'+str(item2.grade)+'-'+str(item2.classes)
            if banji not in banjiList:
                banjiList.append(banji)
        for banji in banjiList:
            arr =banji.split("-")
            _school = arr[0]
            _grade = arr[1]
            _classes = arr[2]
            #选中班级后，找出所有的教辅，教辅不应该重复，直接遍历取值
            _textbookQuerySet = _banjiQuerySet.filter(school=_school,grade=_grade,classes=_classes)
            textbookList=[]
            for item3 in _textbookQuerySet:
                textbookList.append({'textbookId': item3.textbook.id,
                                     'textbookName': item3.textbook.textbookName
                                     })
            _result_list[i]['banji'].append({
                                    'banji_DESC':str(constant.GRADE_NAME[int(_grade) - 1][1]) + str(
                                                 _classes) + "班",
                                    'school':_school,
                                    'grade': _grade,
                                    'classes': _classes,
                                    'textbook': textbookList
                                })
        i = i + 1


    print(_result_list)
    return _result_list


""" 获取教辅的所有章节及小节列表
    输入： _textbook 教辅编号，int
    输出： 章节编号及章节名称列表的List:
            [
                {
                    'id' : val,
                    'name' : val,
                    'sectionList':[
                                    'id' : val,
                                    'name' : val,
                                ]
                }
            ]
"""
def getTextbookChapterTree(_textbookId):
    _chapters = dbProcess.chapterQueryByTextbook(_textbookId)
    if _chapters is None:
        logger.error('there is no chapters queryed by textbook %s', _textbookId)
        return None
    else:
        _result_list = []

        cur_chapter=_chapters[0].chapter
        cur_chapterName=_chapters[0].chapterName
        sectionList=[]
        for item in _chapters:
            if item.chapter == cur_chapter:
                sectionList.append({
                    'id': item.section,
                    'name': item.sectionName
                })
            else:
                tmp = {
                    'id': cur_chapter,
                    'name': cur_chapterName,
                    'sectionList':sectionList
                }
                _result_list.append(tmp)
                cur_chapter = item.chapter
                cur_chapterName = item.chapterName
                sectionList = []

        return _result_list

""" 获取教辅的所有章节列表及章节名称
    输入： _textbook 教辅编号，int
    输出： 章节编号及章节名称列表的List:
            [
                {
                    'chapter' : val,
                    'chapterName' : val
                }
            ]

"""
def getTextbook_ChaptersList(_textbook):
    _chapters = dbProcess.chapterQueryByTextbook(_textbook)
    logger.info("get chapter list %s", str(_chapters))
    if _chapters is None:
        logger.error('there is no chapters queryed by textbook %d', _textbook)
        return None
    else:
        _chapterList = distinct(_chapters, 'chapter') #按chapter去重
        _result_list = []
        for item in _chapterList:
            tmp = {
                'chapter':item.chapter,
                'chapterName':item.chapterName,
            }
            _result_list.append(tmp)
        logger.info("get chapter list %s", str(_result_list))
        return _result_list

""" 获取教辅某一章的所有小节列表及小节名称
    输入： _textbook 教辅编号，int
          _chapter  章节编号，int
    输出： 小节编号及小节名称列表的List:
            [
                {
                    'section' : val,
                    'sectionName' : val
                }
            ]
"""

def getChapter_SectionsList(_textbook, _chapter):
    _sections = dbProcess.sectionQueryByTextbookAndChapter(_textbook, _chapter)
    if _sections is None:
        logger.error('there is no sections queryed by textbook %d chapter %d', _textbook,_chapter)
        return None
    else:
        _sectionList = distinct(_sections, 'section') #按chapter去重
        _result_list = []
        for item in _sectionList:
            tmp = {
                'section':item.section,
                'sectionName':item.sectionName,
            }
            _result_list.append(tmp)
        return _result_list


"""
    获取小节对应的题目信息列表
    输入： _textbook 教辅编号，int
          _chapter  章节编号，int
          _section  小节编号，Int
          _school,_grade,_classes 班级

    输出：
            题目信息列表：
            [
                {
                    'topicNum':val,
                    'topicType':val,
                    'question':val,
                    'answer':val,
                    'option':val,
                    'rate':val,
                    'submitNum':val
                }
            ]
"""
def getTopicStatisticsList(_textbook, _chapter, _section, _school, _grade, _classes,_order=0):
    if _order == '1':  #按正确率排，如果正确率都是-1,则按题号排序
        return getTopicListOrderByRate(_textbook, _chapter, _section, _school, _grade, _classes)
    else: #按题号排,默认方式
        return getTopicListOrderByTopic(_textbook, _chapter, _section, _school, _grade, _classes)

def getTopicListOrderByTopic(_textbook, _chapter, _section, _school, _grade, _classes):
    _result_list = []
    _topicList = dbProcess.topicQueryBySection(_textbook, _chapter, _section)
    if _topicList is None:
        logger.error('there is no topic queryed by textbook %d,chapter %d ,section %d', _textbook, _chapter, _section)
        return None
    else:
        _studentNum = getStudentNum(_school, _grade, _classes)
        for item in _topicList:
            _scoreRate = dbProcess.rateQueryByIdAndClasses(item.id, _school, _grade, _classes)
            tmp = {
                'topicNum': item.topicNum,
                'topicType': item.topicType,
                'question': item.question,
                'answer': item.answer,
                'option': item.option,
            }
            if _scoreRate is not None:
                tmp['rate']= str(_scoreRate.rate*100)+'%'
                tmp['submitNum']= str(_scoreRate.submitNum)+'/'+str(_studentNum)
            else:
                tmp['rate'] = -1
                tmp['submitNum'] = str(0)+'/'+str(_studentNum)
            _result_list.append(tmp)

        return _result_list


def getTopicListOrderByRate(_textbook, _chapter, _section, _school, _grade, _classes):
    _result_list = []
    _scoreRateList = dbProcess.rateQueryBySectionAndClasses(_textbook, _chapter, _section, _school, _grade,
                                                            _classes)
    if _scoreRateList is None:
        return getTopicListOrderByTopic(_textbook, _chapter, _section, _school, _grade, _classes)
    else:
        _studentNum = getStudentNum(_school, _grade, _classes)
        for item in _scoreRateList:
            _topic = dbProcess.topicQueryById(item.id)
            tmp = {
                'topicNum': _topic.topicNum,
                'topicType': _topic.topicType,
                'question': _topic.question,
                'answer': _topic.answer,
                'option': _topic.option,
                'rate' : str(item.rate*100)+'%',
                'submitNum' : str(item.submitNum)+'/'+str(_studentNum),
            }
            _result_list.append(tmp)
        logger.info(_result_list)
        return _result_list


"""
    获取章节名称
"""
def getSectionName(_textbook, _chapter, _section):
    _topicList = dbProcess.topicQueryBySection(_textbook, _chapter, _section)
    if _topicList is None:
        return '小节不存在！'
    else:
        return _topicList[0].sectionName

"""
    获取学生人数
"""
def getStudentNum(_school, _grade, _classes):
    _studentList =dbProcess.studentQueryByClasses(_school, _grade, _classes)
    if _studentList is None:
        return 0
    else:
        return len(_studentList)



""" 获取教辅某章节对应的答题纸编号
    输入： 教辅编号: textbook , 章节：chapter
    输出： 答题纸编号列表的list：[val,val...]

"""
def getChapter_CardsList(_textbook,_chapter):
    _cards = dbProcess.cardQueryByChapter(_textbook, _chapter)
    if _cards is None:
        return None
    else:
        return _cards


"""
"""
def getTopicCount(_textbook, _chapter, _section):
    _item = dbProcess.topicCountQuery(_textbook, _chapter, _section)
    if _item is None:
        return 0
    else:
        return _item.topicCount

"""
    根据传进来的唯一参数进行去重，由于使用sqlite不属于关系型数据库，django不支持distinct操作
"""
def distinct(obj, arg):
    cur = None
    _result = []
    for item in obj:
        tmp = eval("item."+arg)
        if(cur != tmp):
            _result.append(item)
            cur = tmp

    return _result








