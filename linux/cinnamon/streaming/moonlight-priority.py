#!/usr/bin/python3
"""Give a dedicated streaming user's Moonlight ordinary elevated CPU priority."""
import os
from pathlib import Path
import pwd
import resource
import sys
import time

uid = pwd.getpwnam(sys.argv[1]).pw_uid
known = set()
while True:
    active = set()
    for process in Path('/proc').iterdir():
        if not process.name.isdecimal():
            continue
        try:
            if process.stat().st_uid != uid or process.joinpath('comm').read_text().strip() != 'moonlight':
                continue
            pid = int(process.name)
            active.add(pid)
            if pid in known:
                continue
            # RLIMIT_NICE uses 20 - nice: 35 permits the app's requested -15.
            # This grants no real-time scheduling or privileged executable bits.
            resource.prlimit(pid, resource.RLIMIT_NICE, (35, 35))
            for thread in process.joinpath('task').iterdir():
                os.setpriority(os.PRIO_PROCESS, int(thread.name), -5)
            known.add(pid)
            print(f'Moonlight {pid}: nice -5, renderer/audio priority allowed', flush=True)
        except (OSError, ProcessLookupError):
            continue
    known.intersection_update(active)
    time.sleep(2)
