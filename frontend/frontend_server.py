import requests
from flask import Flask, render_template, request, jsonify, redirect, session
app = Flask(__name__)
app.secret_key='peru'

backend_url="http://127.0.0.1:5000"
@app.route('/')
def index():
  return render_template('Main_Page.html') 

@app.route('/registration')
def registration():
   return render_template('user_registration.html')

@app.route('/handle_registration',methods=['POST'])
def handle_registration():
   name=(request.form['name'])
   email=(request.form['email'])
   password=(request.form['password'])
   contact_number=(request.form['contact_number'])
   form_data = {'name': name,'email': email,'password': password,'contact_number': contact_number}
   response=requests.post(f'{backend_url}/register',data=form_data)
   if response.text=="Registration complete":
      return redirect('/login')
      print("successful")

   else:
      return redirect('/')
      print("unsuccessful")
   
@app.route('/login')
def login():
   return render_template('Login.html')

@app.route('/handle_login',methods=['POST'])
def handle_login():
   email=(request.form['email'])
   password=(request.form['password'])
   form_data = {'email': email,'password': password,}
   response=requests.post(f'{backend_url}/login',data=form_data)
   if response.text=='wrong email/password':
      print("unsuccessful")
      return redirect('/')
      
   else:
      print("successful")
      session['access_token']=response.json()['access_token']
      return redirect('/Home_page')

@app.route('/Home_page')
def Home_page():
   response=requests.get(f'{backend_url}/display_library')
   return render_template('Home_page.html',results=response.json())

@app.route('/handle_search',methods=['POST'])
def handle_search():
   query=(request.form['query'])
   search_response=requests.get(f'{backend_url}/search',params={'search_term':query})
   if search_response.text=='no match found':
      return render_template('Search_result.html',found=0)
   else:
      return render_template('Search_result.html',results=search_response.json(),found=1)

@app.route('/book_details/<int:book_id>',methods=['GET'])
def show_bookDetails(book_id):
   search_response=requests.get(f'{backend_url}/display',params={'book_id':book_id})
   return render_template('Book_detail.html',books=search_response.json())

@app.route('/handle_read/<int:book_id>',defaults={'chapter_no': None})
@app.route('/handle_read/<int:book_id>/<int:chapter_no>',methods=['GET'])
def LendBook(book_id, chapter_no):
   if chapter_no==None:
       read_book=requests.get(f'{backend_url}/read/{book_id}',headers={'Authorization':session['access_token']})
       return render_template('Book_page.html',books=read_book.json())
   else:
       read_book=requests.get(f'{backend_url}/read/{book_id}/{chapter_no}',headers={'Authorization':session['access_token']})
       books=read_book.json()
       if chapter_no != books['max_chapters']:
          status= 'reading'
       else:
          status= 'complete'
       update_book=requests.post(f'{backend_url}/update_read', 
                                params={'book_id':book_id, 'chapter_no':chapter_no, 'reading_status':status}, 
                                headers={'Authorization':session['access_token']})
       return render_template('Book_page.html',books=books)
  
@app.route('/handle_admin_login',methods=['POST'])
def handle_admin_login():
   admin_id=(request.form['admin_id'])
   password=(request.form['password'])
   form_data = {'admin_id': admin_id,'password': password,}
   response=requests.post(f'{backend_url}/admin_login',data=form_data)
   if response.text=='wrong admin_id/password':
      print("unsuccessful")
      return redirect('/')
      
   else:
      print("successful")
      session['access_token']=response.json()['access_token']
      return redirect('/admin_page')

@app.route('/admin_page')
def admin_page():
   message=request.args.get('message','') 
   return render_template('Admin_page.html',data=message)
  
@app.route('/admin_login')
def admin_login():
   return render_template('Admin_login.html')  

@app.route('/add_book')
def add_book():
   return render_template('add.html')  

@app.route('/search_delete_book')
def search_delete():
   return render_template('Search_delete.html')  

@app.route('/Admin_book_detail/<int:book_id>',methods=['GET'])
def admin_bookDetails_(book_id):
   search_response=requests.get(f'{backend_url}/display',params={'book_id':book_id})
   return render_template('Admin_book_detail.html',books=search_response.json())

@app.route('/admin_search',methods=['POST'])
def admin_search():
   query=(request.form['query'])
   search_response=requests.get(f'{backend_url}/search',params={'search_term':query})
   if search_response.text=='no match found':
      return render_template('Search_delete.html',found=0)
   else:
      return render_template('Search_delete.html',results=search_response.json(),found=1)


@app.route('/handle_add_book',methods=['POST'])
def handle_add_book():
   book_name=(request.form['book_name'])
   author=(request.form['author'])
   summary=(request.form['summary'])
   genre=(request.form['genre'])
   book_url=(request.form['book_url'])
   form_data = {'book_name': book_name,'author': author, 'summary': summary, 'genre': genre, 'book_url': book_url}
   response=requests.post(f'{backend_url}/add',data=form_data,headers={'Authorization':session['access_token']})
   print(response.text)
   if response.text=="success":
      return redirect('/admin_page?message=SUCCESS')
   else:
      return redirect('/admin_page?message=FAILURE')

@app.route('/handle_delete/<int:book_id>',methods=['GET'])
def handle_delete_book(book_id):
   form_data = {'book_id': book_id}
   response=requests.post(f'{backend_url}/delete',data=form_data,headers={'Authorization':session['access_token']})
   print(response.text)
   if response.text=="success":
      return redirect('/admin_page?message=SUCCESS')
   else:
      return redirect('/admin_page?message=FAILURE')
   

if __name__ == '__main__':
   app.run(port=80,debug=True)
