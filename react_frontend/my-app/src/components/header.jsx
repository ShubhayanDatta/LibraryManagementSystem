import { useState, useEffect } from 'react'
import axios from 'axios'
import './Header.css'
import RegistrationPopup from './register.jsx'
import useAuthStore from '../store.js'
import {useGenreStore} from '../store.js'
import {usePageStore} from '../store.js'
import {useSearchStore} from '../store.js'
import {usePopupStore} from '../store.js'
const base_url= 'http://127.0.0.1:5000'

function LibraryHeader() {

  const [genreList, setGenreList] = useState([])
  const [searchTerm, setSearchTerm] = useState([])

  useEffect(() => {
    axios.get(`${base_url}/display_genre`).then((response)=>{
      setGenreList(response.data)
    })

  },[]);

  const setUserDetails = useAuthStore((state)=>state.setUserDetails)
  const token= useAuthStore((state)=>state.token)

  const setGenre = useGenreStore((state)=>state.setGenre)
  const genre= useGenreStore((state)=>state.genre)

  const setPage = usePageStore((state)=>state.setPage)
  const page= usePageStore((state)=>state.page)

  const setSearch = useSearchStore((state)=>state.setSearch)
  const search_term= useSearchStore((state)=>state.search_term)

  const setPopup = usePopupStore((state)=>state.setPopup)
  const show_popup= usePopupStore((state)=>state.show_popup)


  function registerPopup() {
    setPopup('true')
  }
   
  function closeregistrationpopup(){
    setPopup('false')
  }

  function logout(){
    axios.post(`${base_url}/logout`,{},{
    headers: {
      'Authorization': token
    }}).then((response)=>{    
        setUserDetails('', '')
  })}



  return (
    <>
        <header>
        <div className="title-container">
        <h1>Library</h1>
        </div>
        <div className="header-content">
        <ul className="tabs">
            <li>
              <div className="dropdown">
               <button className='dropbtn'>Genres</button>
               <div className="dropdown-content">
                     {genreList.map(item=>(
                        <button className="see-details" key={item} onClick={()=>{setGenre(item); setPage('genre');}}>{item}</button>
                ))}
                </div>
              </div>

            </li>

      
        </ul>
        <div className="search-bar-container">
            <input type="text" placeholder="Search books..." value={search_term} onChange={(event)=>setSearch(event.target.value)} required />

            <button  onClick={()=>setPage('searchterm')}>Search</button>
        </div>
        { token==='' &&
         <button onClick={()=>registerPopup()} className="register-btn">Register</button> 
        }

        { token!=='' &&
          <button onClick={()=>logout()} className="register-btn">Logout</button>
        }
        </div>
        </header>
        <RegistrationPopup show = {show_popup} onclose= {closeregistrationpopup} ></RegistrationPopup>

    </>
  )
}

export default LibraryHeader
