// PublishBike.jsx — Tailwind CSS version (same UI & logic)
import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bike, Zap, MapPin, FileText,
  ChevronRight, ChevronLeft, CheckCircle, Upload,
} from "lucide-react";

/* Google Fonts + keyframes that can't be done in Tailwind without config */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Outfit:wght@300;400;500;600;700&display=swap');

.pb-file-input::file-selector-button {
  margin-right: 10px;
  padding: 6px 14px;
  border-radius: 999px;
  border: none;
  background: #e8f8f7;
  color: #178f88;
  font-family: 'Outfit', sans-serif;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  transition: background .2s;
}
.pb-file-input::file-selector-button:hover { background: #c5ecea; }

.pb-section-label::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #ceecea;
}

.pb-btn-next::before,
.pb-btn-submit::before {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
  transform: translateX(-100%);
  transition: transform .5s;
}
.pb-btn-next:hover:not(:disabled)::before,
.pb-btn-submit:hover:not(:disabled)::before {
  transform: translateX(100%);
}

.pb-card-bar-hover {
  transform: scaleX(0);
  transform-origin: left;
  transition: transform .4s cubic-bezier(.22,1,.36,1);
}
`;

/* ── constants ── */
const STEPS = [
  { icon: <Bike size={17} color="#20b2aa" />,        label: "Basic Details",      desc: "Name, type, brand"     },
  { icon: <Zap size={17} color="#20b2aa" />,         label: "Specs & Pricing",    desc: "Engine, fuel, rates"   },
  { icon: <CheckCircle size={17} color="#20b2aa" />, label: "Availability",       desc: "When it's available"   },
  { icon: <MapPin size={17} color="#20b2aa" />,      label: "Location",           desc: "City & address"        },
  { icon: <FileText size={17} color="#20b2aa" />,    label: "Documents & Photos", desc: "RC, insurance, images" },
];
const TOTAL_STEPS = 5;

/* ── tiny helpers ── */
const st = (i, step) => (i + 1) < step ? "done" : (i + 1) === step ? "active" : "idle";

/* ─────────────── Sub-components ─────────────── */

/* Playfair header block at top of each step */
const StepHeader = ({ icon, title, sub, step }) => (
  <div
    className="flex items-center gap-3.5 mb-7 pb-5"
    style={{ borderBottom: "1px solid #ceecea" }}
  >
    <div className="w-[46px] h-[46px] flex-shrink-0 flex items-center justify-center rounded-[14px] bg-[#e8f8f7] border-[1.5px] border-[#ceecea]">
      {icon}
    </div>
    <div>
      <div
        className="text-[1.4rem] font-black text-[#0d2e2c] tracking-[-0.3px]"
        style={{ fontFamily: "'Playfair Display',serif" }}
      >
        {title}
      </div>
      <div className="text-[0.82rem] text-[#7aadaa] mt-0.5">{sub}</div>
    </div>
    <div className="ml-auto text-[0.75rem] font-semibold text-[#7aadaa] bg-[#e8f8f7] border border-[#ceecea] rounded-full px-3 py-1 whitespace-nowrap">
      Step {step} / 5
    </div>
  </div>
);

/* Section divider label */
const SectionLabel = ({ children }) => (
  <div className="pb-section-label flex items-center gap-2 text-[0.68rem] font-bold tracking-[1.5px] uppercase text-[#7aadaa] mb-3.5 mt-1.5"
    style={{ fontFamily: "'Outfit',sans-serif" }}
  >
    {children}
  </div>
);

/* Styled input */
const Input = ({ className = "", ...props }) => (
  <input
    className={`w-full bg-[#f8f9fa] border-[1.5px] border-[#e5e7eb] rounded-[11px] px-3.5 py-3 text-[#0d2e2c] text-[0.93rem] outline-none transition-all duration-200 focus:border-[#20b2aa] focus:shadow-[0_0_0_3px_rgba(32,178,170,0.1)] focus:bg-white placeholder-[#b5c5c4] ${className}`}
    style={{ fontFamily: "'Outfit',sans-serif" }}
    {...props}
  />
);

/* Styled select */
const Select = ({ children, ...props }) => (
  <select
    className="w-full bg-[#f8f9fa] border-[1.5px] border-[#e5e7eb] rounded-[11px] px-3.5 py-3 text-[#0d2e2c] text-[0.93rem] outline-none transition-all duration-200 focus:border-[#20b2aa] focus:shadow-[0_0_0_3px_rgba(32,178,170,0.1)] focus:bg-white"
    style={{ fontFamily: "'Outfit',sans-serif" }}
    {...props}
  >
    {children}
  </select>
);

/* Field wrapper */
const Field = ({ label, children, span2 = false }) => (
  <div className={`flex flex-col gap-1.5 ${span2 ? "col-span-2 max-sm:col-span-1" : ""}`}>
    {label && (
      <label className="text-[0.72rem] font-semibold tracking-[0.5px] uppercase text-[#3a6662]">
        {label}
      </label>
    )}
    {children}
  </div>
);

/* Chip toggle */
const Chip = ({ active, onClick, children, small = false }) => (
  <button
    type="button"
    onClick={onClick}
    className={`inline-flex items-center gap-1.5 rounded-full border-[1.5px] font-semibold cursor-pointer transition-all duration-200 select-none
      ${small ? "px-3.5 py-1.5 text-[0.8rem]" : "px-[18px] py-2.5 text-[0.83rem]"}
      ${active
        ? "bg-[#20b2aa] border-[#20b2aa] text-white shadow-[0_3px_14px_rgba(32,178,170,0.35)]"
        : "bg-white border-[#e5e7eb] text-[#6b7280] hover:border-[#b2e4e1] hover:text-[#20b2aa]"
      }`}
    style={{ fontFamily: "'Outfit',sans-serif" }}
  >
    {children}
  </button>
);

/* Nav buttons */
const BackBtn = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex items-center gap-1.5 px-5 py-3 border-[1.5px] border-[#ceecea] rounded-[11px] bg-white text-[#3a6662] text-[0.9rem] font-semibold cursor-pointer transition-all duration-200 hover:border-[#20b2aa] hover:text-[#20b2aa]"
    style={{ fontFamily: "'Outfit',sans-serif" }}
  >
    <ChevronLeft size={15} /> Back
  </button>
);

const NextBtn = ({ onClick, disabled, children }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="pb-btn-next flex items-center gap-1.5 px-7 py-3 border-none rounded-[11px] text-white text-[0.93rem] font-bold cursor-pointer relative overflow-hidden transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
    style={{
      background: "linear-gradient(135deg,#20b2aa,#178f88)",
      boxShadow: "0 5px 18px rgba(32,178,170,0.35)",
      fontFamily: "'Outfit',sans-serif",
    }}
    onMouseEnter={(e) => { if (!disabled) { e.currentTarget.style.boxShadow = "0 8px 26px rgba(32,178,170,0.5)"; e.currentTarget.style.transform = "translateY(-1px)"; }}}
    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 5px 18px rgba(32,178,170,0.35)"; e.currentTarget.style.transform = ""; }}
  >
    {children}
  </button>
);

/* Upload card */
const UploadCard = ({ done, icon, title, sub, children }) => (
  <div
    className={`rounded-[14px] p-4 flex flex-col gap-3 transition-colors duration-200 border-[1.5px]
      ${done ? "border-[#20b2aa] bg-[#e8f8f7]" : "bg-[#f8f9fa] border-[#e5e7eb] hover:border-[#a0d4d0]"}`}
  >
    <div className="flex items-center gap-2.5">
      <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center bg-white rounded-[10px] text-[1.1rem] shadow-[0_1px_4px_rgba(0,0,0,0.07)]">
        {icon}
      </div>
      <div>
        <div className="text-[0.88rem] font-bold text-[#0d2e2c]">{title}</div>
        <div className="text-[0.72rem] text-[#7aadaa] mt-px">{sub}</div>
      </div>
      {done && <CheckCircle size={18} color="#20b2aa" className="ml-auto" />}
    </div>
    {children}
  </div>
);

/* ─────────────── MAIN ─────────────── */
const PublishBike = () => {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    bikeName: "", bikeNumber: "", bikeType: "", brand: "", model: "",
    year: "", description: "", fuelType: "", transmission: "",
    engineCapacity: "", mileage: "", perHour: "", perDay: "",
    securityDeposit: "", lateFeePerHour: "", minHours: 1, maxHours: 72,
    cancellationPolicy: "moderate", instantBooking: false,
    city: "", addressLine: "", landmark: "", pincode: "",
    latitude: "", longitude: "", availabilityType: "always", alwaysAvailable: true,
    weekly: { monday:true, tuesday:true, wednesday:true, thursday:true, friday:true, saturday:true, sunday:true },
  });

  const [documents, setDocuments] = useState({
    rcBook: null, insurance: null, insuranceValidTill: "",
    pollution: null, pollutionValidTill: "",
  });

  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(p => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleWeeklyToggle = (day) =>
    setFormData(p => ({ ...p, weekly: { ...p.weekly, [day]: !p.weekly[day] } }));

  const handleDocChange = (e) => {
    const { name, value, files } = e.target;
    setDocuments(p => ({ ...p, [name]: files ? files[0] : value }));
  };

  const handleImages = (e) => setImages(Array.from(e.target.files));

  const nextStep = () => setStep(p => Math.min(p + 1, TOTAL_STEPS));
  const prevStep = () => setStep(p => Math.max(p - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const data  = new FormData();
      Object.entries(formData).forEach(([k, v]) =>
        data.append(k, k === "weekly" ? JSON.stringify(v) : v)
      );
      if (documents.rcBook)    data.append("rcBook",    documents.rcBook);
      if (documents.insurance) data.append("insurance", documents.insurance);
      data.append("insuranceValidTill", documents.insuranceValidTill);
      if (documents.pollution) data.append("pollution", documents.pollution);
      data.append("pollutionValidTill", documents.pollutionValidTill);
      images.forEach(img => data.append("images", img));
      data.append("pricing",      JSON.stringify({ perHour: formData.perHour, perDay: formData.perDay }));
      data.append("bookingRules", JSON.stringify({ minHours: formData.minHours, maxHours: formData.maxHours }));
      data.append("location",     JSON.stringify({
        city: formData.city, addressLine: formData.addressLine,
        landmark: formData.landmark, pincode: formData.pincode,
        coordinates: { type: "Point", coordinates: [Number(formData.longitude), Number(formData.latitude)] },
      }));
      data.append("availability", JSON.stringify({
        type: formData.availabilityType,
        alwaysAvailable: formData.alwaysAvailable,
        weekly: formData.weekly,
      }));
      await axios.post("http://localhost:5000/api/bikes", data, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      alert("Bike submitted for admin approval 🚀");
    } catch (err) {
      alert(err.response?.data?.message || "Error creating bike");
    }
  };

  return (
    <>
      <style>{GLOBAL_CSS}</style>

      {/* PAGE */}
      <div
        className="min-h-screen relative overflow-hidden px-4 pt-12 pb-20"
        style={{ background: "#f5fafa", fontFamily: "'Outfit',sans-serif" }}
      >
        {/* blobs */}
        <div className="fixed top-[-120px] right-[-120px] w-[440px] h-[440px] rounded-full pointer-events-none z-0"
          style={{ background: "radial-gradient(circle,rgba(32,178,170,0.14) 0%,transparent 70%)" }} />
        <div className="fixed bottom-[-160px] left-[-80px] w-[420px] h-[420px] rounded-full pointer-events-none z-0"
          style={{ background: "radial-gradient(circle,rgba(32,178,170,0.09) 0%,transparent 70%)" }} />

        {/* layout grid */}
        <div className="relative z-10 max-w-[1040px] mx-auto grid grid-cols-[260px_1fr] gap-6 items-start max-[820px]:grid-cols-1">

          {/* ── SIDEBAR ── */}
          <div
            className="bg-white border-[1.5px] border-[#ceecea] rounded-[20px] overflow-hidden sticky top-8 shadow-[0_2px_16px_rgba(32,178,170,0.07)] max-[820px]:hidden"
          >
            {/* header */}
            <div className="px-5 pt-6 pb-5" style={{ background: "linear-gradient(135deg,#20b2aa,#178f88)" }}>
              <div className="font-black text-[1.1rem] text-white mb-1" style={{ fontFamily: "'Playfair Display',serif" }}>
                🏍 Publish Your Bike
              </div>
              <div className="text-[0.75rem] text-white/70 font-normal">Complete all 5 steps to go live</div>
            </div>

            {/* steps list */}
            <div className="flex flex-col gap-1 px-3 py-4">
              {STEPS.map((s, i) => {
                const status = st(i, step);
                return (
                  <div
                    key={s.label}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors duration-200 ${status === "active" ? "bg-[#e8f8f7]" : ""}`}
                  >
                    {/* icon circle */}
                    <div
                      className={`w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full text-[0.8rem] font-bold transition-all duration-200
                        ${status === "done"   ? "bg-[#20b2aa] text-white shadow-[0_3px_10px_rgba(32,178,170,0.35)]" : ""}
                        ${status === "active" ? "bg-[#20b2aa] text-white shadow-[0_3px_14px_rgba(32,178,170,0.45)] scale-[1.08]" : ""}
                        ${status === "idle"   ? "bg-[#e8f8f7] text-[#7aadaa] border-[1.5px] border-[#ceecea]" : ""}`}
                    >
                      {i + 1 < step ? <CheckCircle size={15} /> : i + 1}
                    </div>
                    <div>
                      <div className={`text-[0.85rem] font-semibold
                        ${status === "idle"   ? "text-[#7aadaa]" : ""}
                        ${status === "active" ? "text-[#178f88]" : ""}
                        ${status === "done"   ? "text-[#0d2e2c]" : ""}`}
                      >
                        {s.label}
                      </div>
                      <div className="text-[0.7rem] text-[#7aadaa] mt-px">{s.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* progress bar */}
            <div className="mx-4 mb-4 h-[5px] rounded-full overflow-hidden bg-[#e8f8f7] border border-[#ceecea]">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(step / TOTAL_STEPS) * 100}%`,
                  background: "linear-gradient(90deg,#20b2aa,#178f88)",
                }}
              />
            </div>
          </div>

          {/* ── MAIN CARD ── */}
          <div className="bg-white border-[1.5px] border-[#ceecea] rounded-[24px] overflow-hidden shadow-[0_4px_24px_rgba(32,178,170,0.08)]">
            {/* top stripe */}
            <div className="h-1" style={{ background: "linear-gradient(90deg,#20b2aa,#178f88)" }} />

            <div className="px-10 pt-9 pb-8 max-sm:px-5 max-sm:pt-6 max-sm:pb-5">
              <form onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">

                  {/* ── STEP 1 ── */}
                  {step === 1 && (
                    <motion.div key="s1"
                      initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }}
                      exit={{ opacity:0, x:-30 }} transition={{ duration:.28 }}
                    >
                      <StepHeader icon={<Bike size={22} color="#20b2aa" />}
                        title={<>Basic <em className="not-italic text-[#20b2aa]">Details</em></>}
                        sub="Tell us about your bike" step={1} />

                      <SectionLabel>Identity</SectionLabel>
                      <div className="grid grid-cols-2 gap-3.5 mb-3.5 max-sm:grid-cols-1">
                        <Field label="Bike Name *">
                          <Input name="bikeName" value={formData.bikeName} placeholder="e.g. Royal Enfield Classic 350" onChange={handleChange} required />
                        </Field>
                        <Field label="Registration Number *">
                          <Input name="bikeNumber" value={formData.bikeNumber} placeholder="MH12AB1234" onChange={handleChange} required />
                        </Field>
                        <Field label="Brand *">
                          <Input name="brand" value={formData.brand} placeholder="e.g. Royal Enfield" onChange={handleChange} required />
                        </Field>
                        <Field label="Model *">
                          <Input name="model" value={formData.model} placeholder="e.g. Classic 350" onChange={handleChange} required />
                        </Field>
                        <Field label="Year *">
                          <Input type="number" name="year" value={formData.year} placeholder="2022"
                            min="2000" max={new Date().getFullYear()} onChange={handleChange} required />
                        </Field>
                      </div>

                      <SectionLabel>Vehicle Type</SectionLabel>
                      <div className="flex flex-wrap gap-2.5 mb-5">
                        {[{v:"bike",e:"🏍️",l:"Bike"},{v:"scooty",e:"🛵",l:"Scooty"},{v:"electric",e:"⚡",l:"Electric"}].map(({v,e,l}) => (
                          <Chip key={v} active={formData.bikeType === v} onClick={() => setFormData(p => ({...p, bikeType:v}))}>
                            {e} {l}
                          </Chip>
                        ))}
                      </div>

                      <SectionLabel>Description</SectionLabel>
                      <Field label="About your bike">
                        <textarea
                          className="w-full bg-[#f8f9fa] border-[1.5px] border-[#e5e7eb] rounded-[11px] px-3.5 py-3 text-[#0d2e2c] text-[0.93rem] outline-none transition-all duration-200 focus:border-[#20b2aa] focus:shadow-[0_0_0_3px_rgba(32,178,170,0.1)] focus:bg-white placeholder-[#b5c5c4] resize-none min-h-[90px]"
                          name="description" value={formData.description} rows={3} maxLength={1000}
                          placeholder="Condition, special features, riding experience…"
                          onChange={handleChange}
                          style={{ fontFamily: "'Outfit',sans-serif" }}
                        />
                        <div className="text-[0.7rem] text-[#7aadaa] text-right mt-1">{formData.description.length} / 1000</div>
                      </Field>

                      <NavBar>
                        <div />
                        <NextBtn onClick={nextStep}
                          disabled={!formData.bikeName||!formData.bikeNumber||!formData.brand||!formData.model||!formData.year||!formData.bikeType}>
                          Continue <ChevronRight size={15} />
                        </NextBtn>
                      </NavBar>
                    </motion.div>
                  )}

                  {/* ── STEP 2 ── */}
                  {step === 2 && (
                    <motion.div key="s2"
                      initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }}
                      exit={{ opacity:0, x:-30 }} transition={{ duration:.28 }}
                    >
                      <StepHeader icon={<Zap size={22} color="#20b2aa" />}
                        title={<>Specs & <em className="not-italic text-[#20b2aa]">Pricing</em></>}
                        sub="Engine details and rental rates" step={2} />

                      <SectionLabel>Technical Specs</SectionLabel>
                      <div className="grid grid-cols-3 gap-3.5 mb-5 max-sm:grid-cols-1">
                        <Field label="Fuel Type *">
                          <Select name="fuelType" value={formData.fuelType} onChange={handleChange} required>
                            <option value="">Select</option>
                            <option value="petrol">Petrol</option>
                            <option value="electric">Electric</option>
                            <option value="hybrid">Hybrid</option>
                          </Select>
                        </Field>
                        <Field label="Transmission *">
                          <Select name="transmission" value={formData.transmission} onChange={handleChange} required>
                            <option value="">Select</option>
                            <option value="manual">Manual</option>
                            <option value="automatic">Automatic</option>
                          </Select>
                        </Field>
                        <Field label="Engine (cc)">
                          <Input type="number" name="engineCapacity" value={formData.engineCapacity} placeholder="350" onChange={handleChange} />
                        </Field>
                        <Field label="Mileage (km/l)">
                          <Input type="number" name="mileage" value={formData.mileage} placeholder="40" onChange={handleChange} />
                        </Field>
                      </div>

                      <SectionLabel>Pricing (₹)</SectionLabel>
                      <div className="grid grid-cols-2 gap-3.5 mb-5 max-sm:grid-cols-1">
                        <Field label="Per Hour *">
                          <Input type="number" name="perHour" value={formData.perHour} placeholder="50" min="0" onChange={handleChange} required />
                        </Field>
                        <Field label="Per Day *">
                          <Input type="number" name="perDay" value={formData.perDay} placeholder="500" min="0" onChange={handleChange} required />
                        </Field>
                        <Field label="Security Deposit *">
                          <Input type="number" name="securityDeposit" value={formData.securityDeposit} placeholder="2000" min="0" onChange={handleChange} required />
                        </Field>
                        <Field label="Late Fee / Hour">
                          <Input type="number" name="lateFeePerHour" value={formData.lateFeePerHour} placeholder="20" min="0" onChange={handleChange} />
                        </Field>
                      </div>

                      <SectionLabel>Booking Rules</SectionLabel>
                      <div className="grid grid-cols-2 gap-3.5 mb-2 max-sm:grid-cols-1">
                        <Field label="Min Hours">
                          <Input type="number" name="minHours" value={formData.minHours} min="1" onChange={handleChange} />
                        </Field>
                        <Field label="Max Hours">
                          <Input type="number" name="maxHours" value={formData.maxHours} min="1" max="72" onChange={handleChange} />
                        </Field>
                        <Field label="Cancellation Policy">
                          <Select name="cancellationPolicy" value={formData.cancellationPolicy} onChange={handleChange}>
                            <option value="flexible">Flexible</option>
                            <option value="moderate">Moderate</option>
                            <option value="strict">Strict</option>
                          </Select>
                        </Field>
                        <Field label="Options">
                          <label className="flex items-center gap-2.5 px-3.5 py-3 bg-[#f8f9fa] border-[1.5px] border-[#e5e7eb] rounded-[11px] cursor-pointer hover:border-[#20b2aa] transition-colors duration-200">
                            <input type="checkbox" name="instantBooking" checked={formData.instantBooking}
                              onChange={handleChange} className="w-4 h-4 accent-[#20b2aa] cursor-pointer" />
                            <span className="text-[0.88rem] font-medium text-[#3a6662]">⚡ Enable Instant Booking</span>
                          </label>
                        </Field>
                      </div>

                      <NavBar>
                        <BackBtn onClick={prevStep} />
                        <NextBtn onClick={nextStep}
                          disabled={!formData.fuelType||!formData.transmission||!formData.perHour||!formData.perDay||!formData.securityDeposit}>
                          Continue <ChevronRight size={15} />
                        </NextBtn>
                      </NavBar>
                    </motion.div>
                  )}

                  {/* ── STEP 3 ── */}
                  {step === 3 && (
                    <motion.div key="s3"
                      initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }}
                      exit={{ opacity:0, x:-30 }} transition={{ duration:.28 }}
                    >
                      <StepHeader icon={<CheckCircle size={22} color="#20b2aa" />}
                        title={<>Bike <em className="not-italic text-[#20b2aa]">Availability</em></>}
                        sub="When can people rent your bike?" step={3} />

                      <SectionLabel>Availability Type</SectionLabel>
                      <div className="flex flex-wrap gap-2.5 mb-6">
                        {[{v:"always",e:"🟢",l:"Always Available"},{v:"calendar",e:"📅",l:"Custom Schedule"}].map(({v,e,l}) => (
                          <Chip key={v} active={formData.availabilityType===v}
                            onClick={() => setFormData(p => ({...p, availabilityType:v, alwaysAvailable: v==="always"}))}>
                            {e} {l}
                          </Chip>
                        ))}
                      </div>

                      {formData.availabilityType === "calendar" && (
                        <>
                          <SectionLabel>Available Days</SectionLabel>
                          <div className="flex flex-wrap gap-2.5 mb-2">
                            {Object.keys(formData.weekly).map(day => (
                              <Chip key={day} small active={formData.weekly[day]} onClick={() => handleWeeklyToggle(day)}>
                                {day.slice(0,3).charAt(0).toUpperCase()+day.slice(1,3)}
                              </Chip>
                            ))}
                          </div>
                        </>
                      )}

                      <NavBar>
                        <BackBtn onClick={prevStep} />
                        <NextBtn onClick={nextStep}>Continue <ChevronRight size={15} /></NextBtn>
                      </NavBar>
                    </motion.div>
                  )}

                  {/* ── STEP 4 ── */}
                  {step === 4 && (
                    <motion.div key="s4"
                      initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }}
                      exit={{ opacity:0, x:-30 }} transition={{ duration:.28 }}
                    >
                      <StepHeader icon={<MapPin size={22} color="#20b2aa" />}
                        title={<>Pickup <em className="not-italic text-[#20b2aa]">Location</em></>}
                        sub="Where will renters pick up the bike?" step={4} />

                      <SectionLabel>Address</SectionLabel>
                      <div className="grid grid-cols-2 gap-3.5 mb-3.5 max-sm:grid-cols-1">
                        <Field label="City *">
                          <Input name="city" value={formData.city} placeholder="e.g. Nagpur" onChange={handleChange} required />
                        </Field>
                        <Field label="Pincode">
                          <Input name="pincode" value={formData.pincode} placeholder="440001" onChange={handleChange} />
                        </Field>
                        <Field label="Address Line" span2>
                          <Input name="addressLine" value={formData.addressLine} placeholder="Street, Area, Colony" onChange={handleChange} />
                        </Field>
                        <Field label="Landmark" span2>
                          <Input name="landmark" value={formData.landmark} placeholder="e.g. Near SBI Bank" onChange={handleChange} />
                        </Field>
                      </div>

                      <SectionLabel>GPS Coordinates</SectionLabel>
                      <div className="grid grid-cols-2 gap-3.5 mb-2 max-sm:grid-cols-1">
                        <Field label="Latitude *">
                          <Input name="latitude" value={formData.latitude} placeholder="21.1458" onChange={handleChange} required />
                        </Field>
                        <Field label="Longitude *">
                          <Input name="longitude" value={formData.longitude} placeholder="79.0882" onChange={handleChange} required />
                        </Field>
                      </div>
                      <div className="flex items-start gap-1.5 text-[0.75rem] text-[#7aadaa] mt-2">
                        ℹ️ Open Google Maps, right-click your location to copy coordinates.
                      </div>

                      <NavBar>
                        <BackBtn onClick={prevStep} />
                        <NextBtn onClick={nextStep}
                          disabled={!formData.city||!formData.latitude||!formData.longitude}>
                          Continue <ChevronRight size={15} />
                        </NextBtn>
                      </NavBar>
                    </motion.div>
                  )}

                  {/* ── STEP 5 ── */}
                  {step === 5 && (
                    <motion.div key="s5"
                      initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }}
                      exit={{ opacity:0, x:-30 }} transition={{ duration:.28 }}
                    >
                      <StepHeader icon={<FileText size={22} color="#20b2aa" />}
                        title={<>Documents & <em className="not-italic text-[#20b2aa]">Photos</em></>}
                        sub="Required for listing verification" step={5} />

                      <SectionLabel>Required Documents</SectionLabel>
                      <div className="flex flex-col gap-3 mb-5">

                        {/* RC Book */}
                        <UploadCard done={!!documents.rcBook} icon="📋" title="RC Book *" sub="Vehicle Registration Certificate">
                          {documents.rcBook
                            ? <div className="flex items-center gap-1.5 text-[0.8rem] text-[#178f88] font-semibold"><CheckCircle size={14} color="#20b2aa"/>{documents.rcBook.name}</div>
                            : <input type="file" name="rcBook" accept="image/*,.pdf" className="pb-file-input block w-full text-[0.82rem] text-[#6b7280]" onChange={handleDocChange} required />}
                        </UploadCard>

                        {/* Insurance */}
                        <UploadCard done={!!(documents.insurance && documents.insuranceValidTill)} icon="🛡️" title="Insurance Certificate *" sub="Valid insurance document">
                          <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
                            {documents.insurance
                              ? <div className="flex items-center gap-1.5 text-[0.8rem] text-[#178f88] font-semibold"><CheckCircle size={14} color="#20b2aa"/>{documents.insurance.name}</div>
                              : <input type="file" name="insurance" accept="image/*,.pdf" className="pb-file-input block w-full text-[0.82rem] text-[#6b7280]" onChange={handleDocChange} required />}
                            <Field label="Valid Till *">
                              <Input type="date" name="insuranceValidTill" value={documents.insuranceValidTill} onChange={handleDocChange} required />
                            </Field>
                          </div>
                        </UploadCard>

                        {/* PUC */}
                        <UploadCard done={!!(documents.pollution && documents.pollutionValidTill)} icon="🌿" title="Pollution Certificate (PUC) *" sub="Valid PUC certificate">
                          <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
                            {documents.pollution
                              ? <div className="flex items-center gap-1.5 text-[0.8rem] text-[#178f88] font-semibold"><CheckCircle size={14} color="#20b2aa"/>{documents.pollution.name}</div>
                              : <input type="file" name="pollution" accept="image/*,.pdf" className="pb-file-input block w-full text-[0.82rem] text-[#6b7280]" onChange={handleDocChange} required />}
                            <Field label="Valid Till *">
                              <Input type="date" name="pollutionValidTill" value={documents.pollutionValidTill} onChange={handleDocChange} required />
                            </Field>
                          </div>
                        </UploadCard>
                      </div>

                      {/* Photo drop zone */}
                      <SectionLabel>Bike Photos</SectionLabel>
                      <label
                        className={`block rounded-[14px] px-5 py-8 text-center cursor-pointer transition-all duration-200 border-2
                          ${images.length > 0
                            ? "border-solid border-[#20b2aa] bg-[#e8f8f7]"
                            : "border-dashed border-[#e5e7eb] bg-[#f8f9fa] hover:border-[#20b2aa] hover:bg-[#e8f8f7]"}`}
                      >
                        <div className="text-[2.2rem] mb-2">{images.length > 0 ? "✅" : "📸"}</div>
                        <div className="text-[0.88rem] font-medium text-[#3a6662] mb-1">
                          {images.length > 0
                            ? `${images.length} photo${images.length > 1 ? "s" : ""} selected`
                            : "Upload photos of your bike"}
                        </div>
                        <div className="text-[0.75rem] text-[#7aadaa] mb-3.5">
                          Front, back, and side views • Min 2 photos
                        </div>
                        <input type="file" multiple accept="image/*" className="hidden" onChange={handleImages} required />
                        {images.length === 0 && (
                          <span className="inline-block px-5 py-2 bg-[#e8f8f7] text-[#178f88] rounded-full text-[0.8rem] font-bold">
                            Choose Photos
                          </span>
                        )}
                      </label>

                      <NavBar>
                        <BackBtn onClick={prevStep} />
                        <button
                          type="submit"
                          disabled={!documents.rcBook||!documents.insurance||!documents.insuranceValidTill||!documents.pollution||!documents.pollutionValidTill||images.length < 2}
                          className="pb-btn-submit flex items-center gap-2 px-7 py-3 border-none rounded-xl text-white text-base font-bold cursor-pointer relative overflow-hidden transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                          style={{
                            fontFamily: "'Playfair Display',serif",
                            background: "linear-gradient(135deg,#20b2aa,#178f88)",
                            boxShadow: "0 6px 22px rgba(32,178,170,0.4)",
                            letterSpacing: "0.2px",
                          }}
                          onMouseEnter={(e) => { if (!e.currentTarget.disabled) { e.currentTarget.style.boxShadow = "0 10px 30px rgba(32,178,170,0.55)"; e.currentTarget.style.transform = "translateY(-2px)"; }}}
                          onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 6px 22px rgba(32,178,170,0.4)"; e.currentTarget.style.transform = ""; }}
                        >
                          <Upload size={16} /> Submit for Approval
                        </button>
                      </NavBar>
                    </motion.div>
                  )}

                </AnimatePresence>
              </form>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

/* Nav bar wrapper */
const NavBar = ({ children }) => (
  <div
    className="flex justify-between items-center mt-8 pt-6 gap-3"
    style={{ borderTop: "1px solid #ceecea" }}
  >
    {children}
  </div>
);

export default PublishBike;