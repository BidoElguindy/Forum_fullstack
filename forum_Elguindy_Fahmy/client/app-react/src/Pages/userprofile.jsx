import React from 'react'
import { useParams,useNavigate } from 'react-router-dom'
import Navbar from '../Extras/Navbar/navbar.jsx'
import AccountSettings from '../Extras/UserProfile/accountsettings.jsx'
import UserSidebar from '../Extras/UserProfile/usersidebar.jsx'
import YourThreads from '../Extras/UserProfile/yourthreads.jsx'
import ChangePassword from '../Extras/UserProfile/changepassword.jsx'
import { useEffect } from 'react'

const userprofile = () => {
    const {activepage} = useParams();
    const userId= localStorage.getItem("_id");
    const navigate=useNavigate();


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

    //alert(activepage)
  return (
    <div className= 'userprofile'>
        <Navbar/>
        <h1>My Profile</h1>  
        <div className= 'userprofilein'>
            <div className= 'left'>
                <UserSidebar activepage={activepage}/>
            </div>
            <div className= 'right'>
                {activepage === 'accountsettings' && <AccountSettings/>}
                {activepage === 'yourthreads' && <YourThreads userId={userId}/>}
                {activepage === 'changepassword' && <ChangePassword/>}
            </div>

        </div>
    </div>
  )
}

export default userprofile