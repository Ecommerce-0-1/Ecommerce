import React from "react";
import FlashSales from "../../components/sections/FlashSales";

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-50 to-gray-100 py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold text-textColor2 mb-4">
            Welcome to Our E-commerce Store
          </h1>
          <p className="text-xl text-textColor mb-8 max-w-2xl mx-auto">
            Discover amazing products with unbeatable prices and quality. Shop now and save big on our flash sales!
          </p>
        </div>
      </section>

      {/* Flash Sales Section */}
      <FlashSales />
    </div>
  );
};

export default Home;
