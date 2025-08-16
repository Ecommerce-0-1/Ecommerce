import React from "react";
import { useNavigate } from "react-router-dom";
import { FiXCircle, FiArrowLeft } from "react-icons/fi";

const PaymentCancel = () => {
  const navigate = useNavigate();

  const handleContinueShopping = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto text-center">
        <FiXCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Payment Cancelled
        </h2>
        <p className="text-gray-600 mb-6">
          Your payment was cancelled. No charges were made to your account. You
          can try again anytime.
        </p>

        <div className="space-y-3">
          <button
            onClick={handleGoBack}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors w-full flex items-center justify-center"
          >
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Try Again
          </button>

          <button
            onClick={handleContinueShopping}
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors w-full"
          >
            Continue Shopping
          </button>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-2">Need Help?</h3>
          <p className="text-sm text-blue-700">
            If you're having trouble with payment, please contact our support
            team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;
