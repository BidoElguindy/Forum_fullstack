import React, { useState, useEffect } from "react";

const Likes = ({ threadId }) => {
    const [numberOfLikes, setNumberOfLikes] = useState(0);
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        // Fetch the like status and count for the current user
        fetch(`http://localhost:4000/api/like/status?threadId=${threadId}&userId=${localStorage.getItem("_id")}`)
            .then((res) => res.json())
            .then((data) => {
                setNumberOfLikes(data.likesCount);
                setLiked(data.liked);
            })
            .catch((err) => console.error(err));
    }, [threadId]);

    const handleLike = () => {
        const likeAction = liked ? "unlike" : "like"; // Determine whether to like or unlike
        fetch("http://localhost:4000/api/like/thread", {
            method: "POST",
            body: JSON.stringify({
                threadId,
                userId: localStorage.getItem("_id"),
                action: likeAction, // Send the action to the backend
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setNumberOfLikes(liked ? numberOfLikes - 1 : numberOfLikes + 1); // Update the like count
                    setLiked(!liked); // Toggle liked state
                }
            })
            .catch((err) => console.error(err));
    };

    return (
        <div className='likes__container'>
            <button className="likesBtn" onClick={handleLike}>
                {liked ? "Unlike" : "Like"}
            </button>
            <p style={{ color: "rgb(113, 191, 183)" }}>{numberOfLikes === 0 ? "" : numberOfLikes}</p>
        </div>
    );
};

export default Likes;
