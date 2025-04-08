import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import mountains from "../assets/mountains.jpg";
import { getCustomerPackages } from "../services/packageService";

const Home = () => {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const data = await getCustomerPackages();
        setPackages(data);
      } catch (error) {
        console.error("Failed to fetch packages:", error);
      }
    };
  
    fetchPackages();
  }, []);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div
        className="relative h-screen bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${mountains})` }}
      >
        <div className="absolute inset-0 bg-black opacity-60" />
        <motion.div
          className="relative text-center text-white p-6 max-w-3xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">Discover Your Next Adventure</h1>
          <p className="text-xl mb-6 drop-shadow-md">
            Book unique travel experiences effortlessly and securely.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/register/customer"
              className="px-6 py-3 bg-blue-500 rounded-full text-lg font-semibold shadow-md hover:bg-blue-600 transition"
            >
              Register as Customer
            </Link>
            <Link
              to="/register/agent"
              className="px-6 py-3 bg-green-500 rounded-full text-lg font-semibold shadow-md hover:bg-green-600 transition"
            >
              Register as Agent
            </Link>
          </div>
          <div className="mt-6">
            <Link
              to="/login"
              className="text-lg underline hover:text-gray-300 transition"
            >
              Already have an account? Login
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Featured Packages */}
      <section className="py-16 bg-gray-100">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800">Top Travel Packages</h2>
          <p className="text-gray-600 mt-2">Handpicked destinations for your next getaway</p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 px-6">
          {packages.length > 0 ? (
            packages.map((pkg) => (
              <motion.div
                key={pkg._id}
                className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300"
                whileHover={{ scale: 1.03 }}
              >
                <img
                  src={pkg.image || "https://images.unsplash.com/photo-1646204894165-95ed03d988ad?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                  alt={pkg.title}
                  className="w-full h-60 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800">{pkg.title}</h3>
                  <p className="text-sm text-gray-600">{pkg.destination}</p>
                  <p className="text-lg font-semibold text-blue-600 mt-2">₹{pkg.price}</p>
                  <Link
                    to="/login"
                    className="inline-block mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full"
                  >
                    Book Now
                  </Link>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-center col-span-full text-gray-600">Loading packages...</p>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-600 text-white py-12 text-center">
        <h2 className="text-3xl font-semibold mb-4">Ready to explore?</h2>
        <p className="text-lg mb-6">Login to get personalized recommendations and deals</p>
        <div className="space-x-4">
          <Link
            to="/login"
            className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-full hover:bg-gray-200 transition"
          >
            Login as Customer
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-full hover:bg-gray-200 transition"
          >
            Login as Agent
          </Link>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 text-center py-6">
        <p>&copy; {new Date().getFullYear()} TravelEase. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
