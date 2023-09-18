import sqlite3

connection = sqlite3.connect('database.db')
with open('schema.sql') as f:
    connection.executescript(f.read())

from flask import Flask, render_template, request
app = Flask(__name__)

@app.route('/')
def hello_world():
   return "hello world"
@app.route('/display')
def show_database():
   return "1" 

if __name__ == '__main__':
   app.run()
