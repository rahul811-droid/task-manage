import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { signInSuccess } from "../redux/user/userSlice";
import ClipLoader from "react-spinners/ClipLoader";
import { FaGoogle } from "react-icons/fa";



const Oauth = () => {
    const baseUrl = import.meta.env.VITE_BACKEND_URI;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      const res = await fetch(baseUrl+"/api/v1/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
        }),
      });

      const data = await res.json();
      console.log(data.user)
      dispatch(signInSuccess(data.user));
      localStorage.setItem('token',data.token)
      navigate("/home");
      console.log(data);
      console.log(result);
    } catch (error) {
      console.log("could not sign with google", error);
    }
  };
  return (
    <button
      onClick={handleGoogleClick}
      className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 hover:border-gray-400 bg-white text-gray-700 font-medium transition duration-200 rounded-md"
    >
      <FaGoogle size={20} color="teal"/>
      Continue with Google
    </button>
  );
};

export default Oauth;
