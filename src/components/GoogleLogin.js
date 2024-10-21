import React from 'react';
import {handleFacebookLogin,handleLogout,handleGoogleLogin} from './login'

const GoogleLogin = () => {
    return (
      <div className="googeleLogin">
        <button onClick={handleGoogleLogin}  style={{ padding: '8px 16px', margin: '20px', backgroundColor: '#4285F4', color: 'white' }}
        >Log in with Google</button>
        <button  onClick={handleFacebookLogin}style={{ padding: '8px 16px', margin: '20px', backgroundColor: '#4285F4', color: 'white' }}
        > Login with Facebook</button>
          <button onClick={handleLogout} style={{ padding: '10px 20px', background: '#ff4d4d', color: '#fff', border: 'none', borderRadius: '5px' }}
      > Logout </button>
    
        </div>
    );
  };
  
  export default GoogleLogin;
  
