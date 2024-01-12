import React from 'react'

import PostAuthor from "./postAuthor";
import PostTime from "./PostTime";
import ReactionButtons from "./ReactionButtons";


const PostExcerpt = ({ post }) => {
    return (
        <article >
            <h3>{post.title}</h3>
            <p>{post.body ?? "".substring(0, 100)}</p>
            <p className="postCredit">
                <PostAuthor
                    userId={post.userId}>
                </PostAuthor>
                <PostTime timestamp={post.date}></PostTime>
            </p>
            <ReactionButtons post={post} />
        </article>
    )
}

export default PostExcerpt