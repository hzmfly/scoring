from django.test import TestCase
from scoringCore import service
from scoringCore import dbProcess
# Create your tests here.

class calculateMethodTests(TestCase):

    def test_calculateScoringRateByClasses(self):
        average = service.calculateScoringRateByClasses(9,1,1,1)
        self.assertIs(average,0.5)
"""
    def test_topicQueryByCardAndTopic(self):
        _result = dbProcess.topicQueryByCardAndTopic(1,1)
        self.assertIs(_result,"")"""

