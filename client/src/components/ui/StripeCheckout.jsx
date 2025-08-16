import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createCheckoutSession } from "../../queries/postQueryFns";
import FilledButton from "./buttons/FilledButton";
import { FiCreditCard, FiLock } from "react-icons/fi";

const StripeCheckout = ({ order, billingData, onSuccess, onCancel }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const checkoutMutation = useMutation({
    mutationFn: createCheckoutSession,
    onSuccess: (data) => {
      if (data.success) {
        // Redirect to Stripe Checkout
        window.location.href = data.checkout_url;
      } else {
        toast.error(data.message || "Failed to create checkout session");
      }
    },
    onError: (error) => {
      console.error("Checkout error:", error);
      toast.error("Failed to create checkout session. Please try again.");
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const handleCheckout = async () => {
    if (!order || !billingData) {
      toast.error("Missing order or billing information");
      return;
    }

    setIsLoading(true);

    const checkoutData = {
      order_id: order.id,
      billing_data: billingData,
    };

    checkoutMutation.mutate(checkoutData);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="flex justify-center items-center mb-4">
          <FiCreditCard className="w-8 h-8 text-primary mr-2" />
          <FiLock className="w-6 h-6 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Secure Payment
        </h3>
        <p className="text-gray-600 text-sm">
          Your payment information is protected by Stripe's secure
          infrastructure
        </p>
      </div>

      <div className="mb-6">
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h4 className="font-medium text-gray-800 mb-2">Order Summary</h4>
          <div className="flex justify-between text-sm">
            <span>Order Total:</span>
            <span className="font-semibold">
              ${order?.total_amount?.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 mb-4">
          <h4 className="font-medium text-blue-800 mb-2">Security Features</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• PCI DSS compliant payment processing</li>
            <li>• No card data stored on our servers</li>
            <li>• 256-bit SSL encryption</li>
            <li>• Stripe's secure hosted checkout</li>
          </ul>
        </div>
      </div>

      <div className="space-y-3">
        <FilledButton
          text={
            isLoading ? "Creating Checkout..." : "Proceed to Secure Checkout"
          }
          onClick={handleCheckout}
          isButton={true}
          isDisable={isLoading}
          width="w-full"
          height="h-12"
          className="bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors duration-200"
        />

        {onCancel && (
          <FilledButton
            text="Cancel"
            onClick={onCancel}
            isButton={true}
            width="w-full"
            height="h-10"
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors duration-200"
          />
        )}
      </div>

      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          By proceeding, you agree to our terms of service and privacy policy
        </p>
      </div>
    </div>
  );
};

export default StripeCheckout;
