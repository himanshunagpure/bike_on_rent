// ExploreBikes.jsx — Tailwind CSS version (same UI & logic)
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { MapPin, Zap, Star, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import scooty from "../assets/scooty.png";

/* Google Fonts */
const FONT_LINK = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Outfit:wght@300;400;500;600;700&display=swap');`;

const FILTER_OPTIONS = ["All", "Scooty", "Bike", "Electric", "Sports"];

/* ── helpers ── */
const fakeRating = (id) => {
  const seed = id?.charCodeAt(0) || 4;
  return (3.8 + (seed % 12) * 0.1).toFixed(1);
};

const getTags = (bike) => {
  const tags = [];
  if (bike.fuelType)      tags.push(bike.fuelType);
  if (bike.cc)            tags.push(`${bike.cc}cc`);
  if (bike.transmission)  tags.push(bike.transmission);
  if (tags.length === 0)  tags.push("Ride Ready");
  return tags.slice(0, 3);
};

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
const ExploreBikes = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [bikes, setBikes]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");

  const queryParams = new URLSearchParams(location.search);
  const cityFilter  = queryParams.get("city");
const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  useEffect(() => {
    const fetchBikes = async () => {
      try {
        const res = await axios.get(`${API}/bikes`);
        let bikesData = [];
        if (Array.isArray(res.data))           bikesData = res.data;
        else if (Array.isArray(res.data.data)) bikesData = res.data.data;
        else if (res.data.data?.bikes)         bikesData = res.data.data.bikes;

        bikesData = bikesData.filter(
          (bike) => !bike.adminStatus || bike.adminStatus === "approved"
        );
        if (cityFilter) {
          bikesData = bikesData.filter(
            (bike) =>
              bike.location?.city?.toLowerCase() === cityFilter.toLowerCase()
          );
        }
        setBikes(bikesData);
      } catch (error) {
        console.error("Error fetching bikes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBikes();
  }, [cityFilter]);

  const displayed =
    activeFilter === "All"
      ? bikes
      : bikes.filter(
          (b) =>
            b.bikeName?.toLowerCase().includes(activeFilter.toLowerCase()) ||
            b.brand?.toLowerCase().includes(activeFilter.toLowerCase()) ||
            b.fuelType?.toLowerCase().includes(activeFilter.toLowerCase())
        );

  /* ── Loading ── */
  if (loading) {
    return (
      <>
        <style>{FONT_LINK}</style>
        <div
          className="min-h-screen flex flex-col items-center justify-center gap-4 text-[#3a6662] text-base"
          style={{ background: "#f5fafa", fontFamily: "'Outfit',sans-serif" }}
        >
          <div className="w-11 h-11 rounded-full border-[3px] border-[#d0eeec] border-t-[#20b2aa] animate-spin" />
          Finding rides near you…
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        ${FONT_LINK}

        /* pulse for badge dot */
        @keyframes eb_pulse {
          0%,100%{ opacity:1; transform:scale(1); }
          50%    { opacity:.5; transform:scale(1.5); }
        }

        /* dot-grid pattern for image zone */
        .eb-img-zone::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(32,178,170,0.15) 1px, transparent 1px);
          background-size: 20px 20px;
        }

        /* top accent bar scale on card hover */
        .eb-card .eb-card-bar {
          transform: scaleX(0);
          transform-origin: left;
          transition: transform .4s cubic-bezier(.22,1,.36,1);
        }
        .eb-card:hover .eb-card-bar { transform: scaleX(1); }

        /* image scale on card hover */
        .eb-card:hover .eb-img {
          transform: scale(1.1) translateY(-6px);
          filter: drop-shadow(0 16px 32px rgba(32,178,170,0.4));
        }

        /* price badge scale on card hover */
        .eb-card:hover .eb-price-badge {
          background: #178f88;
          transform: scale(1.05);
        }

        /* shimmer on button hover */
        .eb-btn::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
          transform: translateX(-100%);
          transition: transform .55s;
        }
        .eb-card:hover .eb-btn::before { transform: translateX(100%); }
        .eb-card:hover .eb-btn {
          box-shadow: 0 8px 28px rgba(32,178,170,0.5);
        }
      `}</style>

      {/* root */}
      <div
        className="min-h-screen relative overflow-x-hidden"
        style={{ background: "#f5fafa", fontFamily: "'Outfit',sans-serif" }}
      >
        {/* ── blobs ── */}
        <div
          className="fixed top-[-140px] right-[-140px] w-[500px] h-[500px] rounded-full pointer-events-none z-0"
          style={{ background: "radial-gradient(circle,rgba(32,178,170,0.16) 0%,transparent 70%)" }}
        />
        <div
          className="fixed bottom-[-180px] left-[-100px] w-[520px] h-[520px] rounded-full pointer-events-none z-0"
          style={{ background: "radial-gradient(circle,rgba(32,178,170,0.1) 0%,transparent 70%)" }}
        />
        <div
          className="fixed top-[42%] right-[10%] w-[260px] h-[260px] rounded-full pointer-events-none z-0"
          style={{ background: "radial-gradient(circle,rgba(32,178,170,0.07) 0%,transparent 70%)" }}
        />

        {/* ── inner wrapper ── */}
        <div className="relative z-10 max-w-[1280px] mx-auto px-10 pt-20 pb-24 max-sm:px-5 max-sm:pt-15 max-sm:pb-20">

          {/* ── HERO HEADER ── */}
          <motion.div
            className="text-center mb-[72px]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* badge */}
            <div className="inline-flex items-center gap-2 bg-[rgba(32,178,170,0.1)] border border-[#d0eeec] rounded-full px-[18px] py-[6px] text-[0.72rem] font-semibold tracking-[2px] uppercase text-[#20b2aa] mb-5">
              <span
                className="w-[7px] h-[7px] rounded-full bg-[#20b2aa]"
                style={{ boxShadow: "0 0 8px #20b2aa", animation: "eb_pulse 2s infinite" }}
              />
              {cityFilter ? `Rides in ${cityFilter}` : "Available Rides"}
            </div>

            <h1
              className="font-black text-[#0d2e2c] leading-[1.1] tracking-[-1px] mb-3.5"
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: "clamp(2.6rem,5vw,4rem)",
              }}
            >
              Explore{" "}
              <em className="not-italic" style={{ color: "#20b2aa" }}>Available</em>
              <br />Bikes Near You
            </h1>

            <p className="text-base text-[#7aadaa] font-normal max-w-[420px] mx-auto leading-[1.7]">
              Pick your perfect ride — scooties, sport bikes, or electrics — and hit the road today.
            </p>
          </motion.div>

          {/* ── FILTER CHIPS ── */}
          <motion.div
            className="flex justify-center flex-wrap gap-2.5 mb-14"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            {FILTER_OPTIONS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className="px-[22px] py-2 rounded-full border-[1.5px] text-[0.82rem] font-medium cursor-pointer transition-all duration-200"
                style={
                  activeFilter === f
                    ? {
                        background: "#20b2aa",
                        borderColor: "#20b2aa",
                        color: "#fff",
                        boxShadow: "0 4px 16px rgba(32,178,170,0.35)",
                        fontFamily: "'Outfit',sans-serif",
                      }
                    : {
                        background: "#fff",
                        borderColor: "#d0eeec",
                        color: "#3a6662",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                        fontFamily: "'Outfit',sans-serif",
                      }
                }
              >
                {f}
              </button>
            ))}
          </motion.div>

          {/* ── COUNT BAR ── */}
          {displayed.length > 0 && (
            <motion.div
              className="flex items-center justify-between mb-7 px-5 py-3.5 bg-white border-[1.5px] border-[#d0eeec] rounded-[14px]"
              style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
            >
              <span className="text-[0.88rem] text-[#3a6662] font-medium">
                Showing{" "}
                <strong className="text-[#20b2aa]">{displayed.length}</strong>{" "}
                bike{displayed.length !== 1 ? "s" : ""}
                {cityFilter && (
                  <> in <strong className="text-[#20b2aa]">{cityFilter}</strong></>
                )}
              </span>
              <span className="flex items-center gap-1.5 text-[0.8rem] text-[#7aadaa]">
                <Zap size={13} /> Best match first
              </span>
            </motion.div>
          )}

          {/* ── EMPTY STATE ── */}
          {displayed.length === 0 ? (
            <div className="text-center py-20 text-[#7aadaa]">
              <div className="text-[4rem] mb-4 opacity-40">🏍</div>
              <h3
                className="text-[1.5rem] text-[#3a6662] mb-2"
                style={{ fontFamily: "'Playfair Display',serif" }}
              >
                No bikes found
              </h3>
              <p>Try a different filter or check back soon.</p>
            </div>
          ) : (
            /* ── GRID ── */
            <div className="grid gap-7 max-sm:grid-cols-1"
              style={{ gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))" }}
            >
              <AnimatePresence>
                {displayed.map((bike, index) => (
                  <motion.div
                    key={bike._id}
                    className="eb-card bg-white rounded-[24px] overflow-hidden border-[1.5px] border-[#d0eeec] cursor-pointer relative transition-all duration-[350ms] hover:border-[#b2e4e1] hover:-translate-y-[6px]"
                    style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.45, delay: index * 0.07 }}
                    onClick={() => navigate(`/bikes/${bike._id}`)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = "0 20px 56px rgba(32,178,170,0.22)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.05)";
                    }}
                  >
                    {/* top accent bar */}
                    <div
                      className="eb-card-bar h-1"
                      style={{ background: "linear-gradient(90deg,#20b2aa,#178f88)" }}
                    />

                    {/* IMAGE ZONE */}
                    <div className="eb-img-zone relative bg-[#e6f7f6] px-6 pt-7 pb-4 overflow-hidden">
                      {/* availability pill */}
                      <div className="absolute top-4 left-4 z-20 flex items-center gap-[5px] bg-white/90 border border-[#d0eeec] text-[#178f88] text-[0.7rem] font-semibold tracking-[1px] uppercase px-3 py-1 rounded-full backdrop-blur-sm">
                        <span
                          className="w-1.5 h-1.5 rounded-full bg-green-500"
                          style={{ boxShadow: "0 0 6px #22c55e" }}
                        />
                        Available
                      </div>

                      {/* price badge */}
                      <div
                        className="eb-price-badge absolute top-4 right-4 z-20 flex items-center gap-1 text-white text-[0.82rem] font-bold px-3.5 py-[5px] rounded-full transition-all duration-200"
                        style={{
                          background: "#20b2aa",
                          boxShadow: "0 4px 14px rgba(32,178,170,0.4)",
                          fontFamily: "'Outfit',sans-serif",
                        }}
                      >
                        ₹{bike.pricing?.perDay}
                        <span className="font-normal opacity-80">/day</span>
                      </div>

                      <img
                        src={scooty}
                        alt={bike.bikeName}
                        className="eb-img w-full h-[190px] object-contain relative z-10 transition-all duration-[450ms]"
                        style={{ filter: "drop-shadow(0 8px 24px rgba(32,178,170,0.25))" }}
                      />
                    </div>

                    {/* CONTENT */}
                    <div className="px-6 pt-5 pb-6">
                      <div
                        className="text-[1.3rem] font-black text-[#0d2e2c] tracking-[-0.3px] mb-1"
                        style={{ fontFamily: "'Playfair Display',serif" }}
                      >
                        {bike.bikeName}
                      </div>
                      <div className="text-[0.85rem] text-[#7aadaa] font-normal mb-3.5">
                        {bike.brand} · {bike.model}
                      </div>

                      {/* tags */}
                      <div className="flex flex-wrap gap-[7px] mb-4">
                        {getTags(bike).map((tag) => (
                          <span
                            key={tag}
                            className="bg-[#e6f7f6] text-[#178f88] text-[0.72rem] font-semibold px-3 py-1 rounded-full tracking-[0.3px]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* meta row */}
                      <div className="flex items-center justify-between mb-[18px]">
                        <div className="flex items-center gap-[5px] text-[0.82rem] text-[#3a6662] font-medium">
                          <MapPin size={14} color="#20b2aa" />
                          {bike.location?.city || "India"}
                        </div>
                        <div className="flex items-center gap-[3px] text-[0.78rem] text-amber-400 font-semibold">
                          <Star size={12} fill="#f59e0b" color="#f59e0b" />
                          {fakeRating(bike._id)}
                          <span className="text-[#7aadaa] font-normal">(24)</span>
                        </div>
                      </div>

                      {/* CTA */}
                      <button
                        className="eb-btn w-full py-[13px] border-none rounded-xl text-white text-[0.92rem] font-semibold cursor-pointer flex items-center justify-center gap-1.5 relative overflow-hidden transition-all duration-200"
                        style={{
                          background: "linear-gradient(135deg,#20b2aa 0%,#178f88 100%)",
                          boxShadow: "0 4px 18px rgba(32,178,170,0.3)",
                          fontFamily: "'Outfit',sans-serif",
                          letterSpacing: "0.2px",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/bikes/${bike._id}`);
                        }}
                      >
                        View Details <ChevronRight size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ExploreBikes;