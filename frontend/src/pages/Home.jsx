//src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import mountains from "../assets/mountains.jpg";

const Home = () => {
  return (
    <div className="relative h-screen w-full flex items-center justify-center bg-cover bg-center" style={{
      backgroundImage: `url(${mountains})`
    }}>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      
      <div className="relative text-center text-white p-6 max-w-2xl">
        <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">Explore the World</h1>
        <p className="text-lg mb-6 drop-shadow-md">
          Discover and book unforgettable travel experiences, hassle-free.
        </p>
        
        <div className="space-x-4">
          <Link to="/register/customer" className="px-6 py-3 bg-blue-500 rounded-lg text-lg font-semibold shadow-md hover:bg-blue-600 transition">Register as Customer</Link>
          <Link to="/register/agent" className="px-6 py-3 bg-green-500 rounded-lg text-lg font-semibold shadow-md hover:bg-green-600 transition">Register as Agent</Link>
        </div>
        
        <div className="mt-6">
          <Link to="/login" className="text-lg underline hover:text-gray-300 transition">Already have an account? Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
