// src/lib/firebase/auth.ts
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword, // Added this import
  AuthErrorCodes // Optional: For more specific error handling
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { app } from "../../firebase.js"; // Import initialized Firebase app

const auth = getAuth(app);
const db = getFirestore(app);

export const signUp = async (email: string, password: string, name: string) => {
  try {
      // --- Step 1: Create user in Firebase Authentication ---
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // --- Step 2 (Optional but recommended): Update Firebase Auth Profile ---
      // This sets the user's displayName within Firebase Auth itself
      await updateProfile(user, {
          displayName: name,
      });

      // --- Step 3: Store user details in Firestore ---
      // Create a reference to the document using the user's UID
      const userDocRef = doc(db, "users", user.uid); // "users" is the collection name

      // Set the document data
      await setDoc(userDocRef, {
          uid: user.uid,
          name: name, // Store the name provided during registration
          email: user.email, // Store the email
          createdAt: serverTimestamp(), // Add a timestamp for when the user was created
          // Add any other default user data you want to store here
          // e.g., role: 'customer', profileImageUrl: null, etc.
      });

      console.log("User registered successfully and data saved to Firestore:", user.uid);
      // The function resolves successfully (no explicit return needed unless you want to return the user object)

  } catch (error: any) {
      console.error("Error during sign up:", error);

      // --- Optional: More specific error handling ---
      // You can check error.code for specific issues like weak password or email already in use
      // if (error.code === AuthErrorCodes.EMAIL_EXISTS) {
      //   throw new Error("This email address is already in use.");
      // } else if (error.code === AuthErrorCodes.WEAK_PASSWORD) {
      //   throw new Error("Password is too weak. It should be at least 6 characters.");
      // } else {
      //   throw new Error("An unexpected error occurred during registration.");
      // }

      // Re-throw the error so the calling component (RegisterModal) can catch it
      // and display the appropriate toast message.
      throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("User logged in successfully:", user.uid);
      return { user }; // Or you can return the entire userCredential if needed
  } catch (error: any) {
      console.error("Error during login:", error);
      // You can add more specific error handling here based on error.code
      if (error.code === AuthErrorCodes.INVALID_EMAIL) {
          throw new Error("Invalid email address.");
      } else if (error.code === "auth/wrong-password") {
          throw new Error("Incorrect password.");
      } else if (error.code === "auth/user-not-found") {
          throw new Error("User not found with this email.");
      } else {
          throw new Error("An error occurred during login.");
      }
      throw error; // Re-throw the error so your LoginModal can catch it
  }
};

// You might have other auth functions here (signOut, etc.)