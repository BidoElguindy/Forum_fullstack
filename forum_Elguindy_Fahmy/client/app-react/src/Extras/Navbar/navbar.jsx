import React, { useState } from "react";
import {useNavigate} from "react-router-dom"
import { useSearchQuery } from "./sqp";



function Navbar(props) {
    const [searchQuery, setSearchQuery] = useState("");
    const { searchQueryGlobal, setSearchQueryGlobal } = useSearchQuery();
    const navigate = useNavigate();


    const signOut = () => {
        alert("User signed out!");
        localStorage.removeItem("_id");
        navigate("/");
    };
    const handleSearch = async (e) => {
        e.preventDefault();
        try {
             // Accessing the input field's value directly from the event
            setSearchQueryGlobal(searchQuery);
            const response = await fetch(`http://localhost:4000/api/search?searchQuery=${searchQuery}`);
            if (!response.ok) {
                throw new Error("Failed to fetch search results");
            }
            const data = await response.json();
            // Handle the received search results here, such as navigating to a SearchResult component
            // For now, let's just log the data to the console
            console.log(data);
            navigate("/searchresult");
        } catch (error) {
            console.error("Error fetching search results:", error);
            // Handle error (e.g., show error message to the user)
        }
    };
    

    return (

        <div >
           
            <nav className="navmain">
        
                <a href="/homepage" className="site-title">STFF</a>
                <form onSubmit={handleSearch}>
                <input type="text" name="search" placeholder="Search.."  value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} ></input>
                </form>

                <ul>
                        <li> <a href ="/user/accountsettings">Profile</a></li>
                        <li><a href ="/settings">Setting</a></li>
                        <li><a onClick={signOut}>Logout</a></li>
                   
                </ul>
            </nav>
        </div>

    )

}


export default Navbar;