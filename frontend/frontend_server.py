import requests
from flask import Flask, render_template, request, jsonify, redirect
app = Flask(__name__)

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




if __name__ == '__main__':
   app.run(port=80,debug=True)
