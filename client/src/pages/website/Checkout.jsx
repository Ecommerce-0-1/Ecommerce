import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import StripeCheckout from "../../components/ui/StripeCheckout";
import CustomInput from "../../components/ui/custom-inputs/CustomInput";
import Label from "../../components/ui/custom-inputs/Label";
import ErrorFormik from "../../components/ui/ErrorFormik";
import FilledButton from "../../components/ui/buttons/FilledButton";
import {
  FiShoppingCart,
  FiUser,
  FiMapPin,
  FiCreditCard,
  FiArrowLeft,
} from "react-icons/fi";
import { useCart } from "../../providers/CartProvider";
import { createOrder } from "../../queries/ordersQueryFns";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPayment, setShowPayment] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const { items, getCartTotal, getCartCount } = useCart();

  // Create order data from cart items
  const orderData = {
    total_amount: getCartTotal(),
    items: items.map((item) => ({
      name: item.product.name,
      quantity: item.quantity,
      price: item.product.finalPrice,
      product_id: item.product.id,
    })),
  };

  const billingSchema = Yup.object({
    first_name: Yup.string().required("First name is required"),
    last_name: Yup.string().required("Last name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string().required("Phone number is required"),
    shipping_address: Yup.string().required("Shipping address is required"),
    shipping_city: Yup.string().required("City is required"),
    shipping_state: Yup.string(),
    shipping_postal_code: Yup.string().required("Postal code is required"),
    billing_address: Yup.string().required("Billing address is required"),
    billing_city: Yup.string().required("Billing city is required"),
    billing_state: Yup.string(),
    billing_postal_code: Yup.string().required(
      "Billing postal code is required"
    ),
    same_as_shipping: Yup.boolean(),
  });

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (data) => {
      if (data.success) {
        setCreatedOrder(data.order);
        setShowPayment(true);
        toast.success("Order created successfully!");
      } else {
        toast.error(data.message || "Failed to create order");
      }
    },
    onError: (error) => {
      console.error("Order creation error:", error);
      toast.error("Failed to create order. Please try again.");
    },
  });

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      shipping_address: "",
      shipping_city: "",
      shipping_state: "",
      shipping_postal_code: "",
      billing_address: "",
      billing_city: "",
      billing_state: "",
      billing_postal_code: "",
      same_as_shipping: true,
    },
    validationSchema: billingSchema,
    onSubmit: (values) => {
      // Create billing data first
      const billingData = {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        phone: values.phone,
        shipping_address: values.shipping_address,
        shipping_city: values.shipping_city,
        shipping_state: values.shipping_state,
        shipping_postal_code: values.shipping_postal_code,
        billing_address: values.same_as_shipping
          ? values.shipping_address
          : values.billing_address,
        billing_city: values.same_as_shipping
          ? values.shipping_city
          : values.billing_city,
        billing_state: values.same_as_shipping
          ? values.shipping_state
          : values.billing_state,
        billing_postal_code: values.same_as_shipping
          ? values.shipping_postal_code
          : values.billing_postal_code,
        same_as_shipping: values.same_as_shipping,
      };

      // Create order with items
      const orderData = {
        items: items.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
        })),
        billing_data: billingData,
      };

      createOrderMutation.mutate(orderData);
    },
  });

  const handleSameAsShipping = (checked) => {
    if (checked) {
      formik.setValues({
        ...formik.values,
        same_as_shipping: true,
        billing_address: formik.values.shipping_address,
        billing_city: formik.values.shipping_city,
        billing_state: formik.values.shipping_state,
        billing_postal_code: formik.values.shipping_postal_code,
      });
    } else {
      formik.setValues({
        ...formik.values,
        same_as_shipping: false,
      });
    }
  };

  const handleCancel = () => {
    navigate("/cart");
  };

  // Redirect if cart is empty
  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  if (showPayment && createdOrder) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <StripeCheckout
            order={createdOrder}
            billingData={formik.values}
            onCancel={() => setShowPayment(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              {/* Header */}
              <div className="border-b border-gray-200 p-6">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate("/cart")}
                    className="p-2 rounded-full border border-gray-300 hover:border-primary hover:text-primary transition-colors duration-300"
                  >
                    <FiArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="flex items-center">
                    <FiShoppingCart className="w-6 h-6 text-primary mr-3" />
                    <h1 className="text-2xl font-bold text-gray-800">
                      Checkout
                    </h1>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={formik.handleSubmit} className="p-6 space-y-8">
                {/* Contact Information */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <FiUser className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-semibold text-gray-800">
                      Contact Information
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="w-full">
                      <Label htmlFor="first_name">First Name</Label>
                      <CustomInput
                        id="first_name"
                        name="first_name"
                        type="text"
                        placeholder="Enter your first name"
                        value={formik.values.first_name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        shape={3}
                      />
                      <ErrorFormik
                        touched={formik.touched.first_name}
                        error={formik.errors.first_name}
                      />
                    </div>
                    <div className="w-full">
                      <Label htmlFor="last_name">Last Name</Label>
                      <CustomInput
                        id="last_name"
                        name="last_name"
                        type="text"
                        placeholder="Enter your last name"
                        value={formik.values.last_name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        shape={3}
                      />
                      <ErrorFormik
                        touched={formik.touched.last_name}
                        error={formik.errors.last_name}
                      />
                    </div>
                    <div className="w-full">
                      <Label htmlFor="email">Email</Label>
                      <CustomInput
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        shape={3}
                      />
                      <ErrorFormik
                        touched={formik.touched.email}
                        error={formik.errors.email}
                      />
                    </div>
                    <div className="w-full">
                      <Label htmlFor="phone">Phone</Label>
                      <CustomInput
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        shape={3}
                      />
                      <ErrorFormik
                        touched={formik.touched.phone}
                        error={formik.errors.phone}
                      />
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <FiMapPin className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-semibold text-gray-800">
                      Shipping Address
                    </h2>
                  </div>

                  {/* Match contact info grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="w-full">
                      <Label htmlFor="shipping_address">Address</Label>
                      <CustomInput
                        id="shipping_address"
                        name="shipping_address"
                        type="text"
                        placeholder="Enter your shipping address"
                        value={formik.values.shipping_address}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        shape={3}
                      />
                      <ErrorFormik
                        touched={formik.touched.shipping_address}
                        error={formik.errors.shipping_address}
                      />
                    </div>

                    <div className="w-full">
                      <Label htmlFor="shipping_city">City</Label>
                      <CustomInput
                        id="shipping_city"
                        name="shipping_city"
                        type="text"
                        placeholder="City"
                        value={formik.values.shipping_city}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        shape={3}
                      />
                      <ErrorFormik
                        touched={formik.touched.shipping_city}
                        error={formik.errors.shipping_city}
                      />
                    </div>

                    <div className="w-full">
                      <Label htmlFor="shipping_state">State</Label>
                      <CustomInput
                        id="shipping_state"
                        name="shipping_state"
                        type="text"
                        placeholder="State"
                        value={formik.values.shipping_state}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        shape={3}
                      />
                      <ErrorFormik
                        touched={formik.touched.shipping_state}
                        error={formik.errors.shipping_state}
                      />
                    </div>

                    <div className="w-full">
                      <Label htmlFor="shipping_postal_code">Postal Code</Label>
                      <CustomInput
                        id="shipping_postal_code"
                        name="shipping_postal_code"
                        type="text"
                        placeholder="Postal Code"
                        value={formik.values.shipping_postal_code}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        shape={3}
                      />
                      <ErrorFormik
                        touched={formik.touched.shipping_postal_code}
                        error={formik.errors.shipping_postal_code}
                      />
                    </div>
                  </div>
                </div>

                {/* Billing Address */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <FiCreditCard className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-semibold text-gray-800">
                      Billing Address
                    </h2>
                  </div>

                  <div className="mb-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formik.values.same_as_shipping}
                        onChange={(e) => handleSameAsShipping(e.target.checked)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-gray-700">
                        Same as shipping address
                      </span>
                    </label>
                  </div>

                  {!formik.values.same_as_shipping && (
                    <div className="space-y-4">
                      <div className="w-full">
                        <Label htmlFor="billing_address">Address</Label>
                        <CustomInput
                          id="billing_address"
                          name="billing_address"
                          type="text"
                          placeholder="Enter your billing address"
                          value={formik.values.billing_address}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          shape={3}
                        />
                        <ErrorFormik
                          touched={formik.touched.billing_address}
                          error={formik.errors.billing_address}
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="w-full">
                          <Label htmlFor="billing_city">City</Label>
                          <CustomInput
                            id="billing_city"
                            name="billing_city"
                            type="text"
                            placeholder="City"
                            value={formik.values.billing_city}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            shape={3}
                          />
                          <ErrorFormik
                            touched={formik.touched.billing_city}
                            error={formik.errors.billing_city}
                          />
                        </div>
                        <div className="w-full">
                          <Label htmlFor="billing_state">State</Label>
                          <CustomInput
                            id="billing_state"
                            name="billing_state"
                            type="text"
                            placeholder="State"
                            value={formik.values.billing_state}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            shape={3}
                          />
                          <ErrorFormik
                            touched={formik.touched.billing_state}
                            error={formik.errors.billing_state}
                          />
                        </div>
                        <div className="w-full sm:col-span-2 lg:col-span-1">
                          <Label htmlFor="billing_postal_code">
                            Postal Code
                          </Label>
                          <CustomInput
                            id="billing_postal_code"
                            name="billing_postal_code"
                            type="text"
                            placeholder="Postal Code"
                            value={formik.values.billing_postal_code}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            shape={3}
                          />
                          <ErrorFormik
                            touched={formik.touched.billing_postal_code}
                            error={formik.errors.billing_postal_code}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <FilledButton
                    icon={<FiArrowLeft />}
                    text="Back to Cart"
                    isButton={true}
                    buttonType="button"
                    onClick={handleCancel}
                    width="w-full sm:flex-1"
                    height="py-3 px-6"
                    iconLeft={true}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-md transition-colors duration-300 mb-4"
                  />
                  <FilledButton
                    text={
                      createOrderMutation.isPending
                        ? "Creating Order..."
                        : "Continue to Payment"
                    }
                    isButton={true}
                    buttonType="submit"
                    width="w-full sm:flex-1"
                    height="py-3 px-6"
                    className="bg-primary hover:bg-buttonHover text-white font-medium py-3 px-6 rounded-md transition-colors duration-300 mb-4"
                    isDisable={createOrderMutation.isPending}
                  />
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Order Summary
              </h2>

              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center gap-3"
                  >
                    <img
                      src={item.product.img || "/api/placeholder/50/50"}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-800 truncate">
                        {item.product.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-sm font-medium text-gray-800">
                      ${(item.product.finalPrice * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal ({getCartCount()} items)</span>
                  <span>${getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between text-lg font-bold text-gray-800">
                    <span>Total</span>
                    <span>${getCartTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
