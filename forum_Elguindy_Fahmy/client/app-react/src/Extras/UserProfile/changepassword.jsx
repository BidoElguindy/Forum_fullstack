import React from 'react'
import '../../CSS/accountsettings.css'

const changepassword = () => {
  return (
    <div className= 'accsettings'>
        <h1 className= 'mainhead1'> Password Modification</h1>

        <div className= 'form'> 
            <div className= 'form-group'>
                <label htmlFor = 'oldpassword'> Old Password <span>*</span></label>
                <input type = 'password' name ='oldpassword' id = 'oldpassword'/>
            </div>

            <div className= 'form-group'>
                <label htmlFor = 'newpassword'> New Password <span>*</span></label>
                <input type = 'password' name ='newpassword' id = 'newpassword'/>
            </div>

        </div>
        <button className= 'mainbutton1'> Save Changes </button>
  </div>
  )
}

export default changepassword