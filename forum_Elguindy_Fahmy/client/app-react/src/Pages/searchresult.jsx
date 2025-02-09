import React, { useEffect, useState } from "react";
import { useSearchQuery } from "../Extras/Navbar/sqp";
import Likes from "../Extras/messages/likes";
import { useNavigate } from "react-router-dom";

function SearchResult() {
    const [searchResults, setSearchResults] = useState([]);
    const { searchQueryGlobal } = useSearchQuery();
    const [comments, setComments] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                const response = await fetch(`http://localhost:4000/api/search?searchQuery=${searchQueryGlobal}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch search results");
                }
                const data = await response.json();
                setSearchResults(data);
            } catch (error) {
                console.error("Error fetching search results:", error);
                // Handle error (e.g., show error message to the user)
            }
        };

        fetchSearchResults();
    }, [searchQueryGlobal]); // Empty dependency array ensures this effect runs only once when component is mounted
/*
    useEffect(() => {
        const checkUser = () => {
            if (!localStorage.getItem("_id")) {
                navigate("/");
            } else {
                console.log("Authenticated");
            }
        };
        checkUser();
    }, [navigate]);
    */

    const fetchComments = (threadId) => {
        fetch(`http://localhost:4000/api/thread/comments?threadId=${threadId}`)
            .then((res) => res.json())
            .then((data) => {
                // Store comments in state with threadId as key
                setComments(prevState => ({
                    ...prevState,
                    [threadId]: data
                }));
            })
            .catch((err) => console.error(err));
    };

    const handleCommentSubmit = (threadId) => (e) => {
        e.preventDefault();
        const content = e.target.comment.value;

        fetch("http://localhost:4000/api/thread/comment", {
            method: "POST",
            body: JSON.stringify({
                threadId,
                userId: localStorage.getItem("_id"),
                content,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                if (data.success) {
                    // Fetch updated comments and update state
                    fetchComments(threadId);
                    
                }
            })
            .catch((err) => console.error(err));
    };

    return (
        <div>
            <h2>Search Results</h2>

            <ul>
                {searchResults.map((thread) => (
                    <li key={thread.threadId}>
                        <p>Username: {thread.username}</p>
                        <p>Title: {thread.title}</p>
                        <p>Description: {thread.description}</p>
                        <Likes threadId={thread.threadId} />

                        <form onSubmit={handleCommentSubmit(thread.threadId)}>
                            <input type="text" name="comment" placeholder="Add a comment..." required />
                            <button type="submit">Comment</button>
                        </form>
            
                        {comments[thread.threadId] && comments[thread.threadId].map(comment => (
                            <div className="comment" key={comment.commentId}>
                                <p>
                                    Username : {comment.username}
                                    Comment : {comment.content}
                                    
                                </p>
                                {/* Display nested comments if applicable */}
                            </div>
                        ))}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SearchResult;