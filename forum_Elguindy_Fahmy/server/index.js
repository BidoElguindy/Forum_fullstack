const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient } = require('mongodb');
const PORT = 4000;
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.listen(PORT, async () => {
    try {
        await client.connect();
        console.log(`Server listening on ${PORT}`);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
});



app. get('/', (req, res) =>{
    res. json({
    message: 'test postman'
    });
    }) ;


const generateID = () => Math.random().toString(36).substring(2, 10);


// generates a random string as ID

app.post("/api/signin", async (req, res) => {
    const { firstName, lastName, username, password } = req.body;
    const id = generateID();

    console.log({ firstName, lastName, username, password, id });
    
    try {
        const userCollection = client.db("Forum").collection("Users");
        const existingUser = await userCollection.findOne({ username });

        if (existingUser) {
            return res.status(400).json({ error_message: "User already exists" });
        }

        const newUser = { firstName, lastName, username, password, id, ownthreads: [] };
        await userCollection.insertOne(newUser);
        res.json({ message: "Account created successfully!" });
    } catch (error) {
        console.error("Error creating account:", error);
        res.status(500).json({ error_message: "Internal server error" });
    }
});

app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const userCollection = client.db("Forum").collection("Users");
        const user = await userCollection.findOne({ username, password });

        if (!user) {
            return res.json({ error_message: "Incorrect credentials" });
        }

        res.json({ message: "Login successfully", id: user.id });
        console.log({ username, password } );
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ error_message: "Internal server error" });
    }
});

app.post("/api/create/stitch", async (req, res) => {
    const { title, description, category, subCategory, userId } = req.body;
    const threadId = generateID();
    const timestamp = new Date();

    try {
        const userCollection = client.db("Forum").collection("Users");
        const user = await userCollection.findOne({ id: userId });

        if (!user) {
            return res.status(404).json({ error_message: "User not found" });
        }

        const threadCollection = client.db("Forum").collection("Threads");

        const newthread = {
            threadId: threadId,
            title,
            description,
            category,
            subCategory,
            username: user.username,
            userId,
            timestamp,
            comments: [],
            likes: [],
        }

        await threadCollection.insertOne(newthread);

        console.log({ title, description, category, subCategory, userId, threadId });

        await userCollection.updateOne(
            { id: userId },
            {
                $push: {
                    "ownthreads": newthread,
                }
            }
        );

        res.status(200).json({
            message: "Stitch created successfully!",
            threadId: threadId,
        });

    } catch (error) {
        console.error("Error creating stitch:", error);
        res.status(500).json({ error_message: "Internal server error" });
    }
});


// Endpoint to get all threads sorted by latest posted
app.get("/api/threads", async (req, res) => {
    try {
        const threadCollection = client.db("Forum").collection("Threads");
        // Sort threads by the timestamp of when they were created in descending order
        const threads = await threadCollection.find({}).sort({ timestamp: -1 }).toArray();
        res.status(200).json(threads);
    } catch (error) {
        console.error("Error getting threads:", error);
        res.status(500).json({ error_message: "Internal server error" });
    }
});


// Add a new endpoint to get like status and count for a thread
app.get("/api/like/status", async (req, res) => {
    const { threadId, userId } = req.query;

    try {
        const threadCollection = client.db("Forum").collection("Threads");
        const thread = await threadCollection.findOne({ threadId });

        if (!thread) {
            return res.status(404).json({ error_message: "Thread not found" });
        }

        const likesCount = thread.likes.length;
        const liked = thread.likes.includes(userId);

        res.status(200).json({ likesCount, liked });
    } catch (error) {
        console.error("Error getting like status:", error);
        res.status(500).json({ error_message: "Internal server error" });
    }
});


// Modify the /api/like/thread endpoint to handle unliking as well
app.post("/api/like/thread", async (req, res) => {
    const { threadId, userId } = req.body;

    try {
        const threadCollection = client.db("Forum").collection("Threads");
        const thread = await threadCollection.findOne({ threadId });

        if (!thread) {
            return res.status(404).json({ error_message: "Thread not found" });
        }

        const likedIndex = thread.likes.indexOf(userId);
        if (likedIndex === -1) {
            // User hasn't liked the thread yet, so like it
            thread.likes.push(userId);
            await threadCollection.updateOne({ threadId }, { $set: { likes: thread.likes } });
            return res.status(200).json({ success: true });
        } else {
            // User has liked the thread, so unlike it
            thread.likes.splice(likedIndex, 1);
            await threadCollection.updateOne({ threadId }, { $set: { likes: thread.likes } });
            return res.status(200).json({ success: true });
        }
    } catch (error) {
        console.error("Error liking/unliking thread:", error);
        res.status(500).json({ error_message: "Internal server error" });
    }
});


// Endpoint to add a comment to a thread
app.post("/api/thread/comment", async (req, res) => {
    const { threadId, userId, content, parentCommentId } = req.body;

    try {
        const threadCollection = client.db("Forum").collection("Threads");
        const commentId = generateID();
        const timestamp = new Date();

        const userCollection = client.db("Forum").collection("Users");
        const user = await userCollection.findOne({ id: userId });

        if (!user) {
            return res.status(404).json({ error_message: "User not found" });
        }

        // Create a new comment object
        const newComment = {
            commentId,
            userId,
            username: user.username,
            content,
            timestamp,
            replies: [], // If nested comments are supported
        };

        // Find the thread and update the 'comments' array
        await threadCollection.updateOne(
            { threadId },
            {
                $push: {
                    "comments": newComment,
                }
            }
        );

        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ error_message: "Internal server error" });
    }
});

// Endpoint to fetch comments for a thread
app.get("/api/thread/comments", async (req, res) => {
    const { threadId } = req.query;

    try {
        const threadCollection = client.db("Forum").collection("Threads");
        const thread = await threadCollection.findOne({ threadId });

        if (!thread) {
            return res.status(404).json({ error_message: "Thread not found" });
        }

        const comments = thread.comments;
        res.status(200).json(comments);
    } catch (error) {
        console.error("Error getting comments:", error);
        res.status(500).json({ error_message: "Internal server error" });
    }
});



//Endpoint to fetch user's threads
app.get("/api/user/threads", async (req, res) => {
    const { userId } = req.query; // Use req.query to access query parameters
  
    try {
      const userCollection = client.db("Forum").collection("Users");
      const user = await userCollection.findOne({ id: userId });
  
      if (!user) {
        return res.status(404).json({ error_message: "User not found" });
      }
  
      const userThreads = user.ownthreads || [];
      console.log("User Threads:", userThreads); // Log user threads for debugging
      res.status(200).json(userThreads);
    } catch (error) {
      console.error("Error fetching user threads:", error);
      res.status(500).json({ error_message: "Internal server error" });
    }
});

// Endpoint to delete a thread
app.delete("/api/delete/threadAndUser", async (req, res) => {
    const {threadId,userId} = req.query;
  
    try {
        // Delete the thread from the Threads collection
        const threadCollection = client.db("Forum").collection("Threads");
        await threadCollection.deleteOne({ threadId });
    
        // Remove the thread from the user's ownthreads array
        const userCollection = client.db("Forum").collection("Users");
        results = await userCollection.updateOne(
          { id: userId },
          { $pull: { ownthreads: { threadId: threadId } } } 
        );
     
      console.log("User ID:", userId);
      console.log("Thread ID:", threadId);
      console.log("Update result:", results);


      res.status(200).json({ message: "Thread deleted successfully." });
    } catch (error) {
      console.error("Error deleting thread:", error);
      res.status(500).json({ error_message: "Internal server error" });
    }
  });


const isValidDate = (dateString) => {
    // Check if the given string can be parsed as a Date object
    const date = new Date(dateString);
    // Check if the parsed date is a valid date and not "Invalid Date"
    return !isNaN(date.getTime());
};

app.get("/api/search", async (req, res) => {
    const { searchQuery } = req.query;

    try {
        const threadCollection = client.db("Forum").collection("Threads");
        const userCollection = client.db("Forum").collection("Users");
        const query = {};

        // Determine the type of search based on the searchQuery parameter
        if (searchQuery) {
            // Check if the searchQuery matches a date format
            if (isValidDate(searchQuery)) {
                // Parse the searchQuery into a Date object
                const searchDate = new Date(searchQuery);
                // Get the start and end of the search day
                const startDate = new Date(searchDate.getFullYear(), searchDate.getMonth(), searchDate.getDate());
                const endDate = new Date(searchDate.getFullYear(), searchDate.getMonth(), searchDate.getDate() + 1);
                // Set up the query to find threads created within the search day
                query.timestamp = { $gte: startDate, $lt: endDate };
            } else {
                // Check if the searchQuery matches a username
                const user = await userCollection.findOne({ username: searchQuery });
                if (user) {
                    // If searchQuery is a username, add all threads created by that user to the search results
                    query.userId = user.userId;
                } else {
                    // If searchQuery is not a valid date or a username, assume it's keywords for title or description
                    query.$or = [
                        { title: { $regex: searchQuery, $options: "i" } }, // Case-insensitive search in title
                        { description: { $regex: searchQuery, $options: "i" } }, // Case-insensitive search in description
                    ];
                }
            }
        }
        console.log(query);
        // Execute the query to fetch search results
        const searchResults = await threadCollection.find(query).toArray();
        console.log(searchResults);
        // Return the search results
        res.status(200).json(searchResults);
        
    } catch (error) {
        console.error("Error performing search:", error);
        res.status(500).json({ error_message: "Internal server error" });
    }
});



app.get("/api/error404", (req, res) => {
    const errorResponse = {
        imageUrl: "/static/sadstitch2.png", // Image URL relative to the static directory
        errorMessage: "Error 404: Page not found"
    };
    res.status(404).json(errorResponse);
});


//Endpoint to fetch user's threads
app.get("/api/user/threads", async (req, res) => {
    const { userId } = req.query; // Use req.query to access query parameters
  
    try {
      const userCollection = client.db("Forum").collection("Users");
      const user = await userCollection.findOne({ userId: userId });
  
      if (!user) {
        return res.status(404).json({ error_message: "User not found" });
      }
  
      const userThreads = user.ownthreads || [];
      console.log("User Threads:", userThreads); // Log user threads for debugging
      res.status(200).json(userThreads);
    } catch (error) {
      console.error("Error fetching user threads:", error);
      res.status(500).json({ error_message: "Internal server error" });
    }
});


// Endpoint to delete a thread
app.delete("/api/delete/threadAndUser", async (req, res) => {
    const {threadId,userId} = req.query;
  
    try {
        // Delete the thread from the Threads collection
        const threadCollection = client.db("Forum").collection("Threads");
        await threadCollection.deleteOne({ threadId });
    
        // Remove the thread from the user's ownthreads array
        const userCollection = client.db("Forum").collection("Users");
        results = await userCollection.updateOne(
          { userId: userId },
          { $pull: { ownthreads: { threadId: threadId } } } 
        );
     
      console.log("User ID:", userId);
      console.log("Thread ID:", threadId);
      console.log("Update result:", results);


      res.status(200).json({ message: "Thread deleted successfully." });
    } catch (error) {
      console.error("Error deleting thread:", error);
      res.status(500).json({ error_message: "Internal server error" });
    }
  });


app.post("/api/approval/makeadmin/update", async (req, res) => {
    const { userId, isAdmin, approved } = req.body;

    try {
        console.log("Received request body:", req.body); // Add logging here
        console.log("Current user ID:", req.session.userId); // Add logging here

        const userCollection = client.db("Forum").collection("Users");
        const user = await userCollection.findOne({ userId: userId });

        if (!user) {
            return res.status(404).json({ error_message: "User not found" });
        }

        // Update isAdmin and approved fields in the user document
        await userCollection.updateOne(
            { userId: userId },
            {
                $set: {
                    isAdmin: isAdmin, // Update isAdmin field
                    approved: approved, // Update approved field
                }
            }
        );

        res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error_message: "Internal server error" });
    }
});

app.post("/api/adminpage/update", async (req, res) => {
    const { userId, adminpage } = req.body;

    try {
        console.log("Received request body:", req.body); // Add logging here
        console.log("Current user ID:", req.session.userId); // Add logging here
        const userCollection = client.db("Forum").collection("Users");
        const user = await userCollection.findOne({ userId: userId });

        if (!user) {
            return res.status(404).json({ error_message: "User not found" });
        }

        // Update adminpage field in the user document
        await userCollection.updateOne(
            { userId: userId },
            {
                $set: {
                    adminpage: adminpage, // Update adminpage field
                }
            }
        );

        res.status(200).json({ message: "Admin page updated successfully" });
    } catch (error) {
        console.error("Error updating admin page:", error);
        res.status(500).json({ error_message: "Internal server error" });
    }
});



// Endpoint to get isAdmin and adminpage fields from Users collection
app.get("/api/user/isAdminAndAdminPage", async (req, res) => {
    const { userId } = req.query; // Use req.query to access query parameters

    try {
        const userCollection = client.db("Forum").collection("Users");
        const user = await userCollection.findOne({ username: userId });

        if (!user) {
            return res.status(404).json({ error_message: "User not found" });
        }

        // Extract isAdmin and adminpage fields from user document
        const isAdmin = user.isAdmin;
        const adminpage = user.adminpage;

        res.status(200).json({ isAdmin, adminpage });
    } catch (error) {
        console.error("Error fetching isAdmin and adminpage fields", error);
        res.status(500).json({ error_message: "Internal server error" });
    }
});
