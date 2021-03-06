#!/usr/bin/env python
import os
import sys
import time
import _thread
import threading
import logging

scaner_dir = "testFile/"

if __name__ == "__main__":

    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "scoring.settings")
    try:
        from django.core.management import execute_from_command_line
    except ImportError:
        # The above import may fail for some other reason. Ensure that the
        # issue is really that Django is missing to avoid masking other
        # exceptions on Python 2.
        try:
            import django
        except ImportError:
            raise ImportError(
                "Couldn't import Django. Are you sure it's installed and "
                "available on your PYTHONPATH environment variable? Did you "
                "forget to activate a virtual environment?"
            )
        raise
    from scoringCore import scanFile
    _thread.start_new_thread(scanFile.scan_dir, ("ScanFile", scaner_dir, 3))
    #t = threading.Thread(target=scan_dir, args=("ScanFile", scaner_dir, 3))
    #t.start()
    execute_from_command_line(sys.argv)
