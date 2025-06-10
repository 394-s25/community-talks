import React, { useContext, useState, useEffect, createContext } from "react";
import { auth, db } from "../firebase";
import { ref, get } from "firebase/database";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  // const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      // if (user !== null){
      //   // retrieve username from databse if it exists
      //   setUsername(getUsername(user.uid));
      // } else setUsername(null);

      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Get username if exists
  const getUsername = async (uid) => {
    try {
      const snap = await get(ref(db, 'users/' + uid));
      if (snap.exists()){
        const user = snap.val();
        if (user.username) return user.username;
        else return uid;  
      }
    } catch (err) {
      console.error("Error retrieving username:", err);
    }
  }

  // Email + password signup
  const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Email + password login
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Google login
  const loginWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  // Sign out
  const logout = () => {
    return signOut(auth);
  };

  const value = {
    currentUser,
    // username,
    login,
    signup,
    logout,
    loginWithGoogle,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
