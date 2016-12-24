#!/usr/bin/python
#coding: UTF-8

import time
import os
import logging
import dbProcess
from scoringCore.models import Task

logger = logging.getLogger(__name__)

def scan_dir(_thread_name, _dir, _delay):
	_visit_files = []
	while True:
		_cur_files = os.listdir(_dir)
		for _file in _cur_files:
			_file = os.path.join(_dir, _file)
			if os.path.isfile(_file):
				print _file
				if _file in _visit_files and _file.find(".jpg") != -1:
					_visit_files.append(_file)
					scan_one_card(_file)
		time.sleep(_delay)

def scan_one_card(_path):
	_file = open(_path)
	(_student_no, _card_no, _scores) = get_card_info(_file)
	for _topic_no in xrange(0,len(_scores)):
		_student = dbProcess.studentsQueryById(_student_no)
		_topic = dbProcess.topicQueryByCardAndTopic(_card_no, _topic_no)
		_score = _scores(_topic_no)
		if type(_score) == int:
			if _score == _topic.answer:
				_score = _topic.point
			else:
				_score = 0
		_task_obj = Task(student=_student, topic=_topic,
			answer=_topic.answer, score=_score, textbook=_topic.textbook, 
			chapter=_topic.chapter, section=_topic.section,
			grade=_student.grade, classes=_student.classes, school=_student.school)
		dbProcess.insertTask(_task_obj)

		_score_rate = dbProcess.scoreRateQueryByTopic(_topic.id)
		_score_rate.submitNum = _score_rate.submitNum + 1
		_score_rate.rate = _score_rate.rate + _score
		dbProcess.insertScoreRate(_score_rate)

		
def get_card_info(_file):
	_student_no = 0001
	_card_no = 0001
	_scores = [5, 5, 0, 10, 0, 5]
	return (_student_no, _card_no, _scores)


