import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { SearchQueryProvider } from './Extras/Navbar/sqp.jsx';
//import { UserProvider } from './Extras/UserProfile/uc.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<SearchQueryProvider> <App /> </SearchQueryProvider>);
