import { useState } from "react";
import stitchImg from "../Pictures/stitch.jpg"
import {Link,useNavigate} from "react-router-dom"



function Login(props) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const getUsername = (event) => { setUsername(event.target.value) }
    const getPassword = (event) => { setPassword(event.target.value) }

    const navigate = useNavigate();

    const loginUser = () => {

        fetch("http://localhost:4000/api/login", {

            method: "POST",
            body: JSON.stringify({
            username,
            password,   
            }),

        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((res) => res.json())

        .then((data) => {
            if (data.error_message) {
                alert(data.error_message);

            } else {
                alert(data.message);
                navigate("/homepage");
                localStorage.setItem("_id", data.id);
            }
        })
        .catch((err) => console.error(err));
    };  

    const handleSubmit = (evt) => {
        evt.preventDefault();
        loginUser();
        console.log("username",username);
        console.log("password",password)
        setUsername("");
        setPassword("");

    };


    return(
        <div >
        <form method = "post" className="form_login" onSubmit={handleSubmit} > 
        
        <div className="imgcontainer">
            <img src={stitchImg} alt="Avatar" className="avatar"></img>
        </div>

        <div className = "container_login">
            <label htmlFor="signin_login">Username</label>
            <input type="text" placeholder="Enter username" onChange={getUsername} value={username} required/>
            <label htmlFor="signin_mdp1">Password</label>
            <input type="password" id="mdp" placeholder="Enter password" onChange={getPassword} value={password} required/>
            <button type = "submit"> Login </button> 
            <Link to="/signin" > <button type = "signin"  className="secondary"> Not a member? Sign up  </button> </Link>

            </div>
        </form>
        </div>
    );
}

export default Login