import subprocess
import sys

prompt = sys.argv[1]

subprocess.run(['jules', 'remote', 'new', '--repo', '.', '--session', prompt])