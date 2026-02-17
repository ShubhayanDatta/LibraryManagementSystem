import { useState, useEffect } from 'react'
import axios from 'axios'
import './Record.css'
import useAuthStore from '../store.js'
import {useSearchRecordStore} from '../store.js'
import {usePageStore} from '../store.js'
const base_url= 'http://127.0.0.1:5000'

function SearchRecordLibraryBody() {

 const setSearchRecord = useSearchRecordStore((state)=>state.setSearchRecord)

 const setPage = usePageStore((state)=>state.setPage)
 const page= usePageStore((state)=>state.page)

 const search_record= useSearchRecordStore((state)=>state.search_record)
 const token= useAuthStore((state)=>state.token)

 const [recordList, setRecordList] = useState([])
 useEffect(() => {
    if(search_record!=''){
        axios.get(`${base_url}/admin_search_record?search_term=${search_record}`,{
     headers: {
      'Authorization': token
      }}).then(
      (response)=>{
         setRecordList(response.data)
         })

 }},[search_record]);



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

export default SearchRecordLibraryBody