import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getSessionStatus } from "../../queries/postQueryFns";
import { FiCheckCircle, FiClock, FiXCircle } from "react-icons/fi";
import { Oval } from "react-loader-spinner";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("checking");

  const sessionId = searchParams.get("session_id");

  const {
    data: sessionData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["session-status", sessionId],
    queryFn: () => getSessionStatus(sessionId),
    enabled: !!sessionId,
    retry: 3,
    retryDelay: 1000,
  });

  useEffect(() => {
    if (sessionData) {
      if (sessionData.success) {
        if (sessionData.payment_status === "paid") {
          setStatus("success");
        } else if (sessionData.payment_status === "unpaid") {
          setStatus("failed");
        } else {
          setStatus("pending");
        }
      } else {
        setStatus("failed");
      }
    }
  }, [sessionData]);

  const handleContinueShopping = () => {
    navigate("/");
  };

  const handleViewOrders = () => {
    navigate("/orders");
  };

  if (!sessionId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto text-center">
          <FiXCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Invalid Payment Session
          </h2>
          <p className="text-gray-600 mb-6">
            No payment session found. Please try again or contact support.
          </p>
          <button
            onClick={handleContinueShopping}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (isLoading || status === "checking") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto text-center">
          <Oval
            height={60}
            width={60}
            color="#3B82F6"
            wrapperStyle={{}}
            wrapperClass="mx-auto mb-4"
            visible={true}
            ariaLabel="oval-loading"
            secondaryColor="#93C5FD"
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Verifying Payment
          </h2>
          <p className="text-gray-600">
            Please wait while we confirm your payment...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto text-center">
          <FiXCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Payment Verification Failed
          </h2>
          <p className="text-gray-600 mb-6">
            We couldn't verify your payment status. Please contact support if
            you believe this is an error.
          </p>
          <div className="space-y-3">
            <button
              onClick={handleContinueShopping}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors w-full"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors w-full"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto text-center">
          <FiCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Payment Successful!
          </h2>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. Your order has been confirmed and will
            be processed shortly.
          </p>
          <div className="space-y-3">
            <button
              onClick={handleViewOrders}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors w-full"
            >
              View My Orders
            </button>
            <button
              onClick={handleContinueShopping}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors w-full"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto text-center">
          <FiXCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Payment Failed
          </h2>
          <p className="text-gray-600 mb-6">
            Your payment was not completed. Please try again or contact support
            if you need assistance.
          </p>
          <div className="space-y-3">
            <button
              onClick={handleContinueShopping}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors w-full"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => window.history.back()}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors w-full"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto text-center">
          <FiClock className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Payment Processing
          </h2>
          <p className="text-gray-600 mb-6">
            Your payment is being processed. You will receive a confirmation
            email once it's complete.
          </p>
          <div className="space-y-3">
            <button
              onClick={handleViewOrders}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors w-full"
            >
              Check Order Status
            </button>
            <button
              onClick={handleContinueShopping}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors w-full"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default PaymentSuccess;
