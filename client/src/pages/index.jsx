import { Routes, Route } from "react-router-dom";
import ScrollToTop from "../components/ui/ScrollToTop";
import Login from "./website/Auth/LogIn";
import Signup from "./website/Auth/SignUp";
import NotFound from "./website/NotFound";
import UnAuthorized from "./website/Unauthorized";
import Home from "./website/Home";
import ProductDetails from "./website/ProductDetails";
import PaymentSuccess from "./website/PaymentSuccess";
import PaymentCancel from "./website/PaymentCancel";
import Checkout from "./website/Checkout";
import Cart from "./website/Cart";
import Profile from "./website/Profile";
import OrderDetails from "./website/OrderDetails";
import TopNav from "./shared/TopNav";

export default function Index() {
  return (
    <>
      <ScrollToTop />
      <TopNav />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/order/:id" element={<OrderDetails />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/cancel" element={<PaymentCancel />} />
        <Route path="/unauthorized" element={<UnAuthorized />} />
        <Route path="*" element={<NotFound />} />

        <Route path="/" element={<Home />} />
      </Routes>
    </>
  );
}
