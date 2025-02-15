import { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import Oauth from "../components/Oauth";
import ClipLoader from "react-spinners/ClipLoader";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signInFailure, signInStart, signInSuccess } from "../redux/user/userSlice";
import { toast } from "react-toastify";
const Login = () => {
  const base_url = import.meta.env.VITE_BACKEND_URI;
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      dispatch(signInStart());
      setLoading(true);
  
      const res = await fetch(`${base_url}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Login failed.");
      }
  
      dispatch(signInSuccess(data.user));
      toast.success("Login successful! Redirecting...");
      localStorage.setItem('token',data.token)
      navigate("/home"); 
    } catch (error) {
      dispatch(signInFailure(error.message));
      toast.error(error.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-100 rounded-xl shadow-lg p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Log In</h1>
            <p className="text-gray-500">login! Please enter your details</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {[
              {
                name: "email",
                type: "email",
                placeholder: "Email Address",
                icon: <FaEnvelope />,
              },
              {
                name: "password",
                type: "password",
                placeholder: "Password",
                icon: <FaLock />,
              },
            ].map(({ name, type, placeholder, icon }) => (
              <div key={name} className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  {icon}
                </div>
                <input
                  type={type}
                  name={name}
                  placeholder={placeholder}
                  value={formData[name]}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white text-gray-900 text-sm placeholder-gray-400 rounded-md"
                />
              </div>
            ))}

            <button
              type="submit"
              className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold transition duration-200 transform hover:scale-[1.02] rounded-md"
            >
              {loading ? <ClipLoader /> : " Login"}
            </button>
          </form>

          <div className="relative text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <span className="relative px-2 bg-white text-gray-500">
              Or continue with
            </span>
          </div>

          <Oauth />

          <p className="text-center text-sm text-gray-600">
            Don't have an account?
            <a
              href="/signup"
              className="font-semibold text-indigo-500 hover:text-indigo-600"
            >
              {" "}
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
