#!/usr/bin/python
#coding: UTF-8

import time
import os
import logging
import dbProcess

logger = logging.getLogger(__name__)

def scan_dir(_thread_name, _dir, _delay):
	_visit_files = []
	while True:
		_cur_files = os.listdir(_dir)
		for _file in _cur_files:
			_file = os.path.join(_dir, _file)
			if os.path.isfile(_file):
				print _file
				if _file in _visit_files:
					_visit_files.append(_file)
					scan_one_card(_file)
		time.sleep(_delay)

def scan_one_card(_path):
	_file = open(_path)
	(_student_no, _card_no, _scores) = get_card_info(_file)
	for _topic in xrange(0,len(_scores)):
		_student_info = dbProcess.studentsQueryById(_student_no)
		_topic_info = dbProcess.topicQueryByCardAndTopic(_card_no, _topic)
		
def get_card_info(_file):
	_student_no = 0001
	_card_no = 0001
	_scores = [5, 5, 0, 10, 0, 5]
	return (_student_no, _card_no, _scores)


