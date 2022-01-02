import { FirebaseError } from "firebase/app";

export const parseError = (error: FirebaseError) => {
  switch (error?.code) {
    case "auth/invalid-email":
      return "Invalid email.";
    case "auth/user-not-found":
      return "User not found.";
    case "auth/wrong-password":
      return "Wrong password.";
    case "auth/weak-password":
      return "Password should be at least 6 characters";
    case "passwords-doesnt-match":
      return "Passwords doesn't match.";
    case "auth/email-already-in-use":
      return "Email already in use.";
    default:
      return error?.message?.replace("Firebase: ", "");
  }
};
