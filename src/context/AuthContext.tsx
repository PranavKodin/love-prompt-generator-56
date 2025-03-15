import { createContext, useContext, useEffect, useState } from "react";
import { 
  User,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  AuthError,
} from "firebase/auth";
import { auth, googleProvider, facebookProvider } from "@/lib/firebase";
import { db } from "@/lib/firebase"; // Import Firestore
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getFriendlyErrorMessage = (error: AuthError) => {
    switch (error.code) {
      case "auth/invalid-email":
        return "Invalid email format. Please enter a valid email.";
      case "auth/user-not-found":
        return "No account found with this email. Please sign up.";
      case "auth/wrong-password":
        return "Incorrect password. Try again.";
      case "auth/email-already-in-use":
        return "This email is already in use. Try signing in instead.";
      case "auth/popup-closed-by-user":
        return "Sign-in popup was closed. Try again.";
      default:
        return "An unexpected error occurred. Please try again.";
    }
  };

  const handleAuthError = (error: AuthError) => {
    console.error("Auth error:", error);
    toast({
      variant: "destructive",
      title: "Authentication Error",
      description: getFriendlyErrorMessage(error),
    });
  };

  const createUserDocument = async (user: User) => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const userSnapshot = await getDoc(userRef);

    if (!userSnapshot.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || "",
        photoURL: user.photoURL || "",
        createdAt: serverTimestamp(),
        preferences: {
          darkMode: true,
          language: "en",
        },
        subscription: {
          level: "free",
          expiresAt: serverTimestamp(),
        },
      });
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await createUserDocument(result.user);
      toast({
        title: `Welcome, ${result.user.displayName || "User"}!`,
        description: "Successfully signed in with Google",
      });
      navigate("/");
    } catch (error) {
      handleAuthError(error as AuthError);
    }
  };

  const signInWithFacebook = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      await createUserDocument(result.user);
      toast({
        title: `Welcome, ${result.user.displayName || "User"}!`,
        description: "Successfully signed in with Facebook",
      });
      navigate("/");
    } catch (error) {
      handleAuthError(error as AuthError);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await createUserDocument(result.user);
      toast({
        title: "Welcome back!",
        description: "Successfully signed in",
      });
      navigate("/");
    } catch (error) {
      handleAuthError(error as AuthError);
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: email.split("@")[0] });
      await createUserDocument(result.user);
      toast({
        title: "Welcome!",
        description: "Your account has been created successfully",
      });
      navigate("/");
    } catch (error) {
      handleAuthError(error as AuthError);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Goodbye!",
        description: "Successfully signed out",
      });
      navigate("/login");
    } catch (error) {
      handleAuthError(error as AuthError);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signInWithGoogle,
    signInWithFacebook,
    signInWithEmail,
    signUpWithEmail,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
