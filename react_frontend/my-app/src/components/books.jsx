import { useState, useEffect } from 'react'
import SeeDetailsButton from './seeDetailsButton.jsx'
import axios from 'axios'
import './Body.css'
import useAuthStore from '../store.js'
import {useGenreStore} from '../store.js'
const base_url= 'http://127.0.0.1:5000'

function GenreLibraryBody() {
 
 const token= useAuthStore((state)=>state.token)
 const genre= useGenreStore((state)=>state.genre)
 
 const [bookList, setBookList] = useState([])
 useEffect(() => {
    axios.get(`${base_url}/display_library?genre=${genre}`,{
     headers: {
      'Authorization': token
      }}).then(
      (response)=>{
         setBookList(response.data)
         })

 },[genre]);



  return (
    <>
   
     <div className="container">
        <h1>📚 Novel Library</h1>

        <section className="genre">
            <h2>{genre}</h2>
            <ul>
             {bookList.map(item=>(
                    <li  key={item.book_id}>
                        {item.book_name} - {item.author} <SeeDetailsButton book_id={item.book_id}></SeeDetailsButton>{item.reading_status === 'complete' &&
                           <span>✓</span>}
                    </li>
                ))}
            </ul>
        </section>
     </div>
    </>
  )
}

export default GenreLibraryBody