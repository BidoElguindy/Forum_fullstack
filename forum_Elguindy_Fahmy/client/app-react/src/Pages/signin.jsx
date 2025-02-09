import { useState } from 'react'
import stitchImg from "../Pictures/stitch.jpg"
import {Link,useNavigate} from "react-router-dom"


function Signin (props) {
	
	const [username, setUsername] = useState("");
	const [password, setPass1] = useState("");
	const [pass2, setPass2] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [passOK, setPassOK] = useState(true);
	const navigate = useNavigate();
	

	
	const getUsername = (evt) => {setUsername(evt.target.value)};
	const getFirstName = (evt) => {setFirstName(evt.target.value)};
	const getLastName = (evt) => {setLastName(evt.target.value)};
	const getPass1 = (evt) => {setPass1(evt.target.value)};
	const getPass2 = (evt) => {setPass2(evt.target.value)};

	const signUp = () => {

		fetch("http://localhost:4000/api/signin", {
			method: "POST",
			body: JSON.stringify({
				firstName,
				lastName,
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
                alert("Account created successfully!");
				localStorage.setItem("_id",data.userId);
				navigate("/login")
            }

        })
        .catch((err) => console.error(err));
	};
	
	const submissionHandler = (evt) => {

		evt.preventDefault();

		if (password === pass2) {
            setPassOK(true) 
        } else {
        setPassOK(false);
      	}
		signUp();
		setPass1("");
		setPass2("");
	  
	  
	}
		
	return (
	<div className="all">

		<form method="post" className="form_signin" onSubmit={submissionHandler}>
			<div className="imgcontainer">
				<img src={stitchImg} alt="Avatar" className="avatar"></img>
			</div>

			<div className = "container_signup">
				<label htmlFor="firstname">First name</label>
				<input type="text" placeholder="Enter first name" onChange={getFirstName } value={firstName} required/>

				<label htmlFor="lastname">Last name</label>
				<input type="text"  placeholder="Enter last name" onChange={getLastName} value={lastName}required/>

				<label htmlFor="signin_login">Username</label>
				<input type="text" placeholder="Enter username" onChange={getUsername} value={username}required/>

				<label htmlFor="signin_mdp1">New password</label>
				<input type="password" id="signin_mdp1" placeholder="Enter new password" onChange={getPass1} value={password}  required/>

				<label htmlFor="signin_mdp2">Confirm new password </label>
				<input type="password" id="signin_mdp2" placeholder="Confirm new password " onChange={getPass2} value={pass2} required/>

				<button>Sign up</button>

				<Link to ="/login" > <button type="login" className="secondary">Already a member? Login</button> </Link>

				{passOK ? <p></p>:<p style={{color:"red"}}>Erreur: mots de passe différents</p>}		
			</div>	
		</form>
	</div>
   );
}

export default Signin;