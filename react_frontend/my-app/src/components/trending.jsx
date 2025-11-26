import { useState, useEffect } from 'react'
import axios from 'axios'
import './Body.css'
import useAuthStore from '../store.js'
import SeeDetailsButton from './seeDetailsButton.jsx'
const base_url= 'http://127.0.0.1:5000'



function TrendingBody() {
 


  return (
    <>
   
     <div className="container">
      <h1>📚 Library Management System</h1>

      <div className="button-group">
      <button className="see-details" >Add Book</button>
      <button className="see-details right-button">Show Library Records</button>
      </div>
     </div>
    </>
  )
}

export default TrendingBody