# -*- coding: utf-8 -*-
# Generated by Django 1.10.2 on 2016-11-24 14:55
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('scoringCore', '0001_initial'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='card',
            unique_together=set([('textbook', 'chapter', 'section')]),
        ),
    ]
