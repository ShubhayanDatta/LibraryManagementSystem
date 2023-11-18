import sqlite3

connection = sqlite3.connect('database.sqlite',check_same_thread=False)
cursor=connection.cursor()
with open('backend/schema.sql') as f:
    connection.executescript(f.read())

from flask import Flask, render_template, request, jsonify
app = Flask(__name__)

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
   cursor.execute(f"select * from BOOKS where book_name like '%{search_term}%';")
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
   contact_number=(request.form['contact_naumber'])
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
    result_dictionary={'user_id':result[0],'name':result[1],'email':result[2],'password':result[3],'contact_number':result[4]}
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

if __name__ == '__main__':
   app.run()
