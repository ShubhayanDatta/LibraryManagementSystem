import { useState, useEffect } from 'react'
import axios from 'axios'
import './Body.css'
import useAuthStore from '../store.js'
import SeeDetailsButton from './seeDetailsButton.jsx'
const base_url= 'http://127.0.0.1:5000'



function TrendingBody() {
 
 const token= useAuthStore((state)=>state.token)

 const [bookList, setBookList] = useState([])
 useEffect(() => {
    axios.get(`${base_url}/display_trending`,{
     headers: {
      'Authorization': token
      }}).then(
      (response)=>{
         setBookList(response.data)
         })

 },[]);

 function filterItem(gen){
    const newList = bookList.filter(item => item.genre === gen)
    console.log(newList)
    return newList
 }





  return (
    <>
   
     <div className="container">
        <h1>📚 Novel Library</h1>

        <section className="genre">
            <h2>Fantasy</h2>
            <ul>
             {filterItem('fantasy').map(item=>(
                    <li  key={item.book_id}>
                        {item.book_name} - {item.author} <SeeDetailsButton book_id={item.book_id}></SeeDetailsButton>{item.reading_status === 'complete' &&
                           <span>✓</span>}
                            
                    </li>
                ))}
            </ul>
        </section>

        <section className="genre">
            <h2>Science Fiction</h2>
            <ul>
            {filterItem('science fiction').map(item=>(
                    <li  key={item.book_id}>
                        {item.book_name} - {item.author} <SeeDetailsButton book_id={item.book_id}></SeeDetailsButton>{item.reading_status === 'complete' &&
                           <span>✓</span>}
                    </li>
                ))}
            </ul>
        </section>

        <section className="genre">
            <h2>Mystery</h2>
            <ul>
            {filterItem('mystery').map(item=>(
                    <li  key={item.book_id}>
                        {item.book_name} - {item.author} <SeeDetailsButton book_id={item.book_id}></SeeDetailsButton>{item.reading_status === 'complete' &&
                           <span>✓</span>}
                    </li>
                ))}
            </ul>
        </section>

        <section className="genre">
            <h2>Romance</h2>
            <ul>
            {filterItem('romance').map(item=>(
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

export default TrendingBody