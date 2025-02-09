import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Yourthreads = ({ userId }) => {
  const [threads, setThreads] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchThreads();
  }, [userId]);

  const fetchThreads = () => {
    fetch(`http://localhost:4000/api/user/threads?userId=${localStorage.getItem("_id")}`)
      .then((res) => res.json())
      .then((data) => {
        setThreads(data);
        console.log("Your threads",data);
      })
      .catch((err) => console.error(err));
  };

  const handleDelete = async (threadId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this thread?");
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:4000/api/delete/threadAndUser?threadId=${threadId}&userId=${localStorage.getItem("_id")}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
        });
        if (response.ok) {
          // Remove the deleted thread from the local state
          setThreads((prevThreads) => prevThreads.filter(thread => thread.threadId !== threadId));
          console.log("Thread deleted successfully.");
        } else {
          console.error("Failed to delete thread.");
        }
      } catch (error) {
        console.error("Error deleting thread:", error);
      }
    }
  };

  return (
    <div>
       <h1 className= 'mainhead1'> Your Threads</h1>
      <ul>
        {threads.map((thread) => (
          <div className="mythreads" key={thread.threadId}>
            <p>{thread.title}</p>
            <p>{thread.description}</p>
            <p>{thread.category}</p>
            <p>{thread.subCategory}</p>
            <button onClick={() => handleDelete(thread.threadId)}>Delete</button>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default Yourthreads;
