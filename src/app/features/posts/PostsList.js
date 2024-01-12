import { useSelector, useDispatch } from "react-redux";
import { selectAllPosts, getPostsStatus, getPostsError, fetchPosts } from "./postsSlice";
import { useEffect } from "react";

import React from 'react'
import PostExcerpt from "./PostExcerpt";


const PostsList = () => {

    const dispatch = useDispatch()

    const posts = useSelector(selectAllPosts)
    const postStatus = useSelector(getPostsStatus)
    const error = useSelector(getPostsError)

    useEffect(() => {
        if (postStatus === 'idle'){
            dispatch(fetchPosts())
        }
    },[postStatus, dispatch])

    let content;
    if(postStatus === "loading"){
        content = <p>Loading ...</p>
    }
    else if(postStatus === "succeeded"){
        const orderedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date))
        console.log(orderedPosts)
        content = orderedPosts.map(post => 
            <PostExcerpt  post = {post}/>
        )
    }
    else if(postStatus === "failed"){
        content = <p>{error}</p>
    }




    return (
        <section>
            <h2>Posts</h2>
            {content}
        </section>
    )
}

export default PostsList