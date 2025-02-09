import React from 'react'
import '../../CSS/accountsettings.css'

const accountsettings = () => {
  return (
    <div className= 'accsettings'>
      <h1 className= 'mainhead1'> Personal Information</h1>

      <div className= 'form'> 
        <div className= 'form-group'>
          <label htmlFor = 'name' > First Name <span>*</span></label>
          <input type = 'text' name ='name' id = 'firstname'/>
        </div>

        <div className= 'form-group'>
          <label htmlFor = 'name' > Last Name <span>*</span></label>
          <input type = 'text' name ='name' id = 'lastname'/>
        </div>
        
        <div className= 'form-group'>
          <label htmlFor = 'username' > Username <span>*</span></label>
          <input type = 'text' name ='username' id = 'username'/>
        </div>

      </div>
      <button className= 'mainbutton1'> Save Changes </button>
    </div>
  )
}

export default accountsettings