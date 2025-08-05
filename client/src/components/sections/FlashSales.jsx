import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import ProductCard from "../ui/ProductCard";
import { getDiscountedProducts } from "../../queries/getQueryFns";
import { Oval } from "react-loader-spinner";

const FlashSales = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 23,
    minutes: 19,
    seconds: 56
  });

  // Fetch discounted products
  const {
    data: discountedProductsData,
    isLoading,
    error
  } = useQuery({
    queryKey: ["discountedProducts"],
    queryFn: getDiscountedProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const total = prev.days * 86400 + prev.hours * 3600 + prev.minutes * 60 + prev.seconds;
        if (total <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        
        const newTotal = total - 1;
        return {
          days: Math.floor(newTotal / 86400),
          hours: Math.floor((newTotal % 86400) / 3600),
          minutes: Math.floor((newTotal % 3600) / 60),
          seconds: newTotal % 60
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handle "View All Products" button
  const handleViewAllProducts = () => {
    navigate("/products");
  };

  // Get the discounted products from API response
  const discountedProducts = discountedProductsData?.Discounted_Products || [];
  
  // Limit to first 8 products for the flash sales section
  const flashSaleProducts = discountedProducts.slice(0, 8);

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="flex justify-center items-center h-64">
            <Oval
              height={50}
              width={50}
              color="#DB4444"
              secondaryColor="#f3f4f6"
              strokeWidth={2}
              strokeWidthSecondary={2}
            />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center text-gray-500">
            Failed to load flash sales products. Please try again later.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="mb-12">
          {/* Today's Label */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-5 h-10 bg-primary rounded"></div>
            <span className="text-primary font-semibold">Today's</span>
          </div>

          {/* Title and Timer */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-end gap-6">
              <h2 className="text-4xl font-bold text-textColor2">Flash Sales</h2>
              
              {/* Countdown Timer */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="text-center">
                    <div className="text-xs text-textColor mb-1">Days</div>
                    <div className="text-2xl font-bold text-textColor2">
                      {String(timeLeft.days).padStart(2, '0')}
                    </div>
                  </div>
                  <span className="text-primary text-xl font-bold">:</span>
                  <div className="text-center">
                    <div className="text-xs text-textColor mb-1">Hours</div>
                    <div className="text-2xl font-bold text-textColor2">
                      {String(timeLeft.hours).padStart(2, '0')}
                    </div>
                  </div>
                  <span className="text-primary text-xl font-bold">:</span>
                  <div className="text-center">
                    <div className="text-xs text-textColor mb-1">Minutes</div>
                    <div className="text-2xl font-bold text-textColor2">
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </div>
                  </div>
                  <span className="text-primary text-xl font-bold">:</span>
                  <div className="text-center">
                    <div className="text-xs text-textColor mb-1">Seconds</div>
                    <div className="text-2xl font-bold text-textColor2">
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* View All Products Button */}
            <button
              onClick={handleViewAllProducts}
              className="bg-primary hover:bg-buttonHover text-white font-medium py-3 px-6 rounded-md transition-colors duration-300 flex items-center gap-2 w-fit"
            >
              View All Products
              <FiArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Products Grid */}
        {flashSaleProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {flashSaleProducts.map((discountData) => (
              <ProductCard
                key={discountData.id}
                product={discountData.products}
                discount={discountData}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-medium text-textColor2 mb-2">
              No Flash Sales Available
            </h3>
            <p className="text-textColor">
              Check back later for amazing deals and discounts!
            </p>
          </div>
        )}

        {/* Bottom border line */}
        <div className="border-b border-gray-200 mt-16"></div>
      </div>
    </section>
  );
};

export default FlashSales;
