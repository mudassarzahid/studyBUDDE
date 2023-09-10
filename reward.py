from gpiozero import Servo
from time import sleep
import requests


def move_to_max_position():
  servo.max()
  sleep(10)
  servo.mid()


servo = Servo(16)
try:
  while True:
    response = requests.get("http://192.168.137.95:3003/get_result")
    if response.status_code == 200:
      content = response.text.strip()
      print("Server response:", content)
      if content == "0":
        move_to_max_position()
      elif content == "1":
        servo.min()
        sleep(10)
        servo.mid()
    sleep(5)
except KeyboardInterrupt:
  print("Interrupted by user")
finally:
  servo.close()
12: 45 Uhr
reward.py
