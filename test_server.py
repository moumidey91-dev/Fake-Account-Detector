import urllib.request
import urllib.error
import json
import time
import subprocess

print("Starting app.py...")
proc = subprocess.Popen(["python", "app.py"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, cwd=r"c:\Users\Moumi Dey\Desktop\Fake_Shield_ML")

time.sleep(3) # Wait for server to start

try:
    print("Sending request to /detect...")
    payload = {
        "username": "test_bot",
        "followers": 10,
        "following": 5000,
        "posts": 0,
        "bio_length": 0,
        "profile_pic": 0,
        "verified": 0,
        "account_age": 2,
        "engagement_rate": 0.0
    }
    
    req = urllib.request.Request("http://127.0.0.1:5000/detect", data=json.dumps(payload).encode('utf-8'), headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req) as response:
        print(f"Status Code: {response.status}")
        print(f"Response: {response.read().decode('utf-8')}")
except urllib.error.HTTPError as e:
    print(f"HTTPError: {e.code}")
    print(e.read().decode('utf-8'))
except Exception as e:
    print(f"Error: {e}")
finally:
    print("Killing server...")
    proc.kill()
    out, err = proc.communicate()
    print("Server output:")
    print(out.decode(errors='ignore'))
    print("Server error:")
    print(err.decode(errors='ignore'))
