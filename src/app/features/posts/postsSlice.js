import { createSlice, nanoid, createAsyncThunk } from "@reduxjs/toolkit";
import { enableMapSet } from 'immer';

import { sub } from "date-fns";
import axios from "axios";

const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';


const initialState = {
    posts: [],
    status: "idle", //idle | loading | succeeded | failed
    error: null,
    postIds: []


}

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    //TODO : Check If already fetching data 
    try {
        console.log('Fetching posts')
        const response = await axios.get(POSTS_URL)
        return [...response.data]
    }
    catch (err) {
        return err.message;
    }

})

export const addNewPost = createAsyncThunk('posts/addNewPost', async (initialPost) => {
    const response = await axios.post(POSTS_URL, initialPost)
    console.log(response)
    return response.data
})

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        postAdded: {
            reducer(state, action) {
                state.posts.push(action.payload)
            },
            prepare(title, content, userId) {
                return {
                    payload: {
                        id: nanoid,
                        title: title,
                        content: content,
                        date: new Date().toISOString(),
                        userId: userId,
                        reactions: {
                            thumbsUp: 0,
                            wow: 0,
                            heart: 0,
                            rocket: 0,
                            coffee: 0
                        }
                    }
                }
            }
        },
        reactionAdded(state, action) {
            const { postId, reaction } = action.payload
            const existingPost = state.posts.find(post => post.id === postId)
            if (existingPost) {
                existingPost.reactions[reaction]++
            }
        },

    },
    extraReducers(builder) {
        builder
            .addCase(fetchPosts.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = 'succeeded'
                // Adding date and reactions
                let min = 1;

                if (action.payload == "Network Error") {
                    state.status = 'failed'
                    state.error = "Make sure you are connected to a secure internet connection"

                }
                else {
                    let payload = action.payload ?? []
                    const loadedPosts = payload.filter(post => !state.postIds.includes(post.id))    .map(post => {
                        state.postIds.push(post.id)
                        post.date = sub(new Date(), { minutes: min++ }).toISOString();
                        post.reactions = {
                            thumbsUp: 0,
                            wow: 0,
                            heart: 0,
                            rocket: 0,
                            coffee: 0
                        }
                        return post;

                    });

                    // Add any fetched posts to the array
                    state.posts = state.posts.concat(loadedPosts)
                }

            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
            .addCase(addNewPost.fulfilled, (state, action) => {
                // Fix for API post IDs:
                // Creating sortedPosts & assigning the id 
                // would be not be needed if the fake API 
                // returned accurate new post IDs
                const sortedPosts = state.posts.sort((a, b) => {
                    if (a.id > b.id) return 1
                    if (a.id < b.id) return -1
                    return 0
                })
                action.payload.id = sortedPosts[sortedPosts.length - 1].id + 1;
                // End fix for fake API post IDs 

                action.payload.userId = Number(action.payload.userId)
                action.payload.date = new Date().toISOString();
                action.payload.reactions = {
                    thumbsUp: 0,
                    wow: 0,
                    heart: 0,
                    rocket: 0,
                    coffee: 0
                }
                state.posts.push(action.payload)
                state.postIds.push(action.payload.id)
            })
    }
})

export const selectAllPosts = (state) => state.posts.posts;
export const getPostsStatus = (state) => state.posts.status;
export const getPostsError = (state) => state.posts.error;

export const { postAdded, reactionAdded } = postsSlice.actions;


export default postsSlice.reducer