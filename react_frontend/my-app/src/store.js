import {create} from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set) => ({
      token: "",
      admin_id: "",
      setUserDetails: (input_token, input_admin_id) =>
        set({
          token: input_token,
          admin_id: input_admin_id,
        }),
      clearUser: () =>
        set({
          token: "",
          admin_id: "",
        }),
    }),
    {
      name: "auth-storage", // key in localStorage
      getStorage: () => localStorage, // default is localStorage
    }
  )
)

export const useGenreStore = create((set)=>({
    genre:'', 
    setGenre:(input_genre)=>set({
        genre: input_genre

    })


}))

export const usePageStore = create((set)=>({
    page:'', 
    setPage:(input_page)=>set({
        page: input_page

    })


}))


export const useDetailsStore = create((set)=>({
    book_id:'', 
    setDetails:(input_book_id)=>set({
        book_id: input_book_id

    })


}))

export const useSearchStore = create((set)=>({
    search_term:'', 
    setSearch:(input_search_term)=>set({
        search_term: input_search_term

    })


}))

export const usePopupStore = create((set)=>({
    show_popup:'', 
    setPopup:(input_show_popup)=>set({
        show_popup: input_show_popup

    })


}))

export const useChapterNoStore = create((set)=>({
    chap_no: 0, 
    setChapNo:(input_chap_no)=>set({
        chap_no: input_chap_no
    }),
    increaseChapNo:()=>set((state) => ({ chap_no: state.chap_no + 1 })),
    decreaseChapNo:()=>set((state) => ({ chap_no: state.chap_no - 1 }))
}))

export const useSearchRecordStore = create((set)=>({
    search_record:'', 
    setSearchRecord:(input_search_record)=>set({
        search_record: input_search_record
    })


}))



export default useAuthStore
