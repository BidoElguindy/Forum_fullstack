import React, { useState, useEffect } from "react";
import { useNavigate ,Link} from "react-router-dom";
import Navbar from "../Extras/Navbar/navbar";
import Likes from "../Extras/messages/likes";


function Homepage(props) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("Categories");
    const [subCategory, setSubCategory] = useState("General Discussion");
    const [threadList, setThreadList] = useState([]);
    const [comments, setComments] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const checkUser = () => {
            if (!localStorage.getItem("_id")) {
                navigate("/");
            } else {
                console.log("Authenticated");
            }
        };
        checkUser();
        fetchThreads(); 
    }, [navigate]);

    const fetchThreads = () => {
        fetch("http://localhost:4000/api/threads")
            .then((res) => res.json())
            .then((data) => {
                setThreadList(data);
                console.log("Threads",data)
                data.forEach(thread => {
                    fetchComments(thread.threadId); });
            })
            .catch((err) => console.error(err));
    };

    const fetchComments = (threadId) => {
        fetch(`http://localhost:4000/api/thread/comments?threadId=${threadId}`)
            .then((res) => res.json())
            .then((data) => {
                console.log("comments",data)
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

    const handleSubmit_post = (e) => {
        e.preventDefault();
        console.log("post just created ",{ title, description });
        createStitch();
        setTitle("");
        setDescription("");
    };

    const createStitch = () => {
        fetch("http://localhost:4000/api/create/stitch", {
            method: "POST",
            body: JSON.stringify({
                title,
                description,
                category,
                subCategory,
                userId: localStorage.getItem("_id"),
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                if (data.error_message) {
                    alert(data.error_message);
                } else {
                    alert(data.message);
                    if (data.threadId) {
                        const newThread = {
                            id: data.threadId,
                            title,
                            description,
                            category,
                            subCategory,
                            username: localStorage.getItem("username"),
                            userId: localStorage.getItem("_id"),
                            replies: [],
                            likes: [],
                        };
                        setThreadList((prevThreadList) => [newThread, ...prevThreadList]);
                        
                    }
                }
            })
            .catch((err) => console.error(err));
    };

    
    return (
        <div className="homepagediv">
            <Navbar />
            <form method="post" className="form_homepage" onSubmit={handleSubmit_post}>
                <div className="homepage_container">
                    <label htmlFor="thread" id="CAS">
                        Create a stitch
                    </label>
                    <input
                        type="text"
                        placeholder="Title of stitch"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <textarea
                        className="desc_homepage"
                        rows="10"
                        cols="53"
                        placeholder="I think th..."
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                    <select
                        name="Categories"
                        id="Cat_homepage"
                        onChange={(e) => setCategory(e.target.value)}
                        value={category}
                        required
                    >
                        <optgroup label="Categories">
                            <option value="Discussions">Discussions</option>
                            <option value="Ideas">Ideas</option>
                            <option value="Issues">Issues</option>
                            <option value="Questions">Questions</option>
                        </optgroup>
                    </select>
                    <select
                        name="Categories"
                        id="SubCat_homepageo"
                        onChange={(e) => setSubCategory(e.target.value)}
                        value={subCategory}
                        required
                    >
                        <optgroup label="Sub categories">
                            <option value="General Discussion">General Discussion</option>
                            <option value="Sports">Sports</option>
                            <option value="Politics">Politics</option>
                            <option value="Technology">Technology</option>
                            <option value="Entertainment">Entertainment</option>
                            <option value="Health and Fitness">Health and Fitness</option>
                            <option value="Education">Education</option>
                            <option value="Professional Development">Professional Development</option>
                            <option value="Travel">Travel</option>
                            <option value="Food">Food</option>
                            <option value="Science and Nature">Science and Nature</option>
                            <option value="Relationships">Relationships</option>
                        </optgroup>
                    </select>
                </div>
                <button className="homeBtn">Post stitch</button>
            </form>

            <div className="stitch__container">
                {threadList.map((thread) => (
                    <div className="stitch" key={thread.threadId}>
                        <p>Username: {thread.username}</p>
                        <p>Title: {thread.title}</p>
                        <p>Category: {thread.category}</p>
                        <p>Subcategory: {thread.subCategory}</p>
                        <p>Description: {thread.description}</p>
                        <Likes threadId={thread.threadId} />
                        <form onSubmit={handleCommentSubmit(thread.threadId)}>
                            <input type="text" name="comment" placeholder="Add a comment..." required />
                            <button type="submit">Comment</button>
                        </form>
            
                        {comments[thread.threadId] && comments[thread.threadId].map(comment => (
                            <div className="comment" key={comment.commentId}>
                                <p>{comment.content}</p>
                                {/* Display nested comments if applicable */}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Homepage;
