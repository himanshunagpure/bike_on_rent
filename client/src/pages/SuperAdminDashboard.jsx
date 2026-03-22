import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Bike,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  LayoutDashboard,
  LogOut
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const SuperAdminDashboard = () => { 
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [activePage, setActivePage] = useState("dashboard");
  const [pendingBikes, setPendingBikes] = useState([]);
  const [allBikes, setAllBikes] = useState([]);
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
const [selectedBike, setSelectedBike] = useState(null);

  const [stats, setStats] = useState({
    totalBikes: 0,
    pendingBikes: 0,
    approvedBikes: 0,
    rejectedBikes: 0,
    totalOwners: 0
  });

  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` }
  };

  // ================= ROLE CHECK =================

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      if (payload.role !== "superadmin") {
        alert("Access denied! Only SuperAdmin allowed.");
        navigate("/");
      } else {
        fetchPendingBikes();
        fetchStats();
      }
    } catch (err) {
      navigate("/login");
    }
  }, []);

  // ================= FETCH FUNCTIONS =================

  const fetchPendingBikes = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `${API}/superadmin/pending-bikes`,
        axiosConfig
      );

      setPendingBikes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await axios.get(
        `${API}/superadmin/dashboard-stats`,
        axiosConfig
      );

      setStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAllBikes = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `${API}/superadmin/all-bikes`,
        axiosConfig
      );

      setAllBikes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

 const fetchOwners = async () => {
  try {
    setLoading(true);

    const { data } = await axios.get(
      `${API}/superadmin/owners-with-bikes`,
      axiosConfig
    );

    setOwners(data);
    //  console.log(data);
         console.log("Owners Data:", data); // add this
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  // ================= APPROVE / REJECT =================

  const approveBike = async (id) => {
    await axios.put(`${API}/superadmin/approve-bike/${id}`, {}, axiosConfig);
    fetchPendingBikes();
    fetchStats();
  };

  const rejectBike = async (id) => {
    await axios.put(`${API}/superadmin/reject-bike/${id}`, {}, axiosConfig);
    fetchPendingBikes();
    fetchStats();
  };

  // ================= LOGOUT =================

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // ================= CHART DATA =================

  const chartData = [
    { name: "Total", value: stats.totalBikes },
    { name: "Pending", value: stats.pendingBikes },
    { name: "Approved", value: stats.approvedBikes },
    { name: "Rejected", value: stats.rejectedBikes }
  ];

  // ================= STATUS BADGE =================

  const statusColor = (status) => {
    if (status === "approved") return "bg-green-500";
    if (status === "pending") return "bg-orange-500";
    if (status === "rejected") return "bg-red-500";
    return "bg-gray-500";
  };

  return (
    <div className="min-h-screen bg-slate-100">

      {/* HEADER */}

      <div className="bg-white border-b px-10 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">
          SuperAdmin Dashboard
        </h1>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-slate-600 hover:text-red-500"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>

      <div className="flex">

        {/* SIDEBAR */}

        <div className="w-64 bg-white border-r min-h-screen p-6">

          <div className="space-y-6">

            <div
              onClick={() => setActivePage("dashboard")}
              className="flex items-center gap-3 cursor-pointer text-[#20B2AA] font-semibold"
            >
              <LayoutDashboard size={18} /> Dashboard
            </div>

            <div
              onClick={() => {
                setActivePage("bikes");
                fetchAllBikes();
              }}
              className="flex items-center gap-3 cursor-pointer text-slate-600"
            >
              <Bike size={18} /> Bikes
            </div>

            <div
  onClick={() => {
    setActivePage("owners");
    fetchOwners();
  }}
  className="flex items-center gap-3 cursor-pointer text-slate-600"
>
  <Users size={18} /> Owners
</div>

            <div
              onClick={() => {
                setActivePage("pending");
                fetchPendingBikes();
              }}
              className="flex items-center gap-3 cursor-pointer text-slate-600"
            >
              <Clock size={18} /> Pending Approvals
            </div>

          </div>
        </div>

        {/* MAIN */}

        <div className="flex-1 p-10">

          {loading && (
            <p className="text-center text-slate-500 mb-6">Loading...</p>
          )}

          {/* DASHBOARD */}

          {activePage === "dashboard" && (
            <>
              <div className="grid md:grid-cols-4 gap-6 mb-10">

                <div className="bg-white p-6 rounded-xl shadow">
                  <p className="text-slate-400 text-sm">Total Bikes</p>
                  <h2 className="text-3xl font-bold text-[#20B2AA]">
                    {stats.totalBikes}
                  </h2>
                </div>

                <div className="bg-white p-6 rounded-xl shadow">
                  <p className="text-slate-400 text-sm">Pending</p>
                  <h2 className="text-3xl font-bold text-orange-500">
                    {stats.pendingBikes}
                  </h2>
                </div>

                <div className="bg-white p-6 rounded-xl shadow">
                  <p className="text-slate-400 text-sm">Owners</p>
                  <h2 className="text-3xl font-bold text-blue-500">
                    {stats.totalOwners}
                  </h2>
                </div>

                <div className="bg-white p-6 rounded-xl shadow">
                  <p className="text-slate-400 text-sm">Approved</p>
                  <h2 className="text-3xl font-bold text-green-500">
                    {stats.approvedBikes}
                  </h2>
                </div>

              </div>

              {/* CHART */}

              <div className="bg-white p-6 rounded-xl shadow">

                <h2 className="font-bold mb-6 text-lg">Bike Analytics</h2>

                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#20B2AA" />
                  </BarChart>
                </ResponsiveContainer>

              </div>
            </>
          )}

          {/* ALL BIKES */}

          {activePage === "bikes" && (
            <div>

              <input
                type="text"
                placeholder="Search bikes..."
                className="border px-4 py-2 rounded mb-6 w-64"
                onChange={(e) => setSearch(e.target.value)}
              />

              <div className="grid md:grid-cols-3 gap-6">

               {allBikes
  .filter((bike) =>
    bike.bikeName?.toLowerCase().includes(search.toLowerCase())
  )
  .map((bike, index) => (

<div 
key={bike._id || index}
className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">

  <img
    src={bike.images?.[0]}
    alt="bike"
    className="w-full h-44 object-cover"
  />

  <div className="p-4 space-y-2">

    <h3 className="text-lg font-bold text-slate-800">
      {bike.bikeName}
    </h3>

    <p className="text-sm text-slate-500">
      Owner: <span className="font-medium">{bike.owner?.fullName}</span>
    </p>

    <p className="text-sm text-slate-500">
      City: {bike.location?.city}
    </p>

    <div className="flex justify-between items-center mt-2">

      <span className="text-green-600 font-bold">
        ₹{bike.pricing?.perDay}/day
      </span>

      <span
        className={`text-white text-xs px-2 py-1 rounded ${statusColor(
          bike.adminStatus
        )}`}
      >
        {bike.adminStatus}
      </span>

    </div>

  </div>

</div>
          ))}

              </div>
            </div>
          )}

          {/* OWNERS */}

{activePage === "owners" && (

<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

{owners.map((bike) => (

<div key={bike._id} className="bg-white rounded-xl shadow-lg overflow-hidden">

  <img
    src={bike.images?.[0]}
    alt="bike"
    className="w-full h-44 object-cover"
  />

  <div className="p-4 space-y-3">

    <h2 className="text-lg font-bold text-[#20B2AA]">
      {bike.bikeName}
    </h2>

    <div className="text-sm text-slate-600 space-y-1">

      <p><b>Owner:</b> {bike.owner?.fullName}</p>
      <p><b>Email:</b> {bike.owner?.email}</p>
      <p><b>Phone:</b> {bike.owner?.phone}</p>

      <p><b>Number:</b> {bike.bikeNumber}</p>
      <p><b>Brand:</b> {bike.brand}</p>
      <p><b>Model:</b> {bike.model}</p>
      <p><b>Fuel:</b> {bike.fuelType}</p>

      <p><b>City:</b> {bike.location?.city}</p>

    </div>

    <div className="flex justify-between items-center pt-2">

      <span className="text-green-600 font-bold">
        ₹{bike.pricing?.perDay}/day
      </span>

      <span className="text-orange-500 text-sm">
        Deposit ₹{bike.securityDeposit}
      </span>

    </div>

  </div>

</div>

))}

</div>

)}
          {/* PENDING */}
          {activePage === "pending" && (
            <div className="space-y-6">

              {pendingBikes.map((bike) => (

                <div
key={bike._id}
className="bg-white p-6 rounded-xl shadow flex justify-between items-center"
>

<div>

<h3 className="font-bold text-lg">{bike.bikeName}</h3>

<p className="text-sm text-slate-500">
Owner: {bike.owner?.fullName}
</p>

<p className="text-sm text-slate-500">
City: {bike.location?.city}
</p>

</div>

<div className="flex gap-3">

<button
onClick={() => setSelectedBike(bike)}
className="bg-blue-500 text-white px-4 py-2 rounded"
>
View Details
</button>

<button
onClick={() => approveBike(bike._id)}
className="bg-green-500 text-white px-4 py-2 rounded"
>
Approve
</button>

<button
onClick={() => rejectBike(bike._id)}
className="bg-red-500 text-white px-4 py-2 rounded"
>
Reject
</button>

</div>

</div>

              ))}

            </div>
          )}
{selectedBike && (

<div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

<div className="bg-white w-[900px] max-h-[90vh] overflow-y-auto rounded-xl p-6">

<h2 className="text-xl font-bold mb-4">
Bike Verification
</h2>

{/* Bike Images */}

<div className="grid grid-cols-3 gap-3 mb-6">
{selectedBike.images?.map((img,i)=>(
<img key={i} src={img} className="h-32 w-full object-cover rounded"/>
))}
</div>

{/* Owner Info */}

<h3 className="font-semibold text-lg mb-2">Owner Information</h3>

<p>Name: {selectedBike.owner?.fullName}</p>
<p>Email: {selectedBike.owner?.email}</p>
<p>Phone: {selectedBike.owner?.phone}</p>

{/* Bike Details */}

<h3 className="font-semibold text-lg mt-4 mb-2">Bike Details</h3>

<p>Number: {selectedBike.bikeNumber}</p>
<p>Brand: {selectedBike.brand}</p>
<p>Model: {selectedBike.model}</p>
<p>Year: {selectedBike.year}</p>
<p>Fuel: {selectedBike.fuelType}</p>
<p>Transmission: {selectedBike.transmission}</p>

{/* Pricing */}

<h3 className="font-semibold text-lg mt-4 mb-2">Pricing</h3>

<p>Per Hour: ₹{selectedBike.pricing?.perHour}</p>
<p>Per Day: ₹{selectedBike.pricing?.perDay}</p>
<p>Deposit: ₹{selectedBike.securityDeposit}</p>

{/* Location */}

<h3 className="font-semibold text-lg mt-4 mb-2">Location</h3>

<p>City: {selectedBike.location?.city}</p>
<p>Address: {selectedBike.location?.addressLine}</p>

{/* Documents */}


<h3 className="font-semibold text-lg mt-4 mb-2">Documents</h3>

<div className="grid grid-cols-3 gap-3">

<a href={selectedBike.documents?.rcBook?.url} target="_blank">
RC Book
</a>

<a href={selectedBike.documents?.insurance?.url} target="_blank">
Insurance
</a>

<a href={selectedBike.documents?.pollution?.url} target="_blank">
Pollution
</a>

</div>

<div className="flex gap-3 mt-6">

<button
onClick={() => approveBike(selectedBike._id)}
className="bg-green-500 text-white px-4 py-2 rounded"
>
Approve
</button>

<button
onClick={() => rejectBike(selectedBike._id)}
className="bg-red-500 text-white px-4 py-2 rounded"
>
Reject
</button>

<button
onClick={() => setSelectedBike(null)}
className="border px-4 py-2 rounded"
>
Close
</button>

</div>

</div>

</div>

)}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;