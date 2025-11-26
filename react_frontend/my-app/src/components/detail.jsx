
import { useState, useEffect } from 'react'
import axios from 'axios'
import './Body.css'
import './Details.css'
import useAuthStore from '../store.js'
import {useDetailsStore} from '../store.js'
import {usePageStore} from '../store.js'
import {usePopupStore} from '../store.js'

const base_url= 'http://127.0.0.1:5000'


function DetailsBody() {

 const book_id= useDetailsStore((state)=>state.book_id)
 const token= useAuthStore((state)=>state.token)

 const setPage = usePageStore((state)=>state.setPage)
 const page= usePageStore((state)=>state.page)

 const setPopup = usePopupStore((state)=>state.setPopup)
 const show_popup= usePopupStore((state)=>state.show_popup)
 
 const [bookDetails, setBookDetails] = useState({})
 

 useEffect(() => {
    axios.get(`${base_url}/display?book_id=${book_id}`).then((response)=>{
        setBookDetails(response.data)
    })
   
 },[book_id]);



  return (
    <>
     <div className="container">
        <div className="book-title">{bookDetails.book_name}</div>
        <div className="book-author">by {bookDetails.author}</div>
        <div className="book-genre">Genre: {bookDetails.genre}</div>
        <div className="book-description">
           {bookDetails.summary}
        </div>
        <button className="start-button" onClick={()=>{setPage('update')}}>Update Book</button>

        <button className="complete-button" >Delete Book</button>
   
     </div>
    </>
  )
}

export default DetailsBody