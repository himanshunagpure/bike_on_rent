import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Star, Shield, Clock, Calendar, ChevronLeft, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const BikeDetails = () => {
  const { bikeId } = useParams();
  const navigate = useNavigate();

  const [bike, setBike] = useState(null);
  const [loading, setLoading] = useState(true);


    const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API}/bikes/${bikeId}`);
        setBike(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [bikeId]);

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-[#f5fafa]">
        <div className="w-10 h-10 border-4 border-teal-100 border-t-teal-500 rounded-full animate-spin"></div>
        <p className="text-gray-500">Loading bike...</p>
      </div>
    );

  if (!bike) return <div className="p-10 text-red-500">Bike not found</div>;

  return (
    <div className="min-h-screen bg-white font-[Outfit] text-[#0d2e2c]">

      {/* TOPBAR */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 border px-4 py-1 rounded-full text-sm hover:text-teal-500"
          >
            <ChevronLeft size={14} /> Back
          </button>
          <span className="font-semibold">{bike.bikeName}</span>
        </div>

        <button
          onClick={() => navigate(`/booking/${bike._id}`)}
          className="hidden md:flex items-center gap-2 bg-gradient-to-r from-teal-400 to-teal-600 text-white px-5 py-2 rounded-full shadow"
        >
          <Calendar size={14} /> Book Now
        </button>
      </div>

      {/* HERO */}
      <motion.div
        className="relative h-[420px] flex items-center justify-center bg-[#e8f8f7]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* glow */}
        <div className="absolute w-[380px] h-[380px] rounded-full hero-glow"></div>

        {/* badge */}
        <div className="absolute top-6 left-6 bg-white px-4 py-1 rounded-full text-xs flex items-center gap-2 shadow">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Available Now
        </div>

        {/* image */}
        <img
          src={`${API}${bike.images?.[0]}`}
          className="h-[340px] object-contain shadow-bike hover:scale-105 transition"
        />

        {/* price */}
        <div className="absolute bottom-6 right-6 bg-teal-500 text-white px-5 py-3 rounded-xl shadow">
          <p className="text-xl font-bold">₹{bike.pricing?.perDay}</p>
          <p className="text-xs opacity-80">per day</p>
        </div>
      </motion.div>

      {/* CONTENT */}
      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* TITLE */}
        <div className="flex justify-between items-center flex-wrap gap-3">
          <h1 className="text-3xl font-black">{bike.bikeName}</h1>

          <div className="flex items-center gap-1 bg-teal-50 px-3 py-1 rounded-full text-sm">
            <Star size={14} fill="#f59e0b" color="#f59e0b" />
            4.5
          </div>
        </div>

        {/* META */}
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-1">
            <MapPin size={12} /> {bike.location?.city}
          </span>
          <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
            {bike.brand} · {bike.model}
          </span>
        </div>

        {/* PRICING */}
        <div className="mt-10">
          <h2 className="font-semibold mb-4">Pricing</h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-teal-50 p-5 rounded-xl">
              <p className="text-sm text-gray-500">Per Day</p>
              <p className="text-2xl font-bold text-teal-500">
                ₹{bike.pricing?.perDay}
              </p>
            </div>

            <div className="bg-teal-50 p-5 rounded-xl">
              <p className="text-sm text-gray-500">Per Hour</p>
              <p className="text-2xl font-bold text-teal-500">
                ₹{bike.pricing?.perHour || "-"}
              </p>
            </div>
          </div>
        </div>

        {/* FEATURES */}
        <div className="mt-10">
          <h2 className="font-semibold mb-4">Features</h2>

          <div className="flex flex-wrap gap-3">
            {["Helmet", "Insurance", "Support"].map((f) => (
              <span
                key={f}
                className="bg-teal-50 px-4 py-1 rounded-full flex items-center gap-1 text-sm"
              >
                <CheckCircle size={14} /> {f}
              </span>
            ))}
          </div>
        </div>

        {/* OWNER */}
        <div className="mt-10 bg-gray-50 p-5 rounded-xl flex items-center gap-4">
          <div className="w-12 h-12 bg-teal-500 text-white rounded-full flex items-center justify-center">
            🧑
          </div>

          <div>
            <p className="font-semibold">Verified Owner</p>
            <p className="text-sm text-gray-500">Member since 2023</p>
          </div>

          <div className="ml-auto text-sm flex items-center gap-1 bg-teal-50 px-3 py-1 rounded-full">
            <Shield size={12} /> Verified
          </div>
        </div>

        {/* BUTTON */}
        <button
          onClick={() => navigate(`/booking/${bike._id}`)}
          className="w-full mt-10 py-4 bg-gradient-to-r from-teal-400 to-teal-600 text-white rounded-xl font-bold shadow-lg hover:scale-[1.02] transition"
        >
          Book This Bike
        </button>
      </div>

      {/* MOBILE BAR */}
      <div className="fixed bottom-0 w-full bg-white border-t flex justify-between items-center px-6 py-3 md:hidden">
        <div>
          <p className="font-bold text-teal-500">₹{bike.pricing?.perDay}</p>
          <p className="text-xs text-gray-500">per day</p>
        </div>

        <button
          onClick={() => navigate(`/booking/${bike._id}`)}
          className="bg-teal-500 text-white px-6 py-2 rounded-lg"
        >
          Book
        </button>
      </div>
    </div>
  );
};

export default BikeDetails;