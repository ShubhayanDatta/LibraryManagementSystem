import { useState, useEffect } from 'react'
import SeeDetailsButton from './seeDetailsButton.jsx'
import axios from 'axios'
import './Body.css'
import useAuthStore from '../store.js'
import {useSearchStore} from '../store.js'
const base_url= 'http://127.0.0.1:5000'

function SearchLibraryBody() {

 const search_term= useSearchStore((state)=>state.search_term)
 const token= useAuthStore((state)=>state.token)

 const [bookList, setBookList] = useState([])
 useEffect(() => {
    if(search_term!=''){
        axios.get(`${base_url}/search?search_term=${search_term}`,{
     headers: {
      'Authorization': token
      }}).then(
      (response)=>{
         setBookList(response.data)
         })

 }},[search_term]);



  return (
    <>
   
     <div className="container">
        <h1>📚 Search Results</h1>

        <section className="genre">
            <h2>Search results for {search_term}</h2>
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

export default SearchLibraryBody