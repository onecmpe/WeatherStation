# app.py
from flask import Flask, jsonify, render_template, request
import sqlite3
from sensors import get_weather_data
import datetime

app = Flask(__name__)

# Database setup
def init_db():
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS weather (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            temperature REAL,
            humidity REAL,
            pressure REAL
        )
    ''')
    conn.commit()
    conn.close()

# Initialize the database
init_db()

# Route to insert new data (simulated from sensors)
@app.route('/add_data', methods=['POST'])
def add_data():
    data = get_weather_data()
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute('INSERT INTO weather (temperature, humidity, pressure) VALUES (?, ?, ?)',
              (data['temperature'], data['humidity'], data['pressure']))
    conn.commit()
    conn.close()
    return jsonify(data)

# Route to retrieve data
@app.route('/get_data', methods=['GET'])
def get_data():
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute('SELECT * FROM weather')
    data = c.fetchall()
    conn.close()
    return jsonify(data)

# Main page
@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
