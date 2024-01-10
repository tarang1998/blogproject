import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = [
    { id: '1', title: "Yoo boy is amazing", content: "To amazing" },
    { id: '2', title: "Spectacular Dacular", content: "Tacular Bachular" }
]

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        postAdded: {
            reducer(state, action) {
                state.push(action.payload)
            },
            prepare(title, content) {
                return {
                    payload: {
                        id: nanoid,
                        title: title,
                        content: content
                    }
                }
            }
        }
    }
})

export const selectAllPosts = (state) => state.posts;

export const { postAdded } = postsSlice.actions;


export default postsSlice.reducer