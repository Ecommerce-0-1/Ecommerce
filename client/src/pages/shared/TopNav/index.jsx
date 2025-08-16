import { useState } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { usePublicContext } from "../../../providers/PublicContextProvider";
import { useCart } from "../../../providers/CartProvider";
import { deleteUserCookies } from "../../../utils/methods";
import { toast } from "react-toastify";
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
  const { getCartCount } = useCart();
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
      <nav className="hidden md:flex">
        <ul className="flex items-center space-x-8">
          {navItems.map((item) => (
            <li key={item.id}>
              {item.onClick ? (
                <button
                  onClick={item.onClick}
                  className="text-button hover:text-buttonHover duration-300"
                >
                  {item.text}
                </button>
              ) : (
                <Link
                  to={item.path}
                  className={`text-button hover:text-buttonHover duration-300 ${
                    location.pathname === item.path ? "text-primary" : ""
                  }`}
                >
                  {item.text}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Search Bar */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <CustomInput
            type="text"
            placeholder="Search products..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
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
          <div className="relative">
            <FiShoppingCart
              className="cursor-pointer"
              size={20}
              onClick={() => navigate("/cart")}
            />
            {getCartCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {getCartCount() > 99 ? "99+" : getCartCount()}
              </span>
            )}
          </div>
          <div>
            <FiUser
              className="cursor-pointer"
              size={20}
              onClick={() => navigate("/profile")}
            />
          </div>
        </>
      ) : (
        <>
          <div className="relative">
            <FiShoppingCart
              className="cursor-pointer"
              size={20}
              onClick={() => navigate("/cart")}
            />
            {getCartCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {getCartCount() > 99 ? "99+" : getCartCount()}
              </span>
            )}
          </div>
        </>
      )}

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

        <div className="p-4">
          <ul className="space-y-4">
            {navItems.map((item) => (
              <li key={item.id}>
                {item.onClick ? (
                  <button
                    onClick={item.onClick}
                    className="text-button hover:text-buttonHover duration-300 block w-full text-left"
                  >
                    {item.text}
                  </button>
                ) : (
                  <Link
                    to={item.path}
                    className={`text-button hover:text-buttonHover duration-300 block ${
                      location.pathname === item.path ? "text-primary" : ""
                    }`}
                    onClick={() => setNav(false)}
                  >
                    {item.text}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {/* Mobile Cart Link */}
          <div className="mt-8 pt-4 border-t border-gray-200">
            <Link
              to="/cart"
              className="flex items-center gap-2 text-button hover:text-buttonHover duration-300"
              onClick={() => setNav(false)}
            >
              <FiShoppingCart size={20} />
              <span>Cart</span>
              {getCartCount() > 0 && (
                <span className="bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getCartCount() > 99 ? "99+" : getCartCount()}
                </span>
              )}
            </Link>
          </div>
        </div>
      </ul>
    </div>
  );
};

export default TopNav;
