import sqlite3
import time
import hashlib
from datetime import date, datetime, timedelta

connection = sqlite3.connect('database.sqlite',check_same_thread=False)
cursor=connection.cursor()
import os

data_file_path = os.path.join(os.path.dirname(__file__), "schema.sql")
with open(data_file_path) as f:
    connection.executescript(f.read())

from flask import Flask, render_template, request, jsonify
app = Flask(__name__)

def check_valid_token(token):
   cursor.execute(f"select * from LOGIN_RECORD where token = '{token}'")
   result=cursor.fetchone()
   if result==None:
      return None
   else:
      current_time= datetime.fromtimestamp(time.time())
      max_time= datetime.fromtimestamp(result[2]) + timedelta(seconds=120)
      if current_time>max_time:
         return None
      else:
         return result[1] 
      
@app.route('/add')
def add_book():
   book_name=(request.args.get('book_name'))
   author=(request.args.get('author'))
   summary=(request.args.get('summary'))
   genre=(request.args.get('genre'))
   cursor.execute(f"insert into BOOKS(book_name, author, summary, genre) values ('{book_name}', '{author}', '{summary}', '{genre}');")
   connection.commit()    
   return "book added to the library"

@app.route('/delete')
def remove_book():
   book_name=(request.args.get('book_name'))
   book_id=(request.args.get('book_id'))
   cursor.execute(f"delete from BOOKS where book_name ='{book_name}' and book_id ='{book_id}' ")
   connection.commit()    
   return "book removed from the library"

@app.route('/display')
def show_book():
   book_name=(request.args.get('book_name'))
   book_id=(request.args.get('book_id'))
   cursor.execute(f"select * from BOOKS where book_name ='{book_name}' and book_id ='{book_id}';")
   result=cursor.fetchall()
   result_dictionary={'book_id':result[0][0],'book_name':result[0][1],'author':result[0][2],'summary':result[0][3],'genre':result[0][4]} 
   return result_dictionary

@app.route('/search')
def search_book():
   search_term=(request.args.get('search_term'))
   cursor.execute('select * from BOOKS where book_name like "%'+search_term+'%" ;')
   result=cursor.fetchall()
   if result!=None:
     result_dictionary=[]
     for row in result:
       row_dictionary={'book_id':row[0],'book_name':row[1],'author':row[2],'summary':row[3],'genre':row[4]}
       result_dictionary.append(row_dictionary)
   else:
      return 'no match found'
   return jsonify(result_dictionary)

@app.route('/display_library')
def show_database():
   cursor.execute("select * from BOOKS ;")
   result=cursor.fetchall()
   result_dictionary=[]
   for row in result:
     row_dictionary={'book_id':row[0],'book_name':row[1],'author':row[2],'summary':row[3],'genre':row[4]}
     result_dictionary.append(row_dictionary)
   return jsonify(result_dictionary)

@app.route('/register',methods=['POST'])
def add_user():
   name=(request.form['name'])
   email=(request.form['email'])
   password=(request.form['password'])
   contact_number=(request.form['contact_number'])
   cursor.execute(f"select * from USERS where email ='{email}';")
   result=cursor.fetchone()
   print(result)
   if result!=None:
      return 'email already exists'

   cursor.execute(f"insert into USERS(name, email, password, contact_number) values ('{name}', '{email}', '{password}', '{contact_number}');")
   connection.commit()    
   return "Registration complete"

@app.route('/login',methods=['POST'])
def login_user():
   email=(request.form['email'])
   password=(request.form['password'])
   cursor.execute(f"select * from USERS where email ='{email}' and password ='{password}';")
   result=cursor.fetchone()
   if result==None:
    return 'wrong email/password'
   else:
    unique_string= str(result[0])+email+str(time.time())
    new_access_token= hashlib.md5(unique_string.encode()).hexdigest()
    cursor.execute(f"insert into LOGIN_RECORD(token,user_id,login_time) values('{new_access_token}','{result[0]}','{time.time()}')")
    result_dictionary={'user_id':result[0],'name':result[1],'email':result[2],'contact_number':result[3],'access_token':new_access_token}
    return result_dictionary
   
@app.route('/admin_login',methods=['POST'])
def login_admin():
   admin_id=(request.form['admin_id'])
   password=(request.form['password'])
   cursor.execute(f"select * from ADMIN where admin_id ='{admin_id}' and password ='{password}';")
   result=cursor.fetchone()
   if result==None:
    return 'wrong admin id/password'
   else:
    result_dictionary={'user_id':result[0],'name':result[1],'email':result[2],'password':result[3],'contact_number':result[4]}
    return result_dictionary
   
@app.route('/lend')
def lend_book():
   book_id=(request.args.get('book_id'))
   user_id=(request.args.get('user_id'))
   token=(request.headers['access_token'])
   today = date.today()
   if not check_valid_token(token):
      return 'invalid logintime'
   cursor.execute(f"insert into LENDING(book_id, user_id, date_of_lending) values ('{book_id}', '{user_id}', '{today}');")
   connection.commit()
   return 'book borrowed'

@app.route('/return')
def return_book():
   record_id=(request.args.get('record_id'))
   today = date.today() 
   cursor.execute(f"UPDATE LENDING SET date_of_return ='{today}' WHERE record_id ='{record_id}';")
   connection.commit()  
   return 'Book returned'

@app.route('/record')
def lending_record():
   user_id=(request.args.get('user_id'))
   book_id=(request.args.get('book_id'))
   cursor.execute(f"select * from LENDING where user_id ='{user_id}' or book_id ='{book_id}';")
   result=cursor.fetchall()
   if result!=[]:   
    result_dictionary=[]
    for row in result:
       row_dictionary={'record_id':row[0],'book_id':row[1],'user_id':row[2],'date_of_lending':row[3],'date_of_return':row[4]}
       result_dictionary.append(row_dictionary)
    return jsonify(result_dictionary)
   else:
       return 'wrong user_id/book_id'
   
if __name__ == '__main__':
   app.run()
