import './register.css'
import axios from 'axios'
import { useState } from 'react'
import useAuthStore from '../store.js'
const base_url= 'http://127.0.0.1:5000'

function RegistrationPopup(props)
{
    const setUserDetails = useAuthStore((state)=>state.setUserDetails)
    const token= useAuthStore((state)=>state.token)
    function backend_registration() {

          if(user_password!=confirm_password)
        {

            alert('password does not match')
            return false

        }
        var form_data = new FormData()
        form_data.append('name', user_name)
        form_data.append('email', user_email)
        form_data.append('password', user_password)
        form_data.append('contact_number', user_contact_number)

        axios.postForm(`${base_url}/register`, form_data).then((response)=>{
            var backend_confirmation = response.data 

         if(backend_confirmation == 'email already exists')
        {
            let message = "email already exists";
            alert(message);
            return false
        }
        else if(backend_confirmation == 'Registration complete')
        {
            let message = "Registration complete";
            alert(message);
            switchmode();

        }
     })
        
        
    }

    function backend_login() {

        var form_data = new FormData()

        form_data.append('email', user_email)
        form_data.append('password', user_password)

        axios.postForm(`${base_url}/login`, form_data).then((response)=>{
            var backend_confirmation = response.data 

         if(backend_confirmation == 'wrong email/password')
        {
            let message = "wrong email/password";
            alert(message);
            return false
        }
        else 
        {
            let message = "Login complete";
            alert(message);
            setUserDetails(backend_confirmation.access_token, backend_confirmation.user_name);
         
            closepopup();

        }
     })
        
        
    }


     
    const [user_name, setuser_name] = useState('')
    const [user_email, setuser_email] = useState('')
    const [user_password, setuser_password] = useState('')
    const [user_contact_number, setuser_contact_number] = useState('')

    const [confirm_password, setconfirm_password] = useState('')

    const [mode, setMode] = useState('register')

    var visibility
    var show = props.show
    if(show=='true')
    { 
       visibility = {display:'block'}
    }
    else{
        visibility= {display:'none'}
    }

    function closepopup(){
        props.onclose()
    }

    function switchmode(){
        if(mode=='register')
        {
            setMode('login')
        }
        else{
            setMode('register')
        }
    }
    return (
        <>
          <div className="popup-overlay" id="popup-container" style={visibility}>
           <div className="popup">
            <span className="close-btn" onClick={()=>closepopup()} >&times;</span>
           
            { mode==='register' &&
             <> 
                <h2>Register</h2>
                <form>
                <input type="text" placeholder="Full Name" value={user_name} onChange={(event)=>setuser_name(event.target.value)} required />
                <input type="email" placeholder="Email" value={user_email} onChange={(event)=>setuser_email(event.target.value)}  required />
                <input type="password" placeholder="Password" value={user_password} onChange={(event)=>setuser_password(event.target.value)} required />
                <input type="password" placeholder="Confirm Password" value={confirm_password} onChange={(event)=>setconfirm_password(event.target.value)} required />
                <input type="tel" placeholder="Contact Number" value={user_contact_number} onChange={(event)=>setuser_contact_number(event.target.value)} required />
                <button type="submit" className="register-btn-popup" onClick={()=>backend_registration()}>Register</button>
                </form>
                <p className="login-link">
                Already have an account? <a href="#" onClick={()=>switchmode()}>Login</a>
             </p>
             </>
            }
            
           
            { mode==='login' &&
             <>  
                <h2>Login</h2>
                <form>
                <input type="email" placeholder="Email" value={user_email} onChange={(event)=>setuser_email(event.target.value)} required />
                <input type="password" placeholder="Password" value={user_password} onChange={(event)=>setuser_password(event.target.value)} required />
                <button type="submit" className="register-btn-popup" onClick={()=>backend_login()}>Login</button>
                </form>
                <p className="login-link">
                Don't have an account? <a href="#" onClick={()=>switchmode()}>Register</a>
                </p>
             </>
            }
             
          </div>
          
         </div>
        </>
    )
}

export default RegistrationPopup