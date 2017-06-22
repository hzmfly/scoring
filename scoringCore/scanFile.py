#!/usr/bin/python
#coding: UTF-8

import time
import os
import logging
import threading
import numpy as np
import random
from AnswerSheetRecognition import *

import shutil

logger = logging.getLogger(__name__)

def scan_dir(thread_name, dir, delay):
    print("start scan dir: " + dir)
    delay = random.randint(delay, delay+3)
    time.sleep(delay)
    flag = True
    flag_file = os.path.join(dir, "flag.txt")
    if os.path.isfile(flag_file) == True:
        flag = False
    else:
        f = open(flag_file, "w")
        f.write("flag\n")
        f.close()
    visit_files = []
    while flag:
        cur_files = os.listdir(dir)
        print(cur_files)
        for file in cur_files:
            abs_file = os.path.join(dir, file)
            if os.path.isfile(abs_file):
                if abs_file not in visit_files and abs_file.find(".jpg") != -1:
                    print("find file: " + abs_file)
                    visit_files.append(abs_file)
                    scan_one_card(abs_file)
                    shutil.move(abs_file, os.path.join(os.path.join(dir,"visited"), file))
        time.sleep(delay)
        if os.path.isfile(flag_file) == True:
        	os.remove(flag_file)

def scan_one_card(path):
	print("scan one card: " + path)
	from scoringCore import dbProcess
	from scoringCore.models import Task
	(student_no, card_no, scores) = get_card_info(path)
	for topic_no in range(0,len(scores)):
		student = dbProcess.studentsQueryById(student_no)
		cardtopic = dbProcess.topicQueryByCardAndTopic(card_no, topic_no + 1)
		topic_id = cardtopic[0].id
		topic = dbProcess.topicQueryById(topic_id)
		score = scores[topic_no]
		print("student id: " + str(student_no) + ", card id: " + str(card_no) + ", topic: " + str(cardtopic[0]))
		if type(score) != int:
			#print "score: " + str(score) + ", answer: " + str(topic[0].answer)
			if score == topic[0].answer:
				score = topic[0].point
			else:
				score = 0
		print("true score: " + str(score))
		task_obj = Task(student_id=student[0].id, topic_id=topic[0].id,
			answer=topic[0].answer, score=score, textbook_id=topic[0].textbook_id, 
			chapter=topic[0].chapter, section=topic[0].section,
			grade=student[0].grade, classes=student[0].classes, school=student[0].school)
		
		dbProcess.insertTask(task_obj)

		score_rate = dbProcess.scoreRateQueryByTopic(topic[0].id)
		#print "score rate: " + str(score_rate[0])
		cur_num = score_rate[0].submitNum
		cur_rate = score_rate[0].rate
		totalscore = cur_num * cur_rate * topic[0].point
		print("current num: " + str(cur_num) + ", cur rate: " + str(cur_rate) + ", total score: " + str(totalscore))
		cur_num = cur_num + 1
		print("update num: " + str(cur_num))
		cur_rate = (totalscore + score) / cur_num / topic[0].point
		print("update score rate: " + str(cur_rate))
		dbProcess.updateScoreRate(score_rate[0].id, cur_num, cur_rate)

		
def get_card_info(_file):
	info = XDDetection(str(_file))
	student_no = info.studentNo
	print("student no: " + str(student_no))
	student_no = 2
	card_no = info.cardNo
	print("card no: " + str(card_no))
	card_no = card_no[6:]
	img = np.asarray(info.studentNameImg)
	scores = []
	for i in range(0, len(info.topics)):
		scores.append(info.topics[i].topicScore)
	print(scores)
	scores = ["A", "B", "A", 10, 10]
	return (student_no, int(card_no), scores)