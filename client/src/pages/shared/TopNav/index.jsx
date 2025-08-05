import { useState } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { usePublicContext } from "../../../providers/PublicContextProvider";
import { deleteUserCookies } from "../../../utils/methods";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../App.css";
import CustomInput from "../../../components/ui/custom-inputs/CustomInput";
import {
  FiSearch,
  FiHeart,
  FiShoppingCart,
  FiUser,
  FiUsers,
} from "react-icons/fi";

const TopNav = () => {
  const [nav, setNav] = useState(false);

  const { isLog } = usePublicContext();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = () => {
    setNav(!nav);
  };

  const handleLogout = () => {
    deleteUserCookies();
    navigate("/login");
    window.location.reload();
  };

  const navItems = [
    { id: 1, text: "Home", path: "/" },
    { id: 2, text: "Contact", path: "/contact" },
    { id: 3, text: "About", path: "/about" },
    isLog
      ? { id: 4, text: "Logout", onClick: handleLogout }
      : { id: 4, text: "SignUp", path: "/signup" },
  ].filter((item) => item);

  return (
    <div className="mx-auto flex h-24 max-w-[1980px] items-center px-6 border-b-2">
      <h1 className="text-custom-3xl font-custom-bold text-primary mr-8">
        Ecommerce
      </h1>

      {/* Desktop Navigation */}
      <ul className="hidden md:flex flex-grow justify-center items-center space-x-8">
        {navItems?.map((item) => (
          <li
            key={item?.id}
            className={`group relative cursor-pointer px-4 py-2 font-custom-medium duration-400 ${
              item?.path && location?.pathname === item.path
                ? "border-b-2 border-b-primary"
                : ""
            }`}
          >
            {item?.path ? (
              <Link to={item?.path}>{item?.text}</Link>
            ) : (
              <button onClick={item?.onClick}>{item?.text}</button>
            )}
            {/* Underline span */}
            <span className="absolute bottom-0 left-0 h-0.5 bg-primary w-0 transition-all duration-400 group-hover:w-full" />
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-4 ml-auto">
        {/* Search Input */}
        <div className="hidden lg:block">
          <CustomInput
            className=""
            placeholder="What are you looking for?"
            shape={3}
            icon={
              <FiSearch
                className="cursor-pointer"
                size={20}
                cursor={true}
                onClick={() => {
                  alert("soon !");
                }}
              />
            }
          />
        </div>

        {/* Right Section Icons  */}
        {isLog ? (
          <>
            <div>
              <FiHeart
                className="cursor-pointer"
                size={20}
                onClick={() => {
                  alert("soon !");
                }}
              />
            </div>
            <div>
              <FiShoppingCart
                className="cursor-pointer"
                size={20}
                onClick={() => {
                  alert("soon !");
                }}
              />
            </div>
            <div>
              <FiUser
                className="cursor-pointer"
                size={20}
                onClick={() => {
                  alert("soon !");
                }}
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <FiShoppingCart
                className="cursor-pointer"
                size={20}
                onClick={() => {
                  alert("soon !");
                }}
              />
            </div>
          </>
        )}
      </div>

      {/* Mobile Menu Toggle */}
      <button
        onClick={handleNav}
        className="text-button hover:text-buttonHover duration-300 relative z-100 ml-auto block md:hidden"
      >
        {nav ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
      </button>

      {/* Mobile Navigation */}
      <ul
        className={`fixed left-0 top-0 z-90 h-full w-[70%] border-r border-r-gray-200 bg-white shadow-2xl transition-all duration-500 ease-in-out md:hidden ${
          nav ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-24 items-center border-b border-gray-200 px-4">
          <h1 className="text-custom-2xl font-custom-bold text-primary">
            Ecommerce
          </h1>
        </div>

        {navItems.map((item) => (
          <li
            key={item.id}
            className="border-b border-gray-200 last:border-b-0"
          >
            {item.path ? (
              <Link
                to={item.path}
                className={`block p-4 font-custom-medium ${
                  location.pathname === item.path
                    ? "bg-primary/10 text-primary"
                    : "text-textColor hover:bg-primary/10 hover:text-primary"
                }`}
              >
                {item.text}
              </Link>
            ) : (
              <button
                onClick={item.onClick}
                className="block w-full p-4 text-left font-custom-medium text-textColor hover:bg-primary/10 hover:text-primary"
              >
                {item.text}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopNav;
