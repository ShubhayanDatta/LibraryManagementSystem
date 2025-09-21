import {create} from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set) => ({
      token: "",
      user_name: "",
      setUserDetails: (input_token, input_user_name) =>
        set({
          token: input_token,
          user_name: input_user_name,
        }),
      clearUser: () =>
        set({
          token: "",
          user_name: "",
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




export default useAuthStore
