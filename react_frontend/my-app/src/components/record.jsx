
import './Record.css'
import { useState, useEffect } from 'react'
import axios from 'axios'
import {usePopupStore} from '../store.js'
import {usePageStore} from '../store.js'
import {useSearchRecordStore} from '../store.js'
import useAuthStore from '../store.js'
const base_url= 'http://127.0.0.1:5000'


function RecordBody() {
 
 const token= useAuthStore((state)=>state.token)

 const setPopup = usePopupStore((state)=>state.setPopup)
 const show_popup= usePopupStore((state)=>state.show_popup)

 const setPage = usePageStore((state)=>state.setPage)
 const page= usePageStore((state)=>state.page)

 const setSearchRecord = useSearchRecordStore((state)=>state.setSearchRecord)
 const search_record= useSearchRecordStore((state)=>state.search_record)
 

 
 const [recordList, setRecordList] = useState([])
 useEffect(() => {
    axios.get(`${base_url}/display_lending`,{
     headers: {
      'Authorization': token
      }}).then(
      (response)=>{
         if(response.data=='invalid login')
        {
            setPopup('true')
        }
        else{
           setRecordList(response.data)
        }})

 })


    return (
        
        <div className="App">
            <div className="search-container">
                    <div><input type="text" placeholder="Search for records..." value={search_record} onChange={(event)=>setSearchRecord(event.target.value)} required />
                    <button onClick={()=>setPage('searchrecord')}>Search</button></div>
            </div>
            <div>
            <table>
                <tbody>
                <tr>
                    <th>Book_name</th>
                    <th>Author</th>
                    <th>User_email</th>
                    <th>Date_of_start</th>
                    <th>Date_of_end</th>
                </tr>
                {recordList.map((val, key) => {
                    return (
                        <tr key={val.record_id}>
                            <td>{val.book_name}</td>
                            <td>{val.author}</td>
                            <td>{val.user_email}</td>
                            <td>{val.date_of_start}</td>
                            <td>{val.date_of_end}</td>
                        </tr>
                    )
                })}
                </tbody>
            </table>
            </div>
        </div>
    );
}

export default RecordBody