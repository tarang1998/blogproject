import { useSelector } from "react-redux";
import { selectAllPosts } from "./postsSlice";

import React from 'react'
import PostAuthor from "./postAuthor";
import PostTime from "./PostTime";
import ReactionButtons from "./ReactionButtons";


const PostsList = () => {

    const posts = useSelector(selectAllPosts)

    const orderedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date))


    const renderPosts = orderedPosts.map(post => (
        <article key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.content.substring(0, 100)}</p>
            <p className="postCredit">
                <PostAuthor
                    userId={post.userId}>
                </PostAuthor>
                <PostTime timestamp={post.date}></PostTime>
            </p>
            <ReactionButtons post={post} />
        </article>
    ))


    return (
        <section>
            <h2>Posts</h2>
            {renderPosts}
        </section>
    )
}

export default PostsList