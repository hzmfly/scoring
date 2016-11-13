from django.contrib import admin

# Register your models here.
from . import models


admin.site.register(models.Teacher)
admin.site.register(models.Teacher_Classes)
admin.site.register(models.Card)
admin.site.register(models.Card_Topic)
admin.site.register(models.Textbook)
admin.site.register(models.Student)
admin.site.register(models.Task)
admin.site.register(models.ScoreRate)
admin.site.register(models.Topic)