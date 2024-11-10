# sensors.py
import random

def get_weather_data():
    temperature = round(random.uniform(15.0, 30.0), 2)
    humidity = round(random.uniform(40.0, 80.0), 2)
    pressure = round(random.uniform(1000.0, 1025.0), 2)
    return {"temperature": temperature, "humidity": humidity, "pressure": pressure}
