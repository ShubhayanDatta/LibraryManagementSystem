import { useState, useEffect } from 'react'
import axios from 'axios'
import './page_style.css'
import useAuthStore from '../store.js'
import {useDetailsStore} from '../store.js'
import {usePopupStore} from '../store.js'
import {useChapterNoStore} from '../store.js'
const base_url= 'http://127.0.0.1:5000'

function PageBody() {

 const token= useAuthStore((state)=>state.token)
 const book_id= useDetailsStore((state)=>state.book_id)
 
 const setPopup = usePopupStore((state)=>state.setPopup)
 const show_popup= usePopupStore((state)=>state.show_popup)

 const setChapNo = useChapterNoStore((state)=>state.setChapNo)
 const chap_no= useChapterNoStore((state)=>state.chap_no)

 const increaseChapNo = useChapterNoStore((state)=>state.increaseChapNo)
 const decreaseChapNo = useChapterNoStore((state)=>state.decreaseChapNo)
 

 

 const [readDetails, setreadDetails] = useState({})


 useEffect(() => {
    axios.get(`${base_url}/read/${book_id}/${chap_no}`,{
  headers: {
    'Authorization': token
  }}).then(
    (response)=>{
        if(response.data=='invalid login')
        {
            setPopup('true')
        }
        else{
            setreadDetails(response.data)
        }
    })

 },[chap_no]);

 useEffect(() => {
    axios.get(`${base_url}/read/${book_id}`,{
  headers: {
    'Authorization': token
  }}).then(
    (response)=>{
        if(response.data=='invalid login')
        {
            setPopup('true')
        }
        else{
            setChapNo(response.data.chapter_no)
            setreadDetails(response.data)
        }
    })

 },[book_id]);

 function UpdateChap(update_chapter){
    if(update_chapter == 'previous'){
        if(chap_no > 0)
        {
            decreaseChapNo()
        }
    }

    else if(update_chapter == 'next'){
        if(chap_no < readDetails.max_chapters)
            {
                increaseChapNo()
                var form_data = new FormData()
                if(chap_no == readDetails.max_chapters){
                   var reading_status = 'complete'
                }
                else{
                   var reading_status = 'incomplete'
                } 

                form_data.append('book_id', book_id)
                form_data.append('chapter_no', chap_no)
                form_data.append('reading_status', reading_status)

                axios.postForm(`${base_url}/update_read`,form_data,{
                    headers: {
                    'Authorization': token
                    }}).then((response)=>{    
                        return ''})
            }
    }
}


  return (
    <>
   
        <div className="navigation top-nav">
            <button onClick={()=>UpdateChap('previous')} className="btn prev">← Previous Chapter</button>
            <h1 className="chapter-title">{readDetails.chapter_no}</h1>
            <button onClick={()=>UpdateChap('next')} className="btn next">Next Chapter →</button>
        </div>

        <div className="content">
            <p>
                {readDetails.content}
            </p>
        </div>

        <div className="navigation bottom-nav">
            <button onClick={()=>UpdateChap('previous')} className="btn prev">← Previous Chapter</button>
            <button onClick={()=>UpdateChap('next')} className="btn next">Next Chapter →</button>
        </div>
    </>
  )
}

export default PageBody