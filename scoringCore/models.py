from django.db import models
from django.contrib.auth.models import User
from scoringCore import constant
# Create your models here.


class Textbook(models.Model):
    textbookName = models.CharField(max_length=60, blank=True)
    publisher  = models.CharField(max_length=30, blank=True)
    grade = models.IntegerField(choices=constant.GRADE_NAME)
    subjectCd = models.IntegerField(choices=constant.subjectCd_DESC)
    semester = models.IntegerField(choices=constant.SEMESTER)
    tms = models.DateTimeField(auto_now=True)
    def __str__(self):  # __unicode__ on Python 2
        return str(self.id)+":"+str(self.textbookName)

class Card(models.Model):
    textbook = models.ForeignKey(
        'Textbook',
        on_delete=models.CASCADE,
    )
    chapter = models.IntegerField()
    section = models.IntegerField()
    tms = models.DateTimeField(auto_now=True)
    def __str__(self):  # __unicode__ on Python 2
        return str(self.id)

class Topic(models.Model):
    textbook = models.ForeignKey(
        'Textbook',
        on_delete=models.CASCADE,
    )
    chapter = models.IntegerField()
    chapterName = models.CharField(max_length=45)
    section = models.IntegerField()
    sectionName = models.CharField(max_length=45)
    topic = models.IntegerField()
    topicType = models.IntegerField(choices=constant.TOPIC_TYPE)
    degree = models.IntegerField()
    question = models.CharField(max_length=400, blank=True)
    answer = models.CharField(max_length=400)  # 选择题需要
    point = models.IntegerField()
    option = models.CharField(max_length=45, blank=True)  # 选择题需要
    tms = models.DateTimeField(auto_now=True)
    def __str__(self):  # __unicode__ on Python 2
        return str(self.id)

class Card_Topic(models.Model):
    card = models.ForeignKey(
        'Card',
        on_delete=models.CASCADE,
    )
    topic = models.ForeignKey(
        'Topic',
        on_delete=models.CASCADE,
    )
    topicType = models.IntegerField(choices=constant.TOPIC_TYPE)
    addr1 = models.CharField(max_length=10)
    addr2 = models.CharField(max_length=10)
    addr3 = models.CharField(max_length=10, blank=True)
    addr4 = models.CharField(max_length=10, blank=True)
    answer = models.CharField(max_length=400)  # 选择题需要
    point = models.IntegerField()
    tms = models.DateTimeField(auto_now=True)

    def __str__(self):  # __unicode__ on Python 2
        return str(self.card.id)+"-"+str(self.topic.id)

    class Meta:
        unique_together = ("card", "topic")

class Student(models.Model):
    name = models.CharField(max_length=30)
    school = models.IntegerField(blank=True, null=True)
    gender = models.IntegerField(choices=constant.GENDER)
    grade = models.IntegerField(choices=constant.GRADE_NAME)
    classes = models.IntegerField()
    tms = models.DateTimeField(auto_now=True)

    def __str__(self):  # __unicode__ on Python 2
        return str(self.id)+":"+self.name

class Teacher(models.Model):
    user = models.OneToOneField(User)
    name = models.CharField(max_length=30)
    school = models.IntegerField()
    gender = models.IntegerField(choices=constant.GENDER)
    tms = models.DateTimeField(auto_now=True)

    def __str__(self):  # __unicode__ on Python 2
        return str(self.id)+":"+self.name

class Teacher_Classes(models.Model):

    teacher = models.ForeignKey(
        'Teacher',
        on_delete=models.CASCADE,
    )
    grade  = models.IntegerField(choices=constant.GRADE_NAME)
    classes = models.IntegerField()
    school = models.IntegerField(blank=True, null=True)
    subjectCd = models.IntegerField(choices=constant.subjectCd_DESC)
    textbook = models.ForeignKey(
        'Textbook',
        on_delete=models.CASCADE,
    )
    tms = models.DateTimeField(auto_now=True)
    def __str__(self):  # __unicode__ on Python 2
        return str(self.teacher.id)+":"+str(self.grade)+"-"+str(self.classes)

    class Meta:
        unique_together = ("teacher", "grade", "classes")


class Task(models.Model):
    student = models.ForeignKey(
        'Student',
        on_delete=models.CASCADE,
    )
    topic = models.ForeignKey(
        'Topic',
        on_delete=models.CASCADE,
    )
    answer = models.CharField(max_length=400, blank=True)  # 选择题需要
    score = models.IntegerField()
    textbook = models.ForeignKey(
        'Textbook',
        on_delete=models.CASCADE,
    )
    chapter = models.IntegerField()
    section = models.IntegerField()
    grade = models.IntegerField(choices=constant.GRADE_NAME)
    classes = models.IntegerField()
    school = models.IntegerField()
    tms = models.DateTimeField(auto_now=True)
    def __str__(self):  # __unicode__ on Python 2
        return str(self.student.id)+":"+str(self.topic.id)
    class Meta:
        unique_together = ("student",  "topic")

class ScoreRate(models.Model):
    topic = models.ForeignKey(
        'Topic',
        on_delete=models.CASCADE,
    )
    textbook = models.ForeignKey(
        'Textbook',
        on_delete=models.CASCADE,
    )
    chapter = models.IntegerField()
    section = models.IntegerField()
    grade = models.IntegerField(choices=constant.GRADE_NAME)
    classes = models.IntegerField()
    school = models.IntegerField()
    rate = models.FloatField()
    def __str__(self):  # __unicode__ on Python 2
        return str(self.topic)+":"+str(self.rate)

