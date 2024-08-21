import sqlite3
import time
import hashlib
import epub2txt
from datetime import date, datetime, timedelta

connection = sqlite3.connect('database.sqlite',check_same_thread=False)
cursor=connection.cursor()
import os

data_file_path = os.path.join(os.path.dirname(__file__), "schema.sql")
with open(data_file_path) as f:
    connection.executescript(f.read())

from flask import Flask, render_template, request, jsonify
app = Flask(__name__)

def check_valid_token(token, check_admin_token= False):
   if check_admin_token :
      cursor.execute(f"select * from LOGIN_ADMIN_RECORD where token = '{token}'")
   else:
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
      
@app.route('/add',methods=['POST'])
def add_book():
   token=(request.headers['Authorization'])
   user_id=check_valid_token(token,True)
   if not user_id:
      return 'invalid login'
   book_name=(request.form['book_name'])
   author=(request.form['author'])
   summary=(request.form['summary'])
   genre=(request.form['genre'])
   book_url=(request.form['book_url'])
   cursor.execute(f"insert into BOOKS(book_name, author, summary, genre, book_url) values ('{book_name}', '{author}', '{summary}', '{genre}', '{book_url}');")
   connection.commit()    
   return "success"

@app.route('/delete',methods=['POST'])
def remove_book():
   token=(request.headers['Authorization'])
   user_id=check_valid_token(token,True)
   if not user_id:
      return 'invalid login'
   book_id=(request.form['book_id'])
   cursor.execute(f"delete from BOOKS where book_id ='{book_id}' ")
   connection.commit()    
   return "success"

@app.route('/update',methods=['POST'])
def update():
   token=(request.headers['Authorization'])
   user_id=check_valid_token(token,True)
   if not user_id:
      return 'invalid login'
   book_id=(request.form['book_id'])
   book_name=(request.form['book_name'])
   author=(request.form['author'])
   summary=(request.form['summary'])
   genre=(request.form['genre'])
   book_url=(request.form['book_url'])
   cursor.execute(f"update BOOKS set book_name ='{book_name}', author ='{author}', summary ='{summary}', genre='{genre}', book_url ='{book_url}'  where book_id ='{book_id}' ")
   connection.commit()    
   return "success"

@app.route('/display')
def show_book():
   book_id=(request.args.get('book_id'))
   cursor.execute(f"select * from BOOKS where book_id ='{book_id}';")
   result=cursor.fetchall()
   result_dictionary={'book_id':result[0][0],'book_name':result[0][1],'author':result[0][2],'summary':result[0][3],'genre':result[0][4],'book_url':result[0][5]} 
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
    unique_string= str(result[1])+admin_id+str(time.time())
    new_access_token= hashlib.md5(unique_string.encode()).hexdigest()
    cursor.execute(f"insert into LOGIN_ADMIN_RECORD(token, admin_id, login_time) values('{new_access_token}','{result[0]}','{time.time()}')")
    result_dictionary={'admin_id':result[0], 'access_token':new_access_token}
    return result_dictionary
   
def get_book_content(book_id, chapter_no):
    cursor.execute(f"select book_url from BOOKS where book_id ='{book_id}';")
    result=cursor.fetchone()
    print(result)
    if result == None:
       return 'invalid book_id'
    book_content=epub2txt.epub2txt(result[0],outputlist=True)
    chap_content=book_content[chapter_no]
    max_chapter=len(book_content)-1
    return chap_content, max_chapter

@app.route('/read/<int:book_id>',defaults={'chapter_no': None})   
@app.route('/read/<int:book_id>/<int:chapter_no>')
def read_book(book_id, chapter_no):
   token=(request.headers['Authorization'])
   today = date.today()
   user_id=check_valid_token(token)
   if not user_id:
      return 'invalid login'
   cursor.execute(f"select * from ADMIN where user_id ='{user_id}' and book_id ='{book_id}';")
   result=cursor.fetchone()
   cursor.execute(f"select book_name from BOOKS where book_id ='{book_id}';")
   book_name=cursor.fetchone()
   if result==None and chapter_no==None:
      cursor.execute(f"insert into READING(book_id, user_id, date_of_start, chapter_no) values ('{book_id}', '{user_id}', '{today}', 0);")
      connection.commit()
      content, max_chapters= get_book_content(book_id, 0)
      result_dictionary={'book_id':book_id, 'book_name':book_name[0], 'date_of_start':today, 'chapter_no': 0, 'content': content, 'max_chapters': max_chapters }
      return result_dictionary
   else:
      content, max_chapters= get_book_content(book_id, chapter_no if chapter_no!= None else result[6])
      result_dictionary={'book_id':book_id, 'book_name':book_name[0], 'date_of_start':result[3],
                          'chapter_no':chapter_no if chapter_no!=None else result[6], 
                          'content': content, 'max_chapters': max_chapters}
      return result_dictionary
   

@app.route('/update_read', methods=['POST'])
def update_book():
   book_id=(request.args.get('book_id'))
   reading_status=(request.args.get('reading_status'))
   chapter_no=(request.args.get('chapter_no'))
   token=(request.headers['Authorization'])
   today = date.today()
   user_id=check_valid_token(token)
   if not user_id:
      return 'invalid login'
   if reading_status=='complete': 
      cursor.execute(f"UPDATE READING SET date_of_end ='{today}', chapter_no='{chapter_no}' WHERE user_id ='{user_id}' AND book_id ='{book_id}';")
   else:
      cursor.execute(f"UPDATE READING SET chapter_no='{chapter_no}' WHERE user_id ='{user_id}' AND book_id ='{book_id}';")
   connection.commit()  
   return 'Book Updated'

@app.route('/record')
def lending_record():
   user_id=(request.args.get('user_id'))
   book_id=(request.args.get('book_id'))
   cursor.execute(f"select * from READING where user_id ='{user_id}' or book_id ='{book_id}';")
   result=cursor.fetchall()
   if result!=[]:   
    result_dictionary=[]
    for row in result:
       row_dictionary={'record_id':row[0],'book_id':row[1],'user_id':row[2],'date_of_start':row[3],'date_of_end':row[4]}
       result_dictionary.append(row_dictionary)
    return jsonify(result_dictionary)
   else:
       return 'wrong user_id/book_id'


if __name__ == '__main__':
   app.run()
