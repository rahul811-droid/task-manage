import React from 'react';
import { FaSignOutAlt, FaBars, FaUserCircle } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { signoutUserSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

const Headers = () => {

const {currentUser} = useSelector((state)=>state.user);
const dispatch = useDispatch();
const navigate = useNavigate();


const handleLogout=()=>{
    dispatch(signoutUserSuccess())
    localStorage.removeItem('token')
}
  return (
    <div className="bg-gray-50 font-['Inter']">
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center">
              {/* <img
                className="h-8 w-auto"
                src="https://ai-public.creatie.ai/gen_page/logo_placeholder.png"
                alt="Logo"
              /> */}
              <span className="ml-3 text-xl font-semibold text-gray-900">
                Not Your Idea
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                <FaUserCircle />
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    {currentUser?.email}
                  </span>
                </div>
                {currentUser ? (
                        <>
                         <button onClick={handleLogout} className="rounded-md inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium text-white bg-red-700 hover:bg-gray-800 focus:outline-none transition-colors duration-200">
                  <FaSignOutAlt className="mr-2" /> Logout
                </button></>
                ):(
                    <>
                    
                    <button  className="rounded-md inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none transition-colors duration-200">
                  <FaSignOutAlt className="mr-2" /> Login
                </button>
                    
                    </>
                )
                }
               
              </div>
            </div>

            <div className="md:hidden">
              <button  
                type="button"
                className="rounded-md bg-white p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              >
                <FaBars />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-16">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* <h1 className="text-2xl font-semibold text-gray-900">Welcome to Dashboard</h1> */}
        </div>
      </main>
    </div>
  );
};

export default Headers;