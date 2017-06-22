#!/usr/bin/python
#coding: UTF-8

import time
import os
import logging
import threading
import numpy as np
from AnswerSheetRecognition import *

logger = logging.getLogger(__name__)
visit_files = []
lock = threading.Lock()

class ScanFileThread(threading.Thread):

	def __init__(self, thread_name, dir, delay):
		threading.Thread.__init__(self)
		self._thread_name = thread_name
		self._dir = dir
		self._delay = delay

	def run(self):
		print("start scan dir: " + self._dir)
		time.sleep(self._delay)
		global visit_files
		global lock
		lock.acquire()
		flag = True 
		while flag:
			_cur_files = os.listdir(self._dir)
			print(_cur_files)
			for _file in _cur_files:
				_file = os.path.join(self._dir, _file)
				if os.path.isfile(_file):
					if _file not in visit_files and _file.find(".jpg") != -1:
						print("find file: " + _file)
						visit_files.append(_file)
						self.scan_one_card(_file)
						time.sleep(self._delay)
			flag = False

	def scan_one_card(self, _path):
		print("scan one card: " + _path)
		from scoringCore import dbProcess
		from scoringCore.models import Task
		_file = open(_path)
		(_student_no, _card_no, _scores) = self.get_card_info(_file)
		for _topic_no in range(0,len(_scores)):
			_student = dbProcess.studentsQueryById(_student_no)
			_card_topic = dbProcess.topicQueryByCardAndTopic(_card_no, _topic_no + 1)
			_topic_id = _card_topic[0].id
			_topic = dbProcess.topicQueryById(_topic_id)
			_score = _scores[_topic_no]
			print("student id: " + str(_student_no) + ", card id: " + str(_card_no) + ", topic: " + str(_card_topic[0]))
			if type(_score) != int:
				#print "score: " + str(_score) + ", answer: " + str(_topic[0].answer)
				if _score == _topic[0].answer:
					_score = _topic[0].point
				else:
					_score = 0
			print("true score: " + str(_score))
			_task_obj = Task(student_id=_student[0].id, topic_id=_topic[0].id,
				answer=_topic[0].answer, score=_score, textbook_id=_topic[0].textbook_id, 
				chapter=_topic[0].chapter, section=_topic[0].section,
				grade=_student[0].grade, classes=_student[0].classes, school=_student[0].school)
			
			dbProcess.insertTask(_task_obj)

			_score_rate = dbProcess.scoreRateQueryByTopic(_topic[0].id)
			#print "score rate: " + str(_score_rate[0])
			cur_num = _score_rate[0].submitNum
			cur_rate = _score_rate[0].rate
			total_score = cur_num * cur_rate * _topic[0].point
			print("current num: " + str(cur_num) + ", cur rate: " + str(cur_rate) + ", total score: " + str(total_score))
			cur_num = cur_num + 1
			print("update num: " + str(cur_num))
			cur_rate = (total_score + _score) / cur_num / _topic[0].point
			print("update score rate: " + str(cur_rate))
			dbProcess.updateScoreRate(_score_rate[0].id, cur_num, cur_rate)

			
	def get_card_info(self, _file):
		#info = XDDetection(str(_file))
		info = XDDetection("F:/my-data/Dropbox/code/github/scoring/scoringCore/detect/test.jpg")
		#info = XDDetection("test.jpg")
		student_no = info.studentNo
		student_no = 2
		print("student no: " + str(student_no))
		card_no = info.cardNo
		card_no = card_no[6:]
		print("card no: " + str(card_no))
		img = np.asarray(info.studentNameImg)
		scores = []
		for i in range(0, len(info.topics)):
			scores.append(info.topics[i].topicScore)
		print(scores)
		scores = ["A", "B", "A", 10, 10]
		return (student_no, int(card_no), scores)