import React, { useState, useEffect } from 'react';
import './App.css';
import { useSwipeable } from 'react-swipeable'; 
import UserManagement from './components/UserManagement';
import BarManagement from './components/BarManagement';
import StockManagement from './components/StockManagement';
import SalesEntry from './components/SalesEntry';
import UnpaidStock from './components/UnpaidStock';
import Reports from './components/Reports';
import IndicationBar from './components/IndicationBar';
import { auth } from './database/firebase'; // Firebase initialization
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
//import { addItem } from './database/indexedDB';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('UnpaidStock');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState(''); // For display name
  const [phoneNumber, setPhoneNumber] = useState(''); // For phone number
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false); // State to toggle between login and signup modes
  const [responseMessage, setResponseMessage] = useState(''); // State to show response

  // Firebase authentication listener//
  useEffect(() => {
    //document.cookie = "myCookie=value; SameSite=None; Secure";
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUser(user);
        setResponseMessage(`Welcome, ${user.email}!`);
        // Add session data to IndexedDB
        const sessionData = {
          sessionId: `session-${Date.now()}`,
          userId: user.uid,
          action: 'login',
          timestamp: new Date().toISOString(),
        };
        //await addItem('sessions', [sessionData]);
      } else {
        setIsLoggedIn(false);
        setUser(null);
        setResponseMessage('');
        // Optionally, trigger sync after logout
        //await syncData();
      }
    });

    return () => unsubscribe(); // Cleanup on component unmount
  }, []);

  // Handle email/password sign-up
  const handleSimpleSignUp = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: displayName, // Set the display name
        phoneNumber: phoneNumber, // Set the phone number (not directly stored in auth, but can be in database)
      });
      setUser(userCredential.user);
      setResponseMessage(`Sign-up successful! Welcome, ${displayName || userCredential.user.email}`);
      setError(''); // Clear error on success
      
      // Log user details on sign-up
      console.log('Sign-up User Details:', userCredential.user);
    } catch (err) {
      console.error('Sign-up error:', err); // Log the full error details for debugging
      setError(`Failed to Sign Up. Error: ${err.message}`);
      setResponseMessage(''); // Clear response message on error
    }
  };

  // Handle email/password login
  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("User details ");
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      setResponseMessage(`Login successful! Welcome back, ${user.email}`);
      // Log user details on login     
      //setUserDetails(userCredential.user);
    } catch (err) {
      setError('Failed to log in. Please check your credentials.');
      setResponseMessage(''); // Clear response message on error
    }
    
  };

  // Handle Logout
  const handleLogout = async () => {
    
    try {
      await signOut(auth); // Sign out from Firebase
      setIsLoggedIn(false); // Update state to reflect logout
      setUser(null); // Clear user state
      console.log('User logged out successfully.');
    } catch (err) {
      console.error('Error during logout:', err);
    }
  };

  // Toggle to sign-up mode
  const handleSignUpClick = () => {
    setIsSignUp(true); // Switch to sign-up mode
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => handleSwiped('left'),
    onSwipedRight: () => handleSwiped('right'),
    trackTouch: true, 
    trackMouse: true, 
  });

  // Handle Google login
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setUser(user);
      console.log(user);
      setResponseMessage(`Login successful! Welcome, ${user.displayName}`);
    } catch (error) {
      setError('Failed to log in with Google. Please try again.');
    }
  };

  const handleSwiped = (direction) => {
    switch (currentScreen) {
      case 'UserManagement':
        if (direction === 'left') setCurrentScreen('BarManagement');
        if (direction === 'right') setCurrentScreen('Reports');
        break;
      case 'BarManagement':
        if (direction === 'right') setCurrentScreen('UserManagement');
        else if (direction === 'left') setCurrentScreen('StockManagement');
        break;
      case 'StockManagement':
        if (direction === 'right') setCurrentScreen('BarManagement');
        else if (direction === 'left') setCurrentScreen('SalesEntry');
        break;
      case 'SalesEntry':
        if (direction === 'right') setCurrentScreen('StockManagement');
        else if (direction === 'left') setCurrentScreen('UnpaidStock');
        break;
      case 'UnpaidStock':
        if (direction === 'right') setCurrentScreen('SalesEntry');
        else if (direction === 'left') setCurrentScreen('Reports');
        break;
      case 'Reports':
        if (direction === 'right') setCurrentScreen('UnpaidStock');
        else if (direction === 'left') setCurrentScreen('UserManagement');
        break;
      default:
        break;
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'UserManagement':
        return <UserManagement />;
      case 'BarManagement':
        return <BarManagement />;
      case 'StockManagement':
        return <StockManagement />;
      case 'SalesEntry':
        return <SalesEntry />;
      case 'UnpaidStock':
        return <UnpaidStock />;
      case 'Reports':
        return <Reports />;
      default:
        return <UserManagement />;
    }
  };

  // Show login form if user is not logged in
  if (!isLoggedIn) {
    return (
      <div style={{ textAlign: 'center', marginTop: '20%' }}>
        <h1>{isSignUp ? 'Sign Up for the application' : 'Login to access the application'}</h1>
        
        {/* Change onSubmit based on the isSignUp state */}
        <form onSubmit={isSignUp ? handleSimpleSignUp : handleLogin} style={{ margin: '20px' }}>
          {isSignUp && (
            <div>
              <input 
                type="text" 
                placeholder="Display Name" 
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)} 
                required 
                style={{ margin: '10px', padding: '8px' }}
              />
            </div>
          )}
          {isSignUp && (
            <div>
              <input 
                type="tel" 
                placeholder="Phone Number" 
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)} 
                required 
                style={{ margin: '10px', padding: '8px' }}
              />
            </div>
          )}
          <div>
            <input 
              type="email" 
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              required 
              style={{ margin: '10px', padding: '8px' }}
            />
          </div>
          <div>
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              required 
              style={{ margin: '10px', padding: '8px' }}
            />
          </div>
        
        <button 
          onClick={handleGoogleLogin} 
          style={{ padding: '8px 16px', margin: '20px', backgroundColor: '#4285F4', color: 'white' }}
        >
          Log in with Google
        </button>
          <button type="submit" style={{ padding: '8px 16px', marginTop: '10px' }}>
            {isSignUp ? 'Sign Up' : 'Log In'}
          </button>
        </form>

        {/* Show response message or error */}
        {responseMessage && <p style={{ color: 'green' }}>{responseMessage}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        {/* Sign Up button */}
        {!isSignUp && (
          <button 
            id="signupbtn" 
            onClick={handleSignUpClick} // Switch to sign-up mode
            style={{ padding: '8px 16px', background: '#4285F4', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            Sign Up
          </button>
        )}
      </div>
    );
  }

  // Show main content if the user is logged in
  return (    
    <div {...handlers} style={{ width: '100%', height: '100vh' }}>

    <button 
        onClick={handleLogout}
        style={{ position: 'absolute', top: '10px', right: '10px', padding: '10px 20px', background: '#ff4d4d', color: '#fff', border: 'none', borderRadius: '5px' }}
      >
        Logout
      </button>
      
      {/* Main content */}
      <IndicationBar user={user || { displayName: '', email: '' }} />
      {renderScreen()}
    </div>
  );
};

export default App;
