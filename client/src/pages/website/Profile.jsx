import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  FiUser,
  FiShoppingBag,
  FiHeart,
  FiSettings,
  FiLogOut,
  FiArrowLeft,
} from "react-icons/fi";
import { getUserOrders } from "../../queries/ordersQueryFns";
import {
  getUserWishlist,
  removeFromWishlist,
  clearWishlist,
} from "../../queries/wishlistQueryFns";
import { deleteUserCookies } from "../../utils/methods";
import { Oval } from "react-loader-spinner";
import FilledButton from "../../components/ui/buttons/FilledButton";

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");

  // Fetch user orders
  const {
    data: ordersData,
    isLoading: ordersLoading,
    error: ordersError,
  } = useQuery({
    queryKey: ["userOrders"],
    queryFn: getUserOrders,
  });

  // Fetch user wishlist
  const {
    data: wishlistData,
    isLoading: wishlistLoading,
    error: wishlistError,
  } = useQuery({
    queryKey: ["userWishlist"],
    queryFn: getUserWishlist,
  });

  const orders = ordersData?.orders || [];
  const wishlist = wishlistData?.wishlist || [];

  const handleLogout = () => {
    deleteUserCookies();
    toast.success("Logged out successfully!");
    navigate("/login");
    window.location.reload();
  };

  const handleBack = () => {
    navigate(-1);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "rejected":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: <FiUser /> },
    { id: "orders", label: "Orders", icon: <FiShoppingBag /> },
    { id: "wishlist", label: "Wishlist", icon: <FiHeart /> },
    { id: "settings", label: "Settings", icon: <FiSettings /> },
  ];

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <p className="text-gray-900">John Doe</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <p className="text-gray-900">john.doe@example.com</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <p className="text-gray-900">+1 (555) 123-4567</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Member Since
            </label>
            <p className="text-gray-900">January 2024</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Account Statistics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {orders.length}
            </div>
            <div className="text-sm text-gray-600">Total Orders</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {wishlist.length}
            </div>
            <div className="text-sm text-gray-600">Wishlist Items</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">$0.00</div>
            <div className="text-sm text-gray-600">Total Spent</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOrdersTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Order History
        </h3>

        {ordersLoading ? (
          <div className="flex justify-center py-8">
            <Oval
              height={40}
              width={40}
              color="#DB4444"
              secondaryColor="#f3f4f6"
              strokeWidth={2}
              strokeWidthSecondary={2}
            />
          </div>
        ) : ordersError ? (
          <div className="text-center py-8">
            <p className="text-red-600">Failed to load orders</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8">
            <FiShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No orders found</p>
            <FilledButton
              text="Start Shopping"
              onClick={() => navigate("/")}
              isButton={true}
              width="mt-4"
              height="py-2 px-4"
              className="bg-primary hover:bg-buttonHover text-white"
            />
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium text-gray-800">
                      Order #{order.id}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                    <span className="font-semibold text-gray-800">
                      ${order.total_amount}
                    </span>
                  </div>
                </div>

                {order.order_items && order.order_items.length > 0 && (
                  <div className="space-y-2">
                    {order.order_items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <img
                          src={item.product?.img || "/api/placeholder/40/40"}
                          alt={item.product?.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">
                            {item.product?.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <span className="text-sm font-medium text-gray-800">
                          ${item.price}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-3 pt-3 border-t border-gray-200">
                  <FilledButton
                    text="View Details"
                    onClick={() => navigate(`/order/${order.id}`)}
                    isButton={true}
                    width="w-full"
                    height="py-2"
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderWishlistTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">My Wishlist</h3>
          {wishlist.length > 0 && (
            <FilledButton
              text="Clear All"
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure you want to clear your wishlist?"
                  )
                ) {
                  clearWishlist()
                    .then(() => {
                      toast.success("Wishlist cleared successfully!");
                      // Refetch wishlist data
                      window.location.reload();
                    })
                    .catch(() => {
                      toast.error("Failed to clear wishlist");
                    });
                }
              }}
              isButton={true}
              width=""
              height="py-2 px-4"
              className="bg-red-500 hover:bg-red-600 text-white text-sm"
            />
          )}
        </div>

        {wishlistLoading ? (
          <div className="flex justify-center py-8">
            <Oval
              height={40}
              width={40}
              color="#DB4444"
              secondaryColor="#f3f4f6"
              strokeWidth={2}
              strokeWidthSecondary={2}
            />
          </div>
        ) : wishlistError ? (
          <div className="text-center py-8">
            <p className="text-red-600">Failed to load wishlist</p>
          </div>
        ) : wishlist.length === 0 ? (
          <div className="text-center py-8">
            <FiHeart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Your wishlist is empty</p>
            <FilledButton
              text="Start Shopping"
              onClick={() => navigate("/")}
              isButton={true}
              width=""
              height="py-2 px-4"
              className="bg-primary hover:bg-buttonHover text-white"
            />
          </div>
        ) : (
          <div className="space-y-4">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.product?.img || "/api/placeholder/60/60"}
                    alt={item.product?.name}
                    className="w-15 h-15 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">
                      {item.product?.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {item.product?.category?.name}
                    </p>
                    <p className="text-lg font-semibold text-primary">
                      ${item.product?.price}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <FilledButton
                      text="Add to Cart"
                      onClick={() => {
                        // Add to cart functionality
                        toast.info("Add to cart functionality coming soon!");
                      }}
                      isButton={true}
                      width=""
                      height="py-2 px-3"
                      className="bg-primary hover:bg-buttonHover text-white text-sm"
                    />
                    <FilledButton
                      text="Remove"
                      onClick={() => {
                        removeFromWishlist(item.product_id)
                          .then(() => {
                            toast.success("Removed from wishlist!");
                            // Refetch wishlist data
                            window.location.reload();
                          })
                          .catch(() => {
                            toast.error("Failed to remove from wishlist");
                          });
                      }}
                      isButton={true}
                      width=""
                      height="py-2 px-3"
                      className="bg-red-500 hover:bg-red-600 text-white text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Account Settings
        </h3>

        <div className="space-y-4">
          <FilledButton
            text="Edit Profile"
            isButton={true}
            width="w-full"
            height="py-3"
            className="bg-primary hover:bg-buttonHover text-white"
          />

          <FilledButton
            text="Change Password"
            isButton={true}
            width="w-full"
            height="py-3"
            className="bg-gray-100 hover:bg-gray-200 text-gray-700"
          />

          <FilledButton
            text="Notification Settings"
            isButton={true}
            width="w-full"
            height="py-3"
            className="bg-gray-100 hover:bg-gray-200 text-gray-700"
          />

          <FilledButton
            icon={<FiLogOut />}
            text="Logout"
            onClick={handleLogout}
            isButton={true}
            width="w-full"
            height="py-3"
            iconLeft={true}
            className="bg-red-500 hover:bg-red-600 text-white"
          />
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return renderProfileTab();
      case "orders":
        return renderOrdersTab();
      case "wishlist":
        return renderWishlistTab();
      case "settings":
        return renderSettingsTab();
      default:
        return renderProfileTab();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={handleBack}
              className="p-2 rounded-full border border-gray-300 hover:border-primary hover:text-primary transition-colors duration-300"
            >
              <FiArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                      activeTab === tab.id
                        ? "bg-primary text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {tab.icon}
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
