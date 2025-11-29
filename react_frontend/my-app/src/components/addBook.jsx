import { useState, useEffect } from 'react'
import axios from 'axios'
import './register.css'
import useAuthStore from '../store.js'
import {useDetailsStore} from '../store.js'
import {usePageStore} from '../store.js'
import {usePopupStore} from '../store.js'

const base_url= 'http://127.0.0.1:5000'


function AddBody() {

 const book_id= useDetailsStore((state)=>state.book_id)
 const token= useAuthStore((state)=>state.token)

 const setPage = usePageStore((state)=>state.setPage)
 const page= usePageStore((state)=>state.page)

 const setPopup = usePopupStore((state)=>state.setPopup)
 const show_popup= usePopupStore((state)=>state.show_popup)
 
 const [bookDetails, setBookDetails] = useState({})
 
   

 
 function AddBook() {

   var form_data = new FormData()

   form_data.append('book_name', bookDetails.book_name)
   form_data.append('genre', bookDetails.genre)
   form_data.append('author', bookDetails.author)
   form_data.append('book_url', bookDetails.book_url)
   form_data.append('summary', bookDetails.summary)

   axios.postForm(`${base_url}/add`, form_data,{
    headers: {
    'Authorization': token
     }}).then(
    (response)=>{
        if(response.data=='invalid login')
        {
            setPopup('true')
        }
        else{
            let message = "Book added to the library";
            alert(message);
        }
    })

 }

 const addBookDetails = (key, value) => {
    setBookDetails(prev => ({
      ...prev,
      [key]: value
    }));
  };


  return (
    <>
       <div className="popup">
          <h2>Add Book Details to the Library</h2>
          <form>
            <input type="text" name="book" placeholder="Book Name" value={bookDetails.book_name} onChange={(event) => addBookDetails("book_name", event.target.value)} />
            <input type="text" name="genre" placeholder="Genre" value={bookDetails.genre} onChange={(event) => addBookDetails("genre", event.target.value)} />
            <input type="text" name="author" placeholder="Author" value={bookDetails.author} onChange={(event) => addBookDetails("author", event.target.value)} required />
            <input type="text" name="book_url" placeholder="Book URL" value={bookDetails.book_url} onChange={(event) => addBookDetails("book_url", event.target.value)} />
            <textarea className="summary" name="summary" placeholder="Summary" rows="4" value={bookDetails.summary} onChange={(event) => addBookDetails("summary", event.target.value)} ></textarea>
            <button type="submit" onClick={()=>{AddBook()}}>Add Book</button>
          </form>
       </div>
    </>
  )
}

export default AddBody