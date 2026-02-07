import { createContext, useContext, useState, useEffect } from "react";
import { 
  auth, 
  db 
} from "../lib/firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { 
  doc, 
  getDoc, 
  setDoc 
} from "firebase/firestore";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        // Fetch user profile from Firestore to get role
        try {
           const userDocRef = doc(db, "users", currentUser.uid);
           const userDoc = await getDoc(userDocRef);
           if (userDoc.exists()) {
              setUser({ ...currentUser, ...userDoc.data() });
           } else {
              // Fallback if doc doesn't exist yet (optimization issue or timing)
              setUser(currentUser);
           }
        } catch (error) {
           console.error("Error fetching user profile:", error);
           setUser(currentUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Fetch profile to return full user object including role
      const userDocRef = doc(db, "users", userCredential.user.uid);
      const userDoc = await getDoc(userDocRef);
      const userData = userDoc.exists() ? userDoc.data() : {};
      
      return { success: true, user: { ...userCredential.user, ...userData } };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const { email, password, ...profileData } = userData;
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // key: uid
      const newUserProfile = { 
         id: userCredential.user.uid,
         email, 
         role: profileData.role,
         name: profileData.name || '',
         createdAt: new Date().toISOString(),
         ...profileData 
      };

      // Create user document in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), newUserProfile);
      
      return { success: true, user: newUserProfile };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    // Return a default value or warning to prevent crashing during development/hot-reload
    // if the provider is temporarily unavailable or mistakenly nested.
    console.warn('useAuth used outside AuthProvider');
    return { user: null, loading: true, login: () => {}, register: () => {}, logout: () => {} };
  }
  return context;
};
