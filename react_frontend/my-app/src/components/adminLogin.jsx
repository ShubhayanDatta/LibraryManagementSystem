import './register.css'
import axios from 'axios'
import { useState } from 'react'
import useAuthStore from '../store.js'
const base_url= 'http://127.0.0.1:5000'

function RegistrationPopup(props)
{
    const setUserDetails = useAuthStore((state)=>state.setUserDetails)
    const token= useAuthStore((state)=>state.token)
    function backend_login() {

        var form_data = new FormData()

        form_data.append('admin_id', admin_id)
        form_data.append('password', admin_password)

        axios.postForm(`${base_url}/admin_login`, form_data).then((response)=>{
            var backend_confirmation = response.data 

         if(backend_confirmation == 'wrong admin id/password')
        {
            let message = "wrong ID/password";
            alert(message);
            return false
        }
        else 
        {
            let message = "Login complete";
            alert(message);
            setUserDetails(backend_confirmation.access_token, backend_confirmation.admin_id);
         
            closepopup();

        }
     })
        
        
    }

    

     
    const [admin_id, setadmin_id] = useState('')
    const [admin_password, setadmin_password] = useState('')



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


    return (
        <>
          <div className="popup-overlay" id="popup-container" style={visibility}>
           <div className="popup">
            <span className="close-btn" onClick={()=>closepopup()} >&times;</span>
           
             <>  
                <h2>Login</h2>
                <form>
                <input type="admin_id" placeholder="Admin_id" value={admin_id} onChange={(event)=>setadmin_id(event.target.value)} required />
                <input type="password" placeholder="Password" value={admin_password} onChange={(event)=>setadmin_password(event.target.value)} required />
                <button type="submit" className="register-btn-popup" onClick={()=>backend_login()}>Login</button>
                </form>
             </>
             
          </div>
          
         </div>
        </>
    )
}

export default RegistrationPopup