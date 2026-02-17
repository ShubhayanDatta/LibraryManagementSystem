import { useState, useEffect } from 'react'
import axios from 'axios'
import './Body.css'
import useAuthStore from '../store.js'
import {usePageStore} from '../store.js'
const base_url= 'http://127.0.0.1:5000'



function TrendingBody() {

   const setPage = usePageStore((state)=>state.setPage)
   const page= usePageStore((state)=>state.page)
  


  return (
    <>
   
     <div className="container">
      <h1>📚 Library Management System</h1>

      <div className="button-group">
      <button className="see-details" onClick={()=>{setPage('add')}}>Add Book</button>
      <button className="see-details right-button" onClick={()=>{setPage('record')}}>Show Library Records</button>
      </div>
     </div>
    </>
  )
}

export default TrendingBody