import React from 'react'

import './CSS/index.css'
import './CSS/App.css'

import Signin from './Pages/signin.jsx'
import Login from './Pages/login.jsx'
import Nopage from './Pages/nopage.jsx'
import Hompepage from './Pages/homepage.jsx'
import UserProfile from './Pages/userprofile.jsx'
import SearchResult from './Pages/searchresult.jsx'
import Setting from './Pages/setting.jsx'
import { useState, useEffect } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { useNavigate } from 'react-router-dom'




function App() {

  /*

    const [usersList, setUsersList] = useState([]);
  

    useEffect(() => {
      fetchDataAndStoreInLocalStorage();
  }, []);

  const fetchDataAndStoreInLocalStorage = () => {
      fetch("http://localhost:4000/api/users")
          .then((res) => res.json())
          .then((data) => {
              console.log("Users list:", data); // Log the data received from the API
              setUsersList(data);

              // Store users data in localStorage
              localStorage.setItem("usersData", JSON.stringify(data));
          })
          .catch((err) => console.error(err));
  };


  <Route path= "/settings" element= {<Setting usersList={usersList} />}></Route>
  */

  return (
    
   <BrowserRouter>
        <Routes>
          <Route index element = {<Signin/>}></Route>
          <Route path="/signin" element={<Signin/>}></Route>
          <Route path="/login" element={<Login/>}></Route>
          <Route path="/homepage" element={<Hompepage/>}></Route>
         
          <Route path="/user/:activepage" element={<UserProfile/>}></Route>
          <Route path="/searchresult" element={<SearchResult/>}></Route>
          <Route path="*" element={<Nopage/>}></Route>
  
        </Routes>
   </BrowserRouter>
  
  )
}

export default App
