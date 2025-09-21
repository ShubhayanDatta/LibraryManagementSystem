import './Body.css'
import {usePageStore} from '../store.js'
import {useDetailsStore} from '../store.js'

function SeeDetailsButton(props) {

    const setPage = usePageStore((state)=>state.setPage)
    const page= usePageStore((state)=>state.page)

    var input_book_id = props.book_id

    const setDetails = useDetailsStore((state)=>state.setDetails)
    const book_id= useDetailsStore((state)=>state.book_id)

    function SetStore(){
        setPage('details')
        setDetails(input_book_id)
    }

    return <button className="see-details" onClick={SetStore}>See Details</button>
}

export default SeeDetailsButton