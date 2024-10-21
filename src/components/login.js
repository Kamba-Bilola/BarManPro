import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUserState, setConfset } from '../redux/slices/globalStateSlice';
import { auth } from '../database/firebase'; // Firebase initialization
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from 'firebase/auth';
import {handleAddToDatastoreObject,handleRemoveDatabase,handleClearData,createDatabase, appDefaultConfData, addToObjectStoreExec,checkIfDatabaseExists,clearAllDataExec, removeDatabaseExec, getLastIdAndSet } from '../database/indexedDB';

// Handle Google login
export const handleGoogleLogin = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;    
    const userData = {
      uid: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL,
      email: user.email,
      createdAt:Date.now(),
      lastLoginAt:user.metadata.lastLoginAt,
      barControled: null,
      lastLoginAt: user.metadata.lastLoginAt,
      fullName: null,
      phone: null,
      password: null,
      role: null,
      Subscription: null
    };
    console.log('Google user:', userData);
    console.log(`Login successful! Welcome, ${userData.displayName}`);
    // Save user data to IndexedDB
    handleAddToDatastoreObject("Users", userData, user.uid);
    console.log("just here");
    const firstSes = addFirstSession(userData);    
    window.location.reload();
  } catch (error) {
    return false;
    console.log('Failed to log in with Google. Please try again.');
  }
  
};


// Handle first Session
export const addFirstSession = async (userData) => {
  try {
    const firstSessionData = {
      barId: null,
      userId: userData.uid,
      sessionStart:Date.now(),
      sessionEnd: null,
      saleStart: null,
      saleEnd: null,
      totalSales: null,
      itemsSold: null,
      status: "logged In",
      dailySalesReportId: null,
      sessionReportId: null,
      itemSalesReportId: null,
      stockReportId: null,
    };
    const nextId = await getLastIdAndSet('Sessions');
    console.log(`Next ID to use: ${nextId}`);
    // Await the datastore function to ensure it's completed
    handleAddToDatastoreObject("Sessions", firstSessionData,nextId);

    // Return true if the operation succeeds
    console.log('First session set');
    return true;

  } catch (error) {
    console.log('Failed to set First login details:', error);

    // Return false in case of error
    return false;
  }
};



// Handle Facebook login
export const handleFacebookLogin = async () => {
  const provider = new FacebookAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log('Facebook user:', user);
    console.log(`Login successful! Welcome, ${user.displayName}`);
  } catch (error) {
    console.log('Failed to log in with Facebook. Please try again.');
  }
};

// Handle Logout
export const handleLogout = async (dispatch) => {
  try {
    await signOut(auth); // Sign out from Firebase
    dispatch(setUserState(null)); // Clear user state in Redux
    console.log('User logged out successfully.');
  } catch (err) {
    console.error('Error during logout:', err);
  }
};


