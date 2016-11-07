from scoringCore import dbProcess
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
    if _chapters is None:
        return None
    else:
        _result_list = []
        currentChapter = -1
        for item in _chapters:
            if item.chapter != currentChapter:   #去重
                tmp = {
                    'chapter':item.chapter,
                    'chapterName':item.chapterName,
                }
                _result_list.append(tmp)
                currentChapter = item.chapter

        return _result_list



