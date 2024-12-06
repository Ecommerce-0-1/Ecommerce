import React, { useState } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { Link } from "react-router-dom";
import { usePublicContext } from "../../../providers/PublicContextProvider";
import { deleteUserCookies } from "../../../utils/methods";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Navbar = () => {
  // State to manage the TopNav's visibility
  const [nav, setNav] = useState(false);
  const { isLog } = usePublicContext();

  // Toggle function to handle the TopNav's display
  const handleNav = () => {
    setNav(!nav);
  };

  const handleLogout = () => {
    deleteUserCookies();
    toast.success("Logged out successfully!");
    window.location.reload();
  };

  // Array containing navigation items
  const navItems = [
    { id: 1, text: "Todos", path: "/" },
    isLog
      ? { id: 2, text: "Logout", onClick: handleLogout }
      : { id: 2, text: "Login", path: "/login" },
    isLog ? null : { id: 3, text: "SignUp", path: "/signup" },
  ].filter((item) => item);

  return (
    <div className='mx-auto flex h-24 max-w-[1980px] items-center justify-between bg-white px-4 text-black shadow-lg'>
      <h1 className='w-full text-3xl font-bold text-[#fbbf24]'>Task Minder</h1>

      {/* Desktop Navigation */}
      <ul className='hidden md:flex'>
        {navItems?.map((item) => (
          <li
            key={item.id}
            className='m-2 cursor-pointer rounded-xl p-4 duration-300 hover:bg-[#fbbf24] hover:text-black'
          >
            {item.path ? (
              <Link to={item.path}>{item.text}</Link>
            ) : (
              <button onClick={item.onClick}>{item.text}</button> // Render button with onClick
            )}
          </li>
        ))}
      </ul>

      {/* Mobile Navigation Icon */}
      <div onClick={handleNav} className='block md:hidden'>
        {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
      </div>

      {/* Mobile Navigation Menu */}
      <ul
        className={
          nav
            ? "fixed left-0 top-0 h-full w-[60%] border-r border-r-gray-900 bg-[#000300] duration-500 ease-in-out md:hidden"
            : "fixed bottom-0 left-[-100%] top-0 w-[60%] duration-500 ease-in-out"
        }
      >
        <h1 className='m-4 w-full text-3xl font-bold text-[#fbbf24]'>REACT.</h1>
        {navItems?.map((item) => (
          <li
            key={item.id}
            className='cursor-pointer rounded-xl border-b border-gray-600 p-4 duration-300 hover:bg-[#fbbf24] hover:text-black'
          >
            {item.path ? (
              <Link to={item.path}>{item.text}</Link>
            ) : (
              <button onClick={item.onClick}>{item.text}</button> // Render button with onClick
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Navbar;
