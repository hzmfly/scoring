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
    subjectCd = models.IntegerField(choices=constant.subjectCd_DESC)
    chapter = models.IntegerField()
    chapterName = models.CharField(max_length=60)
    tms = models.DateTimeField(auto_now=True)
    def __str__(self):  # __unicode__ on Python 2
        return str(self.id)+"-"+str(self.chapterName)

class Card_Topic(models.Model):
    card = models.ForeignKey(
        'Card',
        on_delete=models.CASCADE,
    )
    topic = models.IntegerField()
    topicType = models.IntegerField(choices=constant.TOPIC_TYPE)
    addr1 = models.CharField(max_length=10)
    addr2 = models.CharField(max_length=10)
    addr3 = models.CharField(max_length=10, blank=True)
    addr4 = models.CharField(max_length=10, blank=True)
    question = models.CharField(max_length=400, blank=True)
    answer = models.CharField(max_length=400)#选择题需要
    point = models.IntegerField()
    option = models.CharField(max_length=400, blank=True)#选择题需要
    tms = models.DateTimeField(auto_now=True)

    def __str__(self):  # __unicode__ on Python 2
        return str(self.id)+"-"+str(self.topic)

    class Meta:
        unique_together = ("card", "topic")

class Student(models.Model):
    name = models.CharField(max_length=30)
    school = models.IntegerField(blank=True, null=True)
    gender = models.CharField(max_length=2, blank=True, null=True)
    grade = models.IntegerField(choices=constant.GRADE_NAME)
    classes = models.IntegerField()
    tms = models.DateTimeField(auto_now=True)

    def __str__(self):  # __unicode__ on Python 2
        return str(self.id)+":"+self.name

class Teacher(models.Model):
   # teacherId = models.IntegerField(primary_key=True)
    user = models.OneToOneField(User)
    name = models.CharField(max_length=30)
    school = models.IntegerField(blank=True, null=True)
    gender = models.CharField(max_length=2, blank=True, null=True)
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
    card = models.ForeignKey(
        'Card',
        on_delete=models.CASCADE,
    )
    topic = models.IntegerField()
    answer = models.CharField(max_length=400, blank=True)  # 选择题需要
    score = models.IntegerField()
    grade = models.IntegerField(choices=constant.GRADE_NAME)
    classes = models.IntegerField()
    tms = models.DateTimeField(auto_now=True)
    def __str__(self):  # __unicode__ on Python 2
        return str(self.student.id)+":"+str(self.card.id)+":"+str(self.topic)
    class Meta:
        unique_together = ("student", "card", "topic")



