import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function Reply({ props }) {
    const { threadId } = useParams(); // Correct usage of useParams
    const [replies, setReplies] = useState([]);
    const [newReply, setNewReply] = useState("");

    useEffect(() => {
        fetch(`http://localhost:4000/api/replies?threadId=${threadId}`)
            .then((res) => res.json())
            .then((data) => {
                setReplies(data);
                console.log(threadId)
            })
            .catch((err) => console.error(err));
    }, [threadId]);

   

    const addReply = () => {
        // Call API to add reply
        fetch("http://localhost:4000/api/add/reply", {
            method: "POST",
            body: JSON.stringify({
                threadId,
                reply: newReply,
                userId: localStorage.getItem("_id"),
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                if (data.success) {
                    setReplies((prevRepliesList) => [newReply, ...prevRepliesList]);
                    setNewReply(""); // Clear the input field
                } else {
                    alert("Failed to add reply");
                }
            })
            .catch((err) => console.error(err));
    };

    return (
        <div>
     
            {replies.map((reply, index) => (
                <div key={index}>{reply}</div>
            ))}
            <input type="text" value={newReply} onChange={(e) => setNewReply(e.target.value)} />
            <button onClick={addReply}>Add Reply</button>
        </div>
    );
}

export default Reply;
