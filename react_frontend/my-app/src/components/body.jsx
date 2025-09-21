
import TrendingBody  from './trending.jsx'
import GenreLibraryBody from './books.jsx'
import DetailsBody from './detail.jsx'
import SearchLibraryBody from './search.jsx'
import PageBody from './read.jsx'
import {usePageStore} from '../store.js'
import './Body.css'

const base_url= 'http://127.0.0.1:5000'
function LibraryBody() {

  const page= usePageStore((state)=>state.page)

  return (
    <>
     <div className='body'>  
      {page==='' &&
        <TrendingBody></TrendingBody>
      }
       
      {page==='genre' && 
        <GenreLibraryBody></GenreLibraryBody>
      }

      {page==='details' && 
        <DetailsBody></DetailsBody>
      }

      {page==='searchterm' && 
        <SearchLibraryBody></SearchLibraryBody>
      }

      {page==='content' && 
        <PageBody></PageBody>
      }
     </div>
    </>
  )
}

export default LibraryBody

