import "../CSS/settings.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


function Setting(props) {
    const [isadmin, setIsAdmin] = useState();
    const [adminpage, setAdminpage] = useState(true);
    const [usersList,setUsersList] = useState([]);
    
 
    const navigate= useNavigate()

    useEffect(() => {
        fetchUsers();
        
        fetchAdminStatus();
    }, [navigate]); // Fetch users on component mount


    useEffect(() => {
        const checkUser = () => {
            if (!localStorage.getItem("username")) {
                navigate("/");
            } else {
                console.log("Authenticated");
                
            }
        };
        checkUser();
    }, [navigate]);

    const fetchAdminStatus = async () => {
        try {
            const response = await fetch("http://localhost:4000/api/user/isAdminAndAdminPage", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId }) 
            });
    
            if (!response.ok) {
                throw new Error("Failed to fetch admin status");
            }
    
            const data = await response.json();
            setAdminpage(data.adminpage);
            setIsAdmin(data.isAdmin);
        } catch (error) {
            console.error("Error fetching admin status:", error.message);
        }
    };
    

    const handleCheckboxChange = (userId) => {
        const updatedUsersList = usersList.map(user => {
            if (user.userId === userId) {
                return { ...user, isAdmin: !user.isAdmin }; // Toggle isAdmin for the selected user
            }
            return user;
        });
        setUsersList(updatedUsersList);

        // Update isAdmin field in the backend
        fetch(`http://localhost:4000/api/approval/makeadmin/update`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ isAdmin: !updatedUsersList.find(user => user.userId === userId).isAdmin }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to update user");
            }
            console.log("User updated successfully");
        })
        .catch(error => console.error("Error updating user:", error));
    };

    const handleApprovedChange = (userId) => {
        const updatedUsersList = usersList.map(user => {
            if (user.userId === userId) {
                return { ...user, approved: !user.approved }; // Toggle approved for the selected user
            }
            return user;
        });
        setUsersList(updatedUsersList);

        // Update approved field in the backend
        fetch(`http://localhost:4000/api/approval/makeadmin/update`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ approved: !updatedUsersList.find(user => user.userId === userId).approved }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to update user");
            }
            console.log("User updated successfully");
        })
        .catch(error => console.error("Error updating user:", error));
    };

    const fetchUsers = () => {
        fetch("http://localhost:4000/api/users")
            .then((res) => res.json())
            .then((data) => {
                console.log("Users list:", data); // Log the data received from the API
                setUsersList(data);

            })
            .catch((err) => console.error(err));
    };

    const handleAdminpageChange = () => {
        setAdminpage(!adminpage);

        // Update adminpage field in the backend
        fetch("http://localhost:4000/api/adminpage/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ adminpage: !adminpage }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to update adminpage");
            }
            if (isLoading) {
                return <div>Loading...</div>;
            } else {
                console.log("Adminpage updated successfully");
            }
        })
        .catch(error => console.error("Error updating adminpage:", error));
    };


    return (
        <div>
            <label className="switch">
                <p className="admin">Admin mode</p>
                <input
                    type="checkbox"
                    checked={isadmin && adminpage}
                    onChange={handleAdminpageChange}
                    disabled={!isadmin}
                />
                <span className="slider round"></span>
            </label>
                    {adminpage && usersList
              
                    .map((user) => (
                        <div key={user.userId} className="user_admin">
                            
                            <p>User:{user.username}</p>
                            <label className="switch">
                                <p className="admin">{user.isAdmin ? "Revoke admin" : "Make admin"}</p>
                                <input
                                    type="checkbox"
                                    checked={user.isAdmin !== undefined ? user.isAdmin : false} 
                                    onChange={() => handleCheckboxChange(user.id)}
                                    disabled={!isadmin}
                                />
                                <span className="slider round"></span>
                            </label>
                            <label className="switch">
                                <p className="admin">{user.approved ? "Block him" : "Approve him"}</p>
                                <input
                                    type="checkbox"
                                    checked={user.approved !== undefined ? user.approved : false}
                                    onChange={() => handleApprovedChange(user.id)} // Call handleApprovedChange on change
                                    disabled={!isadmin}
                                />
                                <span className="slider round"></span>
                            </label>
                        </div>
                ))}

        </div>
    );
}

export default Setting;
