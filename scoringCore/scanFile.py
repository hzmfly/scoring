#!/usr/bin/python
#coding: UTF-8

import time
import os
import logging

logger = logging.getLogger(__name__)

def scan_dir(_thread_name, _dir, _delay):
	print "start scan dir: " + _dir
	time.sleep(_delay)
	_visit_files = []
	while True:
		_cur_files = os.listdir(_dir)
		for _file in _cur_files:
			_file = os.path.join(_dir, _file)
			if os.path.isfile(_file):
				if _file not in _visit_files and _file.find(".jpg") != -1:
					print "find file: " + _file
					_visit_files.append(_file)
					scan_one_card(_file)
		time.sleep(_delay)

def scan_one_card(_path):
	print "scan one card: " + _path  
	import dbProcess
	from scoringCore.models import Task
	_file = open(_path)
	(_student_no, _card_no, _scores) = get_card_info(_file)
	for _topic_no in xrange(0,len(_scores)):
		_student = dbProcess.studentsQueryById(_student_no)
		_card_topic = dbProcess.topicQueryByCardAndTopic(_card_no, _topic_no+1)
		_topic_id = _card_topic[0].id
		_topic = dbProcess.topicQueryById(_topic_id)
		_score = _scores[_topic_no]
		print "student id: " + str(_student_no) + ", card id: " + str(_card_no) + ", topic: " + str(_card_topic[0])
		if type(_score) != int:
			#print "score: " + str(_score) + ", answer: " + str(_topic[0].answer)
			if _score == _topic[0].answer:
				_score = _topic[0].point
			else:
				_score = 0
		print "true score: " + str(_score)
		_task_obj = Task(student_id=_student[0].id, topic_id=_topic[0].id,
			answer=_topic[0].answer, score=_score, textbook_id=_topic[0].textbook_id, 
			chapter=_topic[0].chapter, section=_topic[0].section,
			grade=_student[0].grade, classes=_student[0].classes, school=_student[0].school)
		
		dbProcess.insertTask(_task_obj)

		_score_rate = dbProcess.scoreRateQueryByTopic(_topic[0].id)
		#print "score rate: " + str(_score_rate[0])
		cur_num = _score_rate[0].submitNum
		cur_rate = _score_rate[0].rate
		_total_score = cur_num * cur_rate * _topic[0].point
		print "current num: " + str(cur_num) + ", cur rate: " + str(cur_rate) + ", total score: " + str(_total_score)
		_score_rate[0].submitNum = cur_num + 1
		print "update num: " + str(_score_rate[0].submitNum)
		_score_rate[0].rate = (_total_score + _score) / (cur_num + 1)
		print "update score rate: " + str(_score_rate[0].rate)
		# dbProcess.insertScoreRate(_score_rate)

		
def get_card_info(_file):
	_student_no = 2
	_card_no = 1
	_scores = ["A", "B", "A", 10, 10]
	return (_student_no, _card_no, _scores)


