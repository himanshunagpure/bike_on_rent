// BookingPage.jsx  — Tailwind CSS version (same UI & logic)
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar, Clock, IndianRupee, FileText, CreditCard,
  CheckCircle, Upload, Shield, ChevronRight, ChevronLeft,
} from "lucide-react";

/* Google Fonts injected once */
const FONT_LINK = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Outfit:wght@300;400;500;600;700&display=swap');`;

const STEPS = ["Duration", "Documents", "Summary", "Payment"];

/* ─── tiny helpers ─────────────────────────────────────────────────── */
const cls = (...args) => args.filter(Boolean).join(" ");

/* Step circle state */
const stepStatus = (i, step) =>
  i < step ? "done" : i === step ? "active" : "idle";

/* ─── BookingPage ───────────────────────────────────────────────────── */
const BookingPage = () => {
  const { bikeId } = useParams();
  const [bike, setBike]                     = useState(null);
  const [step, setStep]                     = useState(0);
  const [durationType, setDurationType]     = useState("day");
  const [startDate, setStartDate]           = useState("");
  const [endDate, setEndDate]               = useState("");
  const [aadhar, setAadhar]                 = useState(null);
  const [license, setLicense]               = useState(null);
  const aadharRef  = useRef();
  const licenseRef = useRef();
  const [amountBreakdown, setAmountBreakdown] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/bikes/${bikeId}`);
        setBike(res.data.data);
      } catch (err) { console.error(err); }
    })();
  }, [bikeId]);

  /* ── amount calculation ── */
  const calcAmount = () => {
    if (!startDate || !endDate || !bike) return null;
    const start = new Date(startDate), end = new Date(endDate);
    const diffMs = end - start;
    if (diffMs <= 0) return null;
    let units, rate, label;
    if (durationType === "hour") {
      units = Math.ceil(diffMs / 3600000);
      rate  = bike.pricing?.perHour ?? Math.round(bike.pricing?.perDay / 8);
      label = "hrs";
    } else {
      units = Math.ceil(diffMs / 86400000);
      rate  = bike.pricing?.perDay;
      label = "days";
    }
    const base          = units * rate;
    const platformFee   = Math.round(base * 0.05);
    const vendorEarning = base - platformFee;
    const total         = base + platformFee;
    return { units, rate, label, base, platformFee, vendorEarning, total };
  };

  const handleNext = () => {
    if (step === 0) {
      const amt = calcAmount();
      if (!amt) return alert("Please select valid dates.");
      setAmountBreakdown(amt);
    }
    if (step === 1 && (!aadhar || !license))
      return alert("Please upload both documents.");
    setStep((s) => s + 1);
  };

  const API = import.meta.env.VITE_API_URL;

  const handlePayment = async () => {
    try {
      const token = localStorage.getItem("token");
      const fd = new FormData();
      fd.append("aadharCard", aadhar);
      fd.append("drivingLicense", license);
      const docRes = await axios.post(
        `${API}/bookings/upload-docs`, fd,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } },
      );
      const { aadharUrl, licenseUrl } = docRes.data;
      const bookingRes = await axios.post(
        `${API}/bookings`,
        { bikeId, startDate, endDate, durationType,
          documents: { aadharCard: aadharUrl, drivingLicense: licenseUrl } },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const bookingId = bookingRes.data.booking._id;
      const orderRes = await axios.post(
        `${API}/payment/create-order`,
        { bookingId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const { orderId, amount, currency, key } = orderRes.data;
      const rzp = new window.Razorpay({
        key, amount, currency, order_id: orderId,
        name: "BikeOnRent", description: "Bike Booking Payment",
        handler: async (response) => {
          await axios.post(
            `${API}/payment/verify`,
            { ...response, bookingId },
            { headers: { Authorization: `Bearer ${token}` } },
          );
          setStep(4);
        },
        modal: { ondismiss: () => alert("Payment cancelled") },
        theme: { color: "#20B2AA" },
      });
      rzp.open();
    } catch (err) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.message || "Payment Failed");
    }
  };

  /* ── Loading ── */
  if (!bike) return (
    <>
      <style>{FONT_LINK}</style>
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4 text-[#3a6662] text-[0.95rem]"
        style={{ background: "#f5fafa", fontFamily: "'Outfit', sans-serif" }}
      >
        <div className="w-10 h-10 rounded-full border-[3px] border-[#d0eeec] border-t-[#20b2aa] animate-spin" />
        Loading your ride details…
      </div>
    </>
  );

  /* ── Step content ── */
  const renderStep = () => {

    /* SUCCESS */
    if (step === 4) return (
      <div className="text-center py-5">
        <motion.div
          className="w-[90px] h-[90px] rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: "linear-gradient(135deg,#20b2aa,#178f88)", boxShadow: "0 8px 32px rgba(32,178,170,0.4)" }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, delay: 0.1 }}
        >
          <CheckCircle size={44} color="#fff" strokeWidth={2} />
        </motion.div>
        <h2
          className="text-[1.9rem] font-black text-[#0d2e2c] mb-2 tracking-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Booking{" "}
          <em className="not-italic" style={{ color: "#20b2aa" }}>Confirmed!</em>
        </h2>
        <p className="text-[0.9rem] text-[#7aadaa] leading-relaxed max-w-[320px] mx-auto mb-6">
          Your booking is awaiting vendor approval. You'll receive an OTP for
          bike handover once confirmed.
        </p>
        <span className="inline-block bg-[#fffbeb] border border-[#fde68a] text-[#d97706] rounded-[10px] px-5 py-2.5 text-[0.8rem] font-bold tracking-widest uppercase">
          ⏳ Pending Vendor Approval
        </span>
      </div>
    );

    /* STEP 0 — DURATION */
    if (step === 0) return (
      <div>
        <label className="block text-[0.72rem] font-semibold tracking-[1px] uppercase text-[#3a6662] mb-2">
          Booking Type
        </label>
        <div className="grid grid-cols-2 gap-3 mb-5">
          {["hour", "day"].map((t) => (
            <button
              key={t}
              onClick={() => setDurationType(t)}
              className={cls(
                "flex items-center justify-center gap-2 py-[13px] rounded-xl border-[1.5px] text-[0.88rem] font-semibold transition-all duration-200 cursor-pointer",
                durationType === t
                  ? "text-white border-[#20b2aa]"
                  : "border-[#d0eeec] text-[#7aadaa] bg-white hover:border-[#b2e4e1] hover:text-[#20b2aa]",
              )}
              style={
                durationType === t
                  ? { background: "linear-gradient(135deg,#20b2aa,#178f88)", boxShadow: "0 4px 18px rgba(32,178,170,0.38)", fontFamily: "'Outfit',sans-serif" }
                  : { background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", fontFamily: "'Outfit',sans-serif" }
              }
            >
              {t === "hour" ? <Clock size={15} /> : <Calendar size={15} />}
              Per {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {[
          { label: `Start ${durationType === "hour" ? "Date & Time" : "Date"}`, val: startDate, set: setStartDate },
          { label: `End ${durationType === "hour" ? "Date & Time" : "Date"}`,   val: endDate,   set: setEndDate   },
        ].map(({ label, val, set }) => (
          <div className="mb-[18px]" key={label}>
            <label className="block text-[0.72rem] font-semibold tracking-[1px] uppercase text-[#3a6662] mb-2">
              {label}
            </label>
            <input
              type={durationType === "hour" ? "datetime-local" : "date"}
              value={val}
              onChange={(e) => set(e.target.value)}
              className="w-full bg-white border-[1.5px] border-[#d0eeec] rounded-xl px-4 py-[13px] text-[#0d2e2c] text-[0.95rem] outline-none transition-all duration-200 focus:border-[#20b2aa] focus:shadow-[0_0_0_4px_rgba(32,178,170,0.1)]"
              style={{ fontFamily: "'Outfit',sans-serif", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
            />
          </div>
        ))}

        {(() => {
          const p = calcAmount();
          return p ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between bg-[#e6f7f6] border border-[#d0eeec] rounded-xl px-4 py-3 text-[0.85rem] mt-1"
            >
              <span className="text-[#3a6662]">{p.units} {p.label} × ₹{p.rate}</span>
              <strong className="text-[#20b2aa] font-bold text-[1rem]">₹{p.base}</strong>
            </motion.div>
          ) : null;
        })()}
      </div>
    );

    /* STEP 1 — DOCUMENTS */
    if (step === 1) return (
      <div>
        <p className="text-[0.85rem] text-[#7aadaa] leading-[1.65] mb-5 px-4 py-3 bg-[#e6f7f6] rounded-xl border-l-4 border-[#20b2aa]">
          Upload clear photos or PDFs of your documents. Required for bike handover verification.
        </p>

        {[
          { label: "Aadhaar Card",     ref: aadharRef,  file: aadhar,  set: setAadhar,  Icon: Shield   },
          { label: "Driving License",  ref: licenseRef, file: license, set: setLicense, Icon: FileText },
        ].map(({ label, ref, file, set, Icon }) => (
          <div className="mb-[18px]" key={label}>
            <label className="block text-[0.72rem] font-semibold tracking-[1px] uppercase text-[#3a6662] mb-2">
              <Icon size={12} className="inline mr-1 align-middle" />{label}
            </label>
            <input
              type="file" accept="image/*,application/pdf"
              ref={ref} className="hidden"
              onChange={(e) => set(e.target.files[0])}
            />
            <button
              onClick={() => ref.current.click()}
              className={cls(
                "w-full flex items-center justify-between px-[18px] py-[14px] rounded-[14px] border-2 border-dashed text-[0.88rem] font-medium cursor-pointer transition-all duration-200",
                file
                  ? "border-solid border-[#20b2aa] bg-[#e6f7f6] text-[#178f88]"
                  : "border-[#d0eeec] bg-white text-[#7aadaa] hover:border-[#b2e4e1] hover:text-[#20b2aa] hover:bg-[#e6f7f6]",
              )}
              style={{ fontFamily: "'Outfit',sans-serif", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}
            >
              <span className="max-w-[78%] overflow-hidden text-ellipsis whitespace-nowrap">
                {file ? file.name : `Click to upload ${label}`}
              </span>
              {file
                ? <CheckCircle size={17} color="#20b2aa" />
                : <Upload size={17} />}
            </button>
          </div>
        ))}
      </div>
    );

    /* STEP 2 — SUMMARY */
    if (step === 2 && amountBreakdown) return (
      <div>
        {/* bike banner */}
        <div
          className="flex items-center justify-between rounded-2xl px-5 py-[18px] mb-4 text-white"
          style={{ background: "linear-gradient(135deg,#20b2aa,#178f88)" }}
        >
          <div>
            <div className="font-bold text-[1.15rem]" style={{ fontFamily: "'Playfair Display',serif" }}>
              {bike.bikeName}
            </div>
            <div className="text-[0.75rem] opacity-75 mt-0.5 tracking-[0.5px]">
              {durationType === "hour" ? "Hourly" : "Daily"} Rental
            </div>
          </div>
          <div className="text-[2.2rem] opacity-85">🏍</div>
        </div>

        {/* dates */}
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          {[["Start", startDate], ["End", endDate]].map(([l, v]) => (
            <div key={l} className="bg-[#e6f7f6] border border-[#d0eeec] rounded-xl px-3.5 py-3">
              <div className="text-[0.67rem] font-semibold tracking-[1.5px] uppercase text-[#7aadaa] mb-1">{l}</div>
              <div className="text-[0.82rem] font-semibold text-[#0d2e2c]">{v}</div>
            </div>
          ))}
        </div>

        {/* breakdown */}
        <div className="bg-white border-[1.5px] border-[#d0eeec] rounded-2xl overflow-hidden mb-3.5">
          {[
            [`${amountBreakdown.units} ${amountBreakdown.label} × ₹${amountBreakdown.rate}`, `₹${amountBreakdown.base}`],
            ["Platform Fee (5%)", `₹${amountBreakdown.platformFee}`],
            ["Vendor Earning",    `₹${amountBreakdown.vendorEarning}`],
          ].map(([label, val]) => (
            <div
              key={label}
              className="flex justify-between items-center px-[18px] py-[13px] border-b border-[#e6f7f6] last:border-b-0 text-[0.88rem]"
            >
              <span className="text-[#3a6662]">{label}</span>
              <b className="text-[#0d2e2c] font-semibold">{val}</b>
            </div>
          ))}
          <div className="flex justify-between items-center px-[18px] py-4 bg-[#e6f7f6] border-t-2 border-[#d0eeec]">
            <div className="flex items-center gap-1.5 font-bold text-[#0d2e2c] text-[0.95rem]">
              <IndianRupee size={16} color="#20b2aa" /> Total
            </div>
            <div
              className="text-[1.7rem] font-black tracking-tight"
              style={{ fontFamily: "'Playfair Display',serif", color: "#20b2aa" }}
            >
              ₹{amountBreakdown.total}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[0.8rem] text-[#178f88] font-medium bg-[#e6f7f6] border border-[#d0eeec] rounded-[10px] px-3.5 py-2.5 mb-2.5">
          <CheckCircle size={14} color="#20b2aa" />
          Documents uploaded · pending vendor verification
        </div>
        <p className="text-[0.75rem] text-center text-[#7aadaa]">
          After payment, status will be{" "}
          <span className="text-amber-600 font-semibold">PENDING_VENDOR_APPROVAL</span>
        </p>
      </div>
    );
  };

  /* ── Step indicator helpers ── */
  const circleStyle = (s) => {
    if (s === "done")   return { background: "#20b2aa", color: "#fff", boxShadow: "0 4px 12px rgba(32,178,170,0.4)", border: "2px solid transparent" };
    if (s === "active") return { background: "#20b2aa", color: "#fff", boxShadow: "0 4px 16px rgba(32,178,170,0.5)", border: "2px solid transparent", transform: "scale(1.1)" };
    return { background: "#fff", color: "#7aadaa", border: "2px solid #d0eeec" };
  };

  return (
    <>
      <style>{FONT_LINK}</style>

      {/* root */}
      <div
        className="min-h-screen flex items-center justify-center px-5 py-[60px] relative overflow-hidden"
        style={{ background: "#f5fafa", fontFamily: "'Outfit',sans-serif" }}
      >
        {/* blobs */}
        <div
          className="fixed top-[-140px] right-[-140px] w-[500px] h-[500px] rounded-full pointer-events-none z-0"
          style={{ background: "radial-gradient(circle,rgba(32,178,170,0.16) 0%,transparent 70%)" }}
        />
        <div
          className="fixed bottom-[-180px] left-[-100px] w-[520px] h-[520px] rounded-full pointer-events-none z-0"
          style={{ background: "radial-gradient(circle,rgba(32,178,170,0.1) 0%,transparent 70%)" }}
        />

        {/* card */}
        <motion.div
          className="relative z-10 bg-white border-[1.5px] border-[#d0eeec] rounded-[28px] w-full max-w-[560px] overflow-hidden"
          style={{ boxShadow: "0 8px 40px rgba(32,178,170,0.1)" }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* top accent bar */}
          <div
            className="h-1"
            style={{ background: "linear-gradient(90deg,#20b2aa,#178f88)" }}
          />

          <div className="px-10 pt-10 pb-9 max-sm:px-5 max-sm:pt-7 max-sm:pb-6">

            {/* ── Header ── */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-[#e6f7f6] border border-[#d0eeec] rounded-full px-4 py-[5px] text-[0.7rem] font-semibold tracking-[2px] uppercase text-[#20b2aa] mb-3.5">
                <span
                  className="w-1.5 h-1.5 rounded-full bg-[#20b2aa]"
                  style={{
                    boxShadow: "0 0 7px #20b2aa",
                    animation: "bp_pulse 2s infinite",
                  }}
                />
                Secure Booking
              </div>
              <h1
                className="text-[2rem] font-black text-[#0d2e2c] tracking-[-0.5px] leading-[1.15] mb-1.5"
                style={{ fontFamily: "'Playfair Display',serif" }}
              >
                Confirm Your{" "}
                <em className="not-italic" style={{ color: "#20b2aa" }}>Ride</em>
              </h1>
              <p className="text-[0.88rem] text-[#7aadaa]">
                <strong className="text-[#3a6662] font-semibold">{bike.bikeName}</strong>
                {" · "}₹{bike.pricing.perDay}/day
                {bike.pricing?.perHour ? ` · ₹${bike.pricing.perHour}/hr` : ""}
              </p>
            </div>

            {/* ── Step indicator ── */}
            {step < 4 && (
              <div className="flex items-center bg-[#e6f7f6] border border-[#d0eeec] rounded-2xl px-5 py-4 mb-8">
                {STEPS.map((s, i) => {
                  const st = stepStatus(i, step);
                  return (
                    <React.Fragment key={s}>
                      <div className="flex flex-col items-center gap-[5px] flex-none">
                        <div
                          className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-[0.78rem] font-bold transition-all duration-300"
                          style={circleStyle(st)}
                        >
                          {i < step ? <CheckCircle size={15} /> : i + 1}
                        </div>
                        <span
                          className="text-[0.65rem] font-semibold tracking-[0.8px] uppercase transition-colors duration-300"
                          style={{
                            color: st === "active" ? "#20b2aa" : st === "done" ? "#178f88" : "#7aadaa",
                          }}
                        >
                          {s}
                        </span>
                      </div>
                      {i < STEPS.length - 1 && (
                        <div
                          className="flex-1 h-[2px] mx-1.5 mb-[18px] rounded-sm transition-all duration-300"
                          style={{ background: i < step ? "#20b2aa" : "#d0eeec" }}
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            )}

            {/* ── Step content ── */}
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -18 }}
                transition={{ duration: 0.22 }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>

            {/* ── Navigation ── */}
            {step < 4 && (
              <div className="flex gap-3 mt-7">
                {step > 0 && (
                  <button
                    onClick={() => setStep((s) => s - 1)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-[13px] border-[1.5px] border-[#d0eeec] rounded-xl bg-white text-[#3a6662] text-[0.92rem] font-semibold cursor-pointer transition-all duration-200 hover:border-[#b2e4e1] hover:text-[#20b2aa] hover:bg-[#e6f7f6]"
                    style={{ fontFamily: "'Outfit',sans-serif", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
                  >
                    <ChevronLeft size={16} /> Back
                  </button>
                )}

                {step < 3 ? (
                  <button
                    onClick={handleNext}
                    className="flex-[2] flex items-center justify-center gap-2 py-[14px] border-none rounded-xl text-white text-[0.95rem] font-semibold cursor-pointer relative overflow-hidden transition-all duration-200 group"
                    style={{
                      background: "linear-gradient(135deg,#20b2aa,#178f88)",
                      boxShadow: "0 5px 22px rgba(32,178,170,0.38)",
                      fontFamily: "'Outfit',sans-serif",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 30px rgba(32,178,170,0.52)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 5px 22px rgba(32,178,170,0.38)"; e.currentTarget.style.transform = ""; }}
                  >
                    Continue <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    onClick={handlePayment}
                    className="flex-1 flex items-center justify-center gap-2.5 py-4 border-none rounded-[14px] text-white text-[1.1rem] font-bold cursor-pointer relative overflow-hidden transition-all duration-200"
                    style={{
                      background: "linear-gradient(135deg,#20b2aa,#178f88)",
                      boxShadow: "0 8px 28px rgba(32,178,170,0.45)",
                      fontFamily: "'Playfair Display',serif",
                      letterSpacing: "0.3px",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 12px 36px rgba(32,178,170,0.6)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 8px 28px rgba(32,178,170,0.45)"; e.currentTarget.style.transform = ""; }}
                  >
                    <CreditCard size={18} /> Pay Now
                  </button>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* pulse keyframe (only badge dot needs it) */}
      <style>{`
        @keyframes bp_pulse {
          0%,100%{ opacity:1; transform:scale(1); }
          50%    { opacity:.5; transform:scale(1.5); }
        }
      `}</style>
    </>
  );
};

export default BookingPage;